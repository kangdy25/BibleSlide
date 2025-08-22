export interface SlideDataType {
  verse: string;
  font: string;
  textSize: number;
  letterSpacing: number;
  lineHeight: number;
}

declare global {
  interface Window {
    electronAPI: {
      fetchVerse: (input: string) => Promise<string>;
      generateSlide: (
        data: SlideDataType
      ) => Promise<{ success: boolean; message: string }>;
    };
  }
}