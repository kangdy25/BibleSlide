import { createSlideDeck } from './slideDeck';
import { lyricsBounds, lyricsTitleBounds, slideLayouts } from '../../shared/slideLayouts';
import { defaultLyricsLineHeight, type LyricsExport } from '../../shared/lyrics';

export interface LyricsBackgroundImage {
  data: string;
  width: number;
  height: number;
}

export function generateLyricsPPT(data: LyricsExport, image?: LyricsBackgroundImage) {
  const deck = createSlideDeck(data.ratio);
  const title = data.title.trim();
  deck.title = title;
  const { width, height } = slideLayouts[data.ratio];

  const masterName = 'lyrics-background';
  // Store the shared background once, even for a deck with many segments.
  deck.defineSlideMaster({
    title: masterName,
    background: { fill: data.background.slice(1) },
    objects: image ? [
      { image: {
        data: image.data, x: 0, y: 0, w: height * image.width / image.height, h: height,
        sizing: { type: 'cover', w: width, h: height },
      } },
      { rect: {
        x: 0, y: 0, w: width, h: height,
        fill: { color: '000000', transparency: 65 },
        line: { transparency: 100 },
      } },
    ] : [],
  });

  const titleBounds = lyricsTitleBounds(data.ratio, title);
  for (const lyrics of data.slides) {
    const slide = deck.addSlide({ masterName });
    slide.addText(title, {
      ...titleBounds, margin: 0, align: 'right', valign: 'middle', wrap: false,
      fontFace: data.font, bold: true, color: data.color.slice(1),
    });
    slide.addText(lyrics, {
      ...lyricsBounds(data.ratio), margin: 0, valign: 'middle', align: data.align,
      fontFace: data.font, fontSize: data.size, bold: data.bold, color: data.color.slice(1),
      charSpacing: data.letterSpacing ?? 0, lineSpacingMultiple: data.lineHeight ?? defaultLyricsLineHeight,
    });
  }
  return deck;
}
