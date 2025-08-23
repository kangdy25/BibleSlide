import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { generatePPT } from './main/utils/generatePPT.ts';
import { fetchVerses } from './main/utils/parseVerse.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
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

ipcMain.handle('generate-slide', async (event, data: { input: string; version?: string }) => {
  try {
    const { input, version = 'GAE' } = data;
    const verses = fetchVerses(input, version);
    console.log(verses);

    let pptx: any; // pptx 객체는 generatePPT에서 관리
    verses.forEach((verse, idx) => {
      const title = `${input.split(':')[0]}:${idx + 1}`;
      pptx = generatePPT(title, verse, pptx); // pptx가 undefined이면 새로 생성, 있으면 슬라이드 추가
    });

    // 파일 저장 다이얼로그
    const { filePath } = await dialog.showSaveDialog({
      title: 'Save PowerPoint File',
      defaultPath: `${input.replace(':', '-')}.pptx`,
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
