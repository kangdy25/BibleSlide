import { ipcMain, dialog, BrowserWindow } from 'electron';
import type { SlideDataType } from '../../../types/electron';
import { BIBLE_VERSIONS } from '../constant/bible';
import { biblePanels } from '../../shared/slideLayouts';
import { mayOverflow } from '../../shared/textOverflow';
import { addBibleSlide } from '../utils/addBibleSlide';
import { createSlideDeck } from '../utils/slideDeck';
import PptxGenJS from 'pptxgenjs';
import { generatePPT } from '../utils/generatePPT';
import { fetchVerses, parseInput } from '../utils/parseVerse';

export function registerPPTHandler(): void {
  // -------------------------
  // IPC 핸들러: PPT 생성하기
  // -------------------------
  ipcMain.handle(
    'generate-slide',
    async (event, data: SlideDataType) => {
      try {
        const { input, bibleVersion, align, font, isBold, textSize, letterSpacing, lineHeight, format = 'legacy' } = data;
        if (typeof input !== 'string' || input.length > 256 ||
          !BIBLE_VERSIONS.some(version => version === bibleVersion) ||
          !['left', 'center', 'right'].includes(align) ||
          typeof font !== 'string' || !font.trim() || font.length > 200 ||
          !['가늘게', '굵게'].includes(isBold) ||
          ![textSize, letterSpacing, lineHeight].every(Number.isFinite) ||
          textSize <= 0 || textSize > 400 || Math.abs(letterSpacing) > 100 ||
          lineHeight <= 0 || lineHeight > 10 || !['legacy', 'wide', 'led'].includes(format)) {
          throw new Error('성경 슬라이드 설정을 확인해 주세요.');
        }
        const verses = fetchVerses(input, bibleVersion);
        const english = bibleVersion === 'KJV' || bibleVersion === 'NIV';
        let pptx: PptxGenJS | undefined = format === 'legacy' ? undefined : createSlideDeck(format);
        let overflow = false;

        for (const verse of verses) {
          const [, book, englishBook, chapter, number, legacyText, ...remainingText] = verse.split(':');
          const title = english ? `${englishBook} ${chapter}:${number}` : `${book} ${chapter}장 ${number}절`;
          const source = english ? `${englishBook} ${chapter}` : `${book} ${chapter}장`;
          if (format === 'legacy') {
            pptx = generatePPT(title, source, legacyText ?? 'undefined', align, font, isBold === '굵게', textSize, letterSpacing, lineHeight, pptx);
          } else {
            const body = [legacyText, ...remainingText].join(':');
            const { w, bodyInsetLeft, bodyInsetRight } = biblePanels(format)[0];
            overflow ||= mayOverflow(body, textSize, w - bodyInsetLeft - bodyInsetRight, 5.25, lineHeight, letterSpacing);
            addBibleSlide(pptx!, format, title, source, body, data);
          }
        }
        if (!pptx || !verses.length) throw new Error('저장할 구절이 없습니다.');

        // 파일 저장 다이얼로그
        const webContents = event.sender;
        const win = webContents ? BrowserWindow.fromWebContents(webContents) : null;

        // parseInput을 사용하여 안전하게 파일명 작성
        let saveFileName = '';
        try {
          const parsed = parseInput(input);
          if (parsed.startVerse === undefined) {
            saveFileName = `${parsed.book}${parsed.chapter}장`;
          } else if (parsed.startVerse === parsed.endVerse) {
            saveFileName = `${parsed.book}${parsed.chapter}장${parsed.startVerse}절`;
          } else {
            saveFileName = `${parsed.book}${parsed.chapter}장${parsed.startVerse}-${parsed.endVerse}절`;
          }
        } catch {
          // 예외 상황 시 기존 정규식 백업
          saveFileName = input.replace(/^([가-힣a-zA-Z]+)\s*(\d+)[:|-](.*)$/, '$1$2장$3절');
        }

        const dialogOptions = {
          title: 'Save PowerPoint File',
          defaultPath: `${saveFileName}.pptx`,
          filters: [{ name: 'PowerPoint', extensions: ['pptx'] }],
        };

        let resultDialog;
        if (win) {
          resultDialog = await dialog.showSaveDialog(win, dialogOptions);
        } else {
          resultDialog = await dialog.showSaveDialog(dialogOptions);
        }
        const { filePath, canceled } = resultDialog;

        if (filePath && !canceled) {
          const destination = /\.pptx$/i.test(filePath) ? filePath : filePath + '.pptx';
          await pptx.writeFile({ fileName: destination });
          return { success: true, message: `파일이 ${destination}에 저장되었습니다.${overflow ? '\n긴 구절의 줄바꿈과 글자 크기를 확인해 주세요.' : ''}` };
        }

        return { success: false, canceled: true, message: '파일 저장이 취소되었습니다.' };
      } catch (err: unknown) {
        return { success: false, message: err instanceof Error ? err.message : 'PPT 생성 중 오류가 발생했습니다.' };
      }
    }
  );

  // -------------------------
  // IPC 핸들러: 네이티브 경고/알림 창 띄우기
  // -------------------------
  ipcMain.handle(
    'show-alert',
    async (event, message: string, type: 'info' | 'warning' | 'error' = 'info') => {
      const webContents = event.sender;
      const win = webContents ? BrowserWindow.fromWebContents(webContents) : null;
      const title = type === 'error' ? '오류' : type === 'warning' ? '경고' : '알림';

      const dialogOptions = {
        type,
        title,
        message,
        buttons: ['확인'],
      };

      if (win) {
        await dialog.showMessageBox(win, dialogOptions);
        return { success: true };
      } else {
        await dialog.showMessageBox(dialogOptions);
        return { success: true };
      }
    }
  );
}
