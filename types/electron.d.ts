export interface SlideDataType {
  input: string;
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
      fetchVerse: (input: string, version: string) => Promise<string>;
      generateSlide: (data: SlideDataType) => Promise<{ success: boolean; message: string }>;
    };
  }
}
