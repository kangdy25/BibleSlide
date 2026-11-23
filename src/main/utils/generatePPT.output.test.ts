// @vitest-environment node
import JSZip from 'jszip';
import { expect, it } from 'vitest';
import { generatePPT } from './generatePPT';

it('기존 형식의 크기, 절 순서, 편집 가능한 텍스트와 장식을 유지한다', async () => {
  const verses = ['첫 번째 절', '두 번째 절', '세 번째 절'];
  let deck: ReturnType<typeof generatePPT> | undefined;
  for (const [index, verse] of verses.entries()) {
    deck = generatePPT('창세기 1장 ' + (index + 1) + '절', '창세기 1장', verse,
      'left', 'Arial', false, 30, 0, 1.25, deck);
  }

  const archive = await JSZip.loadAsync(await deck!.write({ outputType: 'nodebuffer' }) as Buffer);
  const presentation = await archive.file('ppt/presentation.xml')!.async('string');
  expect(presentation).toContain('<p:sldSz cx="9144000" cy="5143500"/>');

  const slides = archive.file(/^ppt\/slides\/slide\d+\.xml$/);
  expect(slides).toHaveLength(3);
  for (const [index, verse] of verses.entries()) {
    const xml = await archive.file('ppt/slides/slide' + (index + 1) + '.xml')!.async('string');
    expect(xml.match(/<a:t>[^<]*<\/a:t>/g)).toEqual([
      '<a:t>창세기 1장 ' + (index + 1) + '절</a:t>',
      '<a:t>' + verse + '</a:t>',
      '<a:t>창세기 1장</a:t>',
    ]);
    expect(xml).toContain('<p:txBody>');
    expect(xml).toContain('sz="3000"');
    expect(xml.match(/prst="line"/g)).toHaveLength(4);
  }
});
