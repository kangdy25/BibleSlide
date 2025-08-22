import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { generatePPT } from './main/utils/generatePPT.ts';

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

ipcMain.handle('generate-slide', async (event, data) => {
  // UI 데이터를 사용하지 않고, 테스트용 고정 데이터를 사용합니다.
  const testTitle = '요한복음 6:22';
  const testContent = `이튿날 바다 건너편에 서 있던 무리가 배 한 척 외에
 다른 배가 거기 없는 것과 또 어제 예수께서
 제자들과 함께 그 배에 오르지 아니하시고 제자들만
 가는 것을 보았더니
 `;

  try {
    // createPPT 함수에 고정된 데이터를 전달하여 PPT 객체 생성
    const pptx = generatePPT(testTitle, testContent);

    const { filePath } = await dialog.showSaveDialog({
      title: 'Save PowerPoint File',
      defaultPath: `${testTitle}.pptx`,
      filters: [{ name: 'PowerPoint', extensions: ['pptx'] }],
    });

    if (filePath) {
      await pptx.writeFile({ fileName: filePath });
      return { success: true, message: `File saved to ${filePath}` };
    }
    return { success: false, message: 'File save cancelled' };
  } catch (error: any) {
    console.error('Error generating slide:', error);
    return { success: false, message: `Error generating slide: ${error.message}` };
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
