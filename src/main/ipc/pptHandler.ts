import { ipcMain, dialog } from 'electron';
import PptxGenJS from 'pptxgenjs';
import { generatePPT } from '../utils/generatePPT';
import { fetchVerses } from '../utils/parseVerse';

export function registerPPTHandler(): void {
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
        align: 'left' | 'center' | 'right';
        font: string;
        isBold: '가늘게' | '굵게';
        textSize: number;
        letterSpacing: number;
        lineHeight: number;
      }
    ) => {
      try {
        const { input, bibleVersion, align, font, isBold, textSize, letterSpacing, lineHeight } =
          data;
        const verses = fetchVerses(input, bibleVersion);

        let fontWeight;
        if (isBold === '가늘게') {
          fontWeight = false;
        } else {
          fontWeight = true;
        }

        let pptx: PptxGenJS | undefined;

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
              align,
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
              align,
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
}
