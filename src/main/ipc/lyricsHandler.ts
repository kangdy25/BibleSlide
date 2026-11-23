import { BrowserWindow, dialog, ipcMain, nativeImage, type WebContents } from 'electron';
import { randomUUID } from 'node:crypto';
import { open, rename, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join } from 'node:path';
import { hexColor, lyricsLimits, type BackgroundChoice, type LyricsExport, type SaveResult } from '../../shared/lyrics';
import { generateLyricsPPT, type LyricsBackgroundImage } from '../utils/generateLyricsPPT';

const maxImageBytes = 12 * 1024 * 1024;
const backgrounds = new WeakMap<WebContents, { id: string; image: LyricsBackgroundImage }>();
const choosing = new WeakSet<WebContents>();
const saving = new WeakSet<WebContents>();

function validExport(value: unknown): value is LyricsExport {
  if (!value || typeof value !== 'object') return false;
  const data = value as LyricsExport;
  return typeof data.title === 'string' && !!data.title.trim() && data.title.length <= lyricsLimits.title &&
    Array.isArray(data.slides) && data.slides.length > 0 && data.slides.length <= lyricsLimits.slides &&
    data.slides.every(text => typeof text === 'string' && !!text.trim() && text.length <= lyricsLimits.segment) &&
    (data.ratio === 'wide' || data.ratio === 'led') &&
    typeof data.color === 'string' && hexColor.test(data.color) &&
    typeof data.background === 'string' && hexColor.test(data.background) &&
    typeof data.font === 'string' && !!data.font.trim() && data.font.length <= 100 &&
    typeof data.size === 'number' && Number.isFinite(data.size) && data.size >= 12 && data.size <= 120 &&
    (data.letterSpacing === undefined ||
      (typeof data.letterSpacing === 'number' && Number.isFinite(data.letterSpacing) &&
        data.letterSpacing >= 0 && data.letterSpacing <= 20)) &&
    (data.lineHeight === undefined ||
      (typeof data.lineHeight === 'number' && Number.isFinite(data.lineHeight) &&
        data.lineHeight >= 1 && data.lineHeight <= 3)) &&
    typeof data.bold === 'boolean' && ['left', 'center', 'right'].includes(data.align) &&
    (data.imageId === undefined || (typeof data.imageId === 'string' && data.imageId.length === 36));
}

export function registerLyricsHandler() {
  ipcMain.handle('choose-lyrics-background', async ({ sender }): Promise<BackgroundChoice> => {
    if (choosing.has(sender)) return { status: 'canceled' };
    choosing.add(sender);
    try {
      const window = BrowserWindow.fromWebContents(sender);
      const options = { title: '찬양 배경 선택', properties: ['openFile' as const],
        filters: [{ name: '이미지', extensions: ['png', 'jpg', 'jpeg'] }] };
      const result = await (window ? dialog.showOpenDialog(window, options) : dialog.showOpenDialog(options));
      if (result.canceled || !result.filePaths[0]) return { status: 'canceled' };
      const path = result.filePaths[0];
      const extension = extname(path).toLowerCase();
      if (!['.png', '.jpg', '.jpeg'].includes(extension)) throw new Error('PNG 또는 JPEG를 선택해 주세요.');

      const file = await open(path, 'r');
      let buffer: Buffer;
      try {
        const stats = await file.stat();
        if (!stats.isFile() || stats.size > maxImageBytes) throw new Error('12MB 이하 이미지 파일을 선택해 주세요.');
        const storage = Buffer.alloc(stats.size + 1);
        const { bytesRead } = await file.read(storage, 0, storage.length, 0);
        if (bytesRead !== stats.size) throw new Error('이미지 파일이 변경되었습니다. 다시 선택해 주세요.');
        buffer = storage.subarray(0, bytesRead);
      } finally {
        await file.close();
      }

      const png = buffer.subarray(0, 8).toString('hex') === '89504e470d0a1a0a';
      const jpeg = buffer.subarray(0, 3).toString('hex') === 'ffd8ff';
      if (extension === '.png' ? !png : !jpeg) throw new Error('이미지 형식과 확장자가 일치하지 않습니다.');
      const image = nativeImage.createFromBuffer(buffer);
      const { width, height } = image.getSize();
      if (image.isEmpty() || width * height > 40_000_000) throw new Error('읽을 수 없거나 해상도가 너무 큰 이미지입니다.');
      const previewImage = Math.max(width, height) > 1000
        ? image.resize(width >= height ? { width: 1000 } : { height: 1000 })
        : image;
      const preview = previewImage.toDataURL();
      const id = randomUUID();
      backgrounds.set(sender, { id, image: {
        width, height, data: `data:image/${png ? 'png' : 'jpeg'};base64,${buffer.toString('base64')}`,
      } });
      return { status: 'selected', id, preview };
    } catch (error) {
      return { status: 'error', message: error instanceof Error ? error.message : '이미지를 열 수 없습니다.' };
    } finally {
      choosing.delete(sender);
    }
  });

  ipcMain.handle('release-lyrics-background', ({ sender }, id: unknown) => {
    if (backgrounds.get(sender)?.id === id) backgrounds.delete(sender);
  });

  ipcMain.handle('generate-lyrics-slide', async ({ sender }, data: unknown): Promise<SaveResult> => {
    if (!validExport(data)) return { success: false, message: '제목, 가사와 디자인 설정을 확인해 주세요.' };
    if (saving.has(sender)) return { success: false, message: '이미 저장 중입니다.' };
    saving.add(sender);
    let tempPath: string | undefined;
    try {
      const background = backgrounds.get(sender);
      if (data.imageId && data.imageId !== background?.id) throw new Error('배경 이미지를 다시 선택해 주세요.');
      const window = BrowserWindow.fromWebContents(sender);
      const safeName = data.title.replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_').replace(/[. ]+$/g, '').trim();
      const title = !safeName || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(safeName)
        ? '찬양 슬라이드'
        : safeName;
      const options = { title: '찬양 PowerPoint 저장', defaultPath: title.replace(/\.pptx$/i, '') + '.pptx',
        filters: [{ name: 'PowerPoint', extensions: ['pptx'] }] };
      const result = await (window ? dialog.showSaveDialog(window, options) : dialog.showSaveDialog(options));
      if (result.canceled || !result.filePath) return { success: false, canceled: true, message: '저장을 취소했습니다.' };
      const destination = /\.pptx$/i.test(result.filePath) ? result.filePath : result.filePath + '.pptx';
      const deck = generateLyricsPPT(data, data.imageId ? background?.image : undefined);
      const bytes = await deck.write({ outputType: 'nodebuffer' });
      tempPath = join(dirname(destination), '.worshipslide-' + randomUUID() + '.tmp');
      await writeFile(tempPath, bytes as Buffer, { flag: 'wx' });
      await rename(tempPath, destination);
      return { success: true, message: basename(destination) + ' 저장을 완료했습니다.' };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : '찬양 PPT를 저장할 수 없습니다.' };
    } finally {
      saving.delete(sender);
      if (tempPath) await rm(tempPath, { force: true }).catch(() => undefined);
    }
  });
}
