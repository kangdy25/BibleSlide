import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { generatePPT } from './main/utils/generatePPT.ts';
import { fetchVerses } from './main/utils/parseVerse.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1020,
    height: 640,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
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
    return verses; // 배열 반환
  } catch (err: any) {
    return [`Error: ${err.message}`];
  }
});

ipcMain.handle('generate-slide', async (event, data: { input: string; bibleVersion: string }) => {
  try {
    const { input, bibleVersion } = data;
    const verses = fetchVerses(input, bibleVersion);

    let pptx: any; // pptx 객체는 generatePPT에서 관리
    verses.forEach((verse, idx) => {
      console.log(verse);
      const title = `${verse.split(':')[1]} ${verse.split(':')[3]}장 ${verse.split(':')[4]}절`;
      const subTitle = `${verse.split(':')[1]} ${verse.split(':')[3]}장`;
      const engTitle = `${verse.split(':')[2]} ${idx + 1}`;
      const engSubTitle = `${verse.split(':')[2]} ${idx + 1}`;
      const verseContent = `${verse.split(':')[5]}`;
      pptx = generatePPT(title, subTitle, verseContent, pptx); // pptx가 undefined이면 새로 생성, 있으면 슬라이드 추가
    });

    // 파일 저장 다이얼로그
    const saveFileName = input.replace(/^([가-힣a-zA-Z]+)\s*(\d+)[:|-](.*)$/, '$1$2장$3절');

    const { filePath } = await dialog.showSaveDialog({
      title: 'Save PowerPoint File',
      defaultPath: `${saveFileName}.pptx`,
      filters: [{ name: 'PowerPoint', extensions: ['pptx'] }],
    });

    if (filePath) {
      await pptx.writeFile({ fileName: filePath });
      return { success: true, message: `File saved to ${filePath}` };
    }

    return { success: false, message: 'File save cancelled' };
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error generating slide:', err.message);
      return { success: false, message: `Error: ${err.message}` };
    } else {
      console.error('Unexpected error:', err);
      return { success: false, message: 'Unexpected error occurred' };
    }
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
