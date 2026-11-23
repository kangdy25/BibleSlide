import PptxGenJS from 'pptxgenjs';
import { slideLayouts, type SlideRatio } from '../../shared/slideLayouts';

export function createSlideDeck(ratio: SlideRatio) {
  const deck = new PptxGenJS();
  deck.defineLayout({ name: ratio, ...slideLayouts[ratio] });
  deck.layout = ratio;
  return deck;
}
