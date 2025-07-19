import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";

let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

ipcMain.handle("fetch-verse", async (_event, input: string) => {
  try {
    
  } catch (err: any) {
    return `오류: ${err.message}`;
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
