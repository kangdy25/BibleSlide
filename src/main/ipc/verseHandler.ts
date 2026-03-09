import { ipcMain } from 'electron';
import { fetchVerses } from '../utils/parseVerse';

export function registerVerseHandler(): void {
  // -------------------------
  // IPC 핸들러: 성경 구절 가져오기
  // -------------------------
  ipcMain.handle('fetch-verse', (event, input: string, bibleVersion: string = 'GAE') => {
    try {
      const verses = fetchVerses(input, bibleVersion);
      return verses;
    } catch (err: unknown) {
      return [`Error: ${(err as Error).message}`];
    }
  });
}
