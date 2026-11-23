import type PptxGenJS from 'pptxgenjs';
import type { SlideDataType } from '../../../types/electron';
import { biblePanels, type SlideRatio } from '../../shared/slideLayouts';

export function addBibleSlide(deck: PptxGenJS, ratio: SlideRatio, title: string, source: string, text: string, style: SlideDataType) {
  const slide = deck.addSlide();
  slide.background = { fill: '000000' };
  for (const { x, w, bodyInsetLeft, bodyInsetRight } of biblePanels(ratio)) {
    const label = { x, w, h: 0.45, align: 'center' as const, color: 'FFFFFF', fontFace: '나눔바른고딕' };
    slide.addText(title, { ...label, y: 0.25, fontSize: 20, bold: true });
    slide.addText(text, {
      x: x + bodyInsetLeft, y: 1.3, w: w - bodyInsetLeft - bodyInsetRight, h: 5.25, margin: 0,
      color: 'FFFFFF', valign: 'top', align: style.align, fontFace: style.font,
      fontSize: style.textSize, bold: style.isBold === '굵게',
      charSpacing: style.letterSpacing, lineSpacingMultiple: style.lineHeight,
    });
    slide.addText(source, { ...label, y: 6.85, fontSize: 16 });
    for (const [edge, top, direction] of [[x, 0.9, 1], [x + w, 6.65, -1]]) {
      slide.addShape(deck.ShapeType.line, { x: Math.min(edge, edge + direction * 0.55), y: top, w: 0.55, h: 0, line: { color: 'FFFFFF', width: 3 } });
      slide.addShape(deck.ShapeType.line, { x: edge, y: Math.min(top, top + direction * 0.32), w: 0, h: 0.32, line: { color: 'FFFFFF', width: 3 } });
    }
  }
}
