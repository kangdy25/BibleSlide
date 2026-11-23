// @vitest-environment node
import JSZip from 'jszip';
import { expect, it } from 'vitest';
import { parseLyrics, type LyricsExport } from '../../shared/lyrics';
import { mayOverflow } from '../../shared/textOverflow';
import type { SlideDataType } from '../../../types/electron';
import { addBibleSlide } from './addBibleSlide';
import { createSlideDeck } from './slideDeck';
import { generateLyricsPPT } from './generateLyricsPPT';

const style: LyricsExport = {
  title: '테스트 곡', slides: ['첫 줄\n둘째 줄', '후렴', '후렴'], ratio: 'led',
  background: '#000000', color: '#ffffff', font: 'Arial', size: 48, bold: true, align: 'center',
};

const bibleStyle: SlideDataType = {
  input: '창1:1', bibleVersion: '개역개정', align: 'left', font: 'Arial',
  textSize: 30, isBold: '가늘게', letterSpacing: 0, lineHeight: 1.25,
};

const png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jQ9sAAAAASUVORK5CYII=';

async function archive(deck: ReturnType<typeof createSlideDeck>) {
  return JSZip.loadAsync(await deck.write({ outputType: 'nodebuffer' }) as Buffer);
}

it('가사 분할은 공백 줄, CRLF, 반복 후렴과 구간 내 줄바꿈을 보존한다', () => {
  expect(parseLyrics('\n첫 줄\r\n둘째 줄\r\n \r\n\r\n후렴\r\n\r\n후렴\n')).toEqual(style.slides);
  expect(parseLyrics(' \n\t')).toEqual([]);
  expect(mayOverflow('가'.repeat(500), 48, 12, 6.5)).toBe(true);
});

it('LED 성경은 양끝에 여백을 두고 좌우에 같은 본문을 배치하며 중앙을 비운다', async () => {
  const deck = createSlideDeck('led');
  addBibleSlide(deck, 'led', '창세기 1장 1절', '창세기 1장', '창조하셨다.', bibleStyle);
  const zip = await archive(deck);
  expect(await zip.file('ppt/presentation.xml')!.async('string')).toContain('cx="18288000" cy="6858000"');
  const slide = await zip.file('ppt/slides/slide1.xml')!.async('string');
  const bodies = (slide.match(/<p:sp>.*?<\/p:sp>/gs) ?? []).filter(xml => xml.includes('<a:t>창조하셨다.</a:t>'));
  expect(bodies).toHaveLength(2);
  const x = bodies.map(xml => Number(xml.match(/<a:off x="(\d+)"/)?.[1]));
  const widths = bodies.map(xml => Number(xml.match(/<a:ext cx="(\d+)"/)?.[1]));
  expect(widths).toEqual([5943600, 5943600]);
  expect(x).toEqual([685800, 11658600]);
  expect(18288000 - x[1] - widths[1]).toBe(x[0]);
  const corners = [...slide.matchAll(/<a:off x="(\d+)" y="\d+"\/><a:ext cx="0" cy="292608"\/>/g)]
    .map(match => Number(match[1]));
  expect(corners).toEqual([485775, 6858000, 11430000, 17802225]);
  expect(x[1] - x[0] - widths[0]).toBe(5029200);
  expect(slide).not.toContain('flipH="1"');
});

it('찬양은 두 비율에서 편집 가능한 가사와 전체 배경을 내보낸다', async () => {
  for (const ratio of ['wide', 'led'] as const) {
    const slides = ['후렴', '첫 줄\n둘째 줄', '후렴'];
    const zip = await archive(generateLyricsPPT({ ...style, ratio, slides, lineHeight: 1.65 }, { data: png, width: 1, height: 1 }));
    const slideWidth = ratio === 'led' ? 18288000 : 12192000;
    expect(await zip.file('ppt/presentation.xml')!.async('string')).toContain(`cx="${slideWidth}" cy="6858000"`);
    expect(zip.file(/^ppt\/slides\/slide\d+\.xml$/)).toHaveLength(3);
    const first = await zip.file('ppt/slides/slide1.xml')!.async('string');
    const second = await zip.file('ppt/slides/slide2.xml')!.async('string');
    const third = await zip.file('ppt/slides/slide3.xml')!.async('string');
    for (const slide of [first, second, third]) {
      const title = (slide.match(/<p:sp>.*?<\/p:sp>/gs) ?? []).find(xml => xml.includes('<a:t>테스트 곡</a:t>'))!;
      expect(title).toContain('algn="r"');
      expect(title).toContain('<a:off x="411480" y="256032"/>');
      expect(title).toContain(`<a:ext cx="${slideWidth - 822960}" cy="402336"/>`);
    }
    const lyrics = /<p:sp>[^]*?<p:txBody>[^]*?<\/p:sp>/;
    expect(first.match(/<a:t>후렴<\/a:t>/g)).toHaveLength(1);
    expect(second).toContain('<a:t>첫 줄</a:t>');
    expect(second).toContain('<a:t>둘째 줄</a:t>');
    expect(third).toContain('<a:t>후렴</a:t>');
    expect(first).toMatch(lyrics);
    expect(first).toContain('anchor="ctr"');
    expect(first).toContain('sz="4800"');
    expect(first).toContain('typeface="Arial"');
    expect(first).toContain('<a:spcPct val="165000"/>');
    const text = (first.match(/<p:sp>.*?<\/p:sp>/gs) ?? []).find(xml => xml.includes('<a:t>후렴</a:t>'))!;
    const textX = Number(text.match(/<a:off x="(\d+)"/)?.[1]);
    const textWidth = Number(text.match(/<a:ext cx="(\d+)"/)?.[1]);
    expect(textX).toBeGreaterThan(ratio === 'led' ? 3048000 : 0);
    expect(textX + textWidth).toBeLessThan(slideWidth - (ratio === 'led' ? 3048000 : 0));
    const layoutRel = await zip.file('ppt/slides/_rels/slide1.xml.rels')!.async('string');
    const layoutName = layoutRel.match(/Target="\.\.\/slideLayouts\/(slideLayout\d+\.xml)"/)?.[1];
    expect(await zip.file('ppt/slides/_rels/slide3.xml.rels')!.async('string')).toContain(String(layoutName));
    const layout = await zip.file('ppt/slideLayouts/' + layoutName)!.async('string');
    const image = layout.match(/<p:pic>.*?<\/p:pic>/s)?.[0] ?? '';
    expect(image).toContain(`<a:ext cx="${slideWidth}" cy="6858000"`);
    expect(image).toContain(ratio === 'led'
      ? '<a:srcRect l="0" r="0" t="31250" b="31250"'
      : '<a:srcRect l="0" r="0" t="21875" b="21875"');
    expect(await zip.file('ppt/slideLayouts/_rels/' + layoutName + '.rels')!.async('string')).toContain('/image"');
    expect(zip.file(/^ppt\/media\/[^/]+\.png$/)).toHaveLength(1);
  }
});

it('표준 성경은 새 치수에 본문을 한 번 기록한다', async () => {
  const deck = createSlideDeck('wide');
  addBibleSlide(deck, 'wide', '창세기 1장 1절', '창세기 1장', '창조하셨다.', bibleStyle);
  const zip = await archive(deck);
  expect(await zip.file('ppt/presentation.xml')!.async('string')).toContain('cx="12192000" cy="6858000"');
  const slide = await zip.file('ppt/slides/slide1.xml')!.async('string');
  expect(slide.match(/<a:t>창조하셨다.<\/a:t>/g)).toHaveLength(1);
});
