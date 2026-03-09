import { app, BrowserWindow } from 'electron';
import path, { join } from 'path';
import { checkForUpdates, setupAutoUpdater } from './services/updater.ts';
import { registerVerseHandler } from './ipc/verseHandler.ts';
import { registerPPTHandler } from './ipc/pptHandler.ts';

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

  const devServerUrl = process.env.ELECTRON_RENDERER_URL;

  // Vite 개발 서버 URL이 있으면 개발 환경으로 간주
  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl);
    // 개발자 도구를 열어 디버깅을 쉽게 할 수 있습니다.
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    // URL이 없으면 프로덕션 환경으로 간주하고 빌드된 파일을 로드
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

// AutoUpdater 설정 초기화
setupAutoUpdater();

// IPC 핸들러 등록
registerVerseHandler();
registerPPTHandler();

app.whenReady().then(() => {
  createWindow();

  if (app.isPackaged) {
    checkForUpdates();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
