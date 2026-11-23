import type { BibleFormat } from '../src/shared/slideLayouts';
import type { LyricsExport, BackgroundChoice, SaveResult } from '../src/shared/lyrics';

export interface SlideDataType {
  input: string;
  align: 'left' | 'center' | 'right';
  format?: BibleFormat;
  bibleVersion: string;
  font: string;
  textSize: number;
  isBold: '가늘게' | '굵게';
  letterSpacing: number;
  lineHeight: number;
}

declare global {
  interface Window {
    electronAPI: {
      fetchVerse: (input: string, version: string) => Promise<string[]>;
      generateSlide: (data: SlideDataType) => Promise<SaveResult>;
      chooseLyricsBackground: () => Promise<BackgroundChoice>;
      releaseLyricsBackground: (id: string) => Promise<void>;
      generateLyrics: (data: LyricsExport) => Promise<SaveResult>;
      showAlert: (message: string, type?: 'info' | 'warning' | 'error') => Promise<{ success: boolean }>;
    };
  }
}
