import { ipcMain, dialog, BrowserWindow } from 'electron';
import PptxGenJS from 'pptxgenjs';
import { generatePPT } from '../utils/generatePPT';
import { fetchVerses, parseInput } from '../utils/parseVerse';

export function registerPPTHandler(): void {
  ipcMain.handle(
    'generate-slide',
    async (
      event,
      data: {
        input: string;
        bibleVersion: string;
        align: 'left' | 'center' | 'right';
        font: string;
        isBold: '가늘게' | '굵게';
        textSize: number;
        letterSpacing: number;
        lineHeight: number;
      }
    ) => {
      try {
        const { input, bibleVersion, align } = data;
        const verses = fetchVerses(input, bibleVersion);

        let pptx: PptxGenJS | undefined;

        verses.forEach((verse, idx) => {
          const title = `${verse.split(':')[1]} ${verse.split(':')[3]}장 ${verse.split(':')[4]}절`;
          const subTitle = `${verse.split(':')[1]} ${verse.split(':')[3]}장`;
          const engTitle = `${verse.split(':')[2]} ${verse.split(':')[3]}:${verse.split(':')[4]}`;
          const engSubTitle = `${verse.split(':')[2]} ${verse.split(':')[3]}`;
          const verseContent = `${verse.split(':')[5]}`;

          if (bibleVersion === 'KJV' || bibleVersion === 'NIV') {
            // ★ 수정된 부분
            pptx = generatePPT(
              engTitle,
              engSubTitle,
              verseContent,
              align,
              pptx
            );
          } else {
            // ★ 수정된 부분
            pptx = generatePPT(
              title,
              subTitle,
              verseContent,
              align,
              pptx
            );
          }
        });

        // 파일 저장 다이얼로그
        const webContents = event.sender;
        const win = webContents ? BrowserWindow.fromWebContents(webContents) : null;

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
        const { filePath } = resultDialog;

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