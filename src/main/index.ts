import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import path, { join } from 'path';
import PptxGenJS from 'pptxgenjs';
import { generatePPT } from './utils/generatePPT.ts';
import { fetchVerses } from './utils/parseVerse.ts';

let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1020,
    height: 720,
    resizable: false,
    icon: join(__dirname, '../../build/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.cjs'),
      sandbox: false, // contextBridge를 사용하려면 sandbox는 false여야 합니다.
    },
  });

  if (app.isPackaged) {
    // 프로덕션 환경: 빌드된 renderer의 index.html 파일을 로드
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
    // mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    // 개발 환경: electron-vite가 제공하는 개발 서버 URL을 로드
    mainWindow.loadURL(process.env['VITE_DEV_SERVER_URL'] as string);
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// -------------------------
// IPC 핸들러: 성경 구절 가져오기
// -------------------------
ipcMain.handle('fetch-verse', (event, input: string, version: string = 'GAE') => {
  try {
    const verses = fetchVerses(input, version);
    return verses;
  } catch (err: unknown) {
    return [`Error: ${(err as Error).message}`];
  }
});

// -------------------------
// IPC 핸들러: PPT 생성하기
// -------------------------
ipcMain.handle(
  'generate-slide',
  async (
    event,
    data: {
      input: string;
      bibleVersion: string;
      font: string;
      isBold: '가늘게' | '굵게';
      textSize: number;
      letterSpacing: number;
      lineHeight: number;
    }
  ) => {
    try {
      const { input, bibleVersion, font, isBold, textSize, letterSpacing, lineHeight } = data;
      const verses = fetchVerses(input, bibleVersion);

      let fontWeight;
      if (isBold === '가늘게') {
        fontWeight = false;
      } else {
        fontWeight = true;
      }

      let pptx: PptxGenJS;

      verses.forEach((verse, idx) => {
        const title = `${verse.split(':')[1]} ${verse.split(':')[3]}장 ${verse.split(':')[4]}절`;
        const subTitle = `${verse.split(':')[1]} ${verse.split(':')[3]}장`;
        const engTitle = `${verse.split(':')[2]} ${verse.split(':')[3]}:${verse.split(':')[4]}`;
        const engSubTitle = `${verse.split(':')[2]} ${verse.split(':')[3]}`;
        const verseContent = `${verse.split(':')[5]}`;

        if (bibleVersion === 'KJV' || bibleVersion === 'NIV') {
          // 영어 버전인 경우, 제목과 소제목을 영어로 구성
          pptx = generatePPT(
            engTitle,
            engSubTitle,
            verseContent,
            font,
            fontWeight,
            textSize,
            letterSpacing,
            lineHeight,
            pptx
          );
        } else {
          // pptx가 undefined이면 새로 생성, 있으면 슬라이드 추가
          pptx = generatePPT(
            title,
            subTitle,
            verseContent,
            font,
            fontWeight,
            textSize,
            letterSpacing,
            lineHeight,
            pptx
          );
        }
      });

      // 파일 저장 다이얼로그
      const saveFileName = input.replace(/^([가-힣a-zA-Z]+)\s*(\d+)[:|-](.*)$/, '$1$2장$3절');

      const { filePath } = await dialog.showSaveDialog({
        title: 'Save PowerPoint File',
        defaultPath: `${saveFileName}.pptx`,
        filters: [{ name: 'PowerPoint', extensions: ['pptx'] }],
      });

      if (filePath) {
        await pptx!.writeFile({ fileName: filePath });
        return { success: true, message: `파일이 ${filePath}에 저장되었습니다.` };
      }

      return { success: false, message: '파일 저장이 취소되었습니다.' };
    } catch (err: unknown) {
      return `PPT 슬라이드 생성 오류:  ${(err as Error).message}`;
    }
  }
);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
