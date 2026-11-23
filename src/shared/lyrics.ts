import type { SlideRatio } from './slideLayouts';

export type SaveResult =
  | { success: true; message: string; canceled?: never }
  | { success: false; message: string; canceled?: boolean };

export type BackgroundChoice =
  | { status: 'selected'; id: string; preview: string }
  | { status: 'canceled' }
  | { status: 'error'; message: string };

export interface LyricsExport {
  title: string;
  slides: string[];
  ratio: SlideRatio;
  background: string;
  imageId?: string;
  color: string;
  font: string;
  size: number;
  letterSpacing?: number;
  lineHeight?: number;
  bold: boolean;
  align: 'left' | 'center' | 'right';
}

export const defaultLyricsLineHeight = 1.25;

export const lyricsLimits = { title: 150, slides: 200, segment: 4000, source: 100000 };
export const hexColor = /^#[0-9a-f]{6}$/i;

export function parseLyrics(source: string): string[] {
  const segments: string[] = [];
  let lines: string[] = [];
  for (const line of source.replace(/\r\n?/g, '\n').split('\n')) {
    if (line.trim()) {
      lines.push(line);
    } else if (lines.length) {
      segments.push(lines.join('\n'));
      lines = [];
    }
  }
  if (lines.length) segments.push(lines.join('\n'));
  return segments;
}
