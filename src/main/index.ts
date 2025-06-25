import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import { getVerseText } from "./utils/crawler";
import { createPPT } from "./utils/pptMaker";

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

ipcMain.handle("generate-ppt", async (_event, input: string) => {
  try {
    const match = input.match(/([가-힣]+)(\d+):(\d+)/);
    if (!match) throw new Error("입력 형식 오류");
    const [_, book, chapter, verse] = match;
    // 간단히 book을 숫자로 변환하는 예시
    const bookMap: Record<string, number> = { 창: 1, 출: 2, 레: 3, 민: 4, 신: 5 };
    const bookNum = bookMap[book];
    if (!bookNum) throw new Error("지원하지 않는 책 이름");
    const verseText = await getVerseText(bookNum, chapter, verse);
    await createPPT(`${book}${chapter}:${verse}`, verseText);
    return "PPT 생성 완료!";
  } catch (err: any) {
    return `오류: ${err.message}`;
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
