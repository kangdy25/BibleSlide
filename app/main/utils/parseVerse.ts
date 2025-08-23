import bibleData from '../../../data/bible.json' with { type: 'json' };

interface ParsedInput {
  book: string; // "창"
  chapter: number; // 1
  startVerse: number; // 1
  endVerse: number; // 3
}

/**
 * 입력값을 "책장:절-절" 형태로 파싱
 * 예) "창1:1-3" → { book: "창", chapter: 1, startVerse: 1, endVerse: 3 }
 */
export function parseInput(input: string): ParsedInput {
  const regex = /^(\D+)(\d+):(\d+)(?:-(\d+))?$/;
  const match = input.match(regex);

  if (!match) {
    throw new Error(`잘못된 입력 형식입니다: ${input}`);
  }

  const [, book, chapter, start, end] = match;

  return {
    book,
    chapter: parseInt(chapter, 10),
    startVerse: parseInt(start, 10),
    endVerse: end ? parseInt(end, 10) : parseInt(start, 10),
  };
}

/**
 * 파싱된 입력을 기반으로 성경 구절 배열을 반환
 */
export function fetchVerses(input: string, version: string = 'GAE'): string[] {
  const { book, chapter, startVerse, endVerse } = parseInput(input);
  const verses: string[] = [];

  for (let v = startVerse; v <= endVerse; v++) {
    const verseText = (bibleData as any)?.[version]?.[book]?.[chapter]?.[v];
    if (!verseText) {
      throw new Error(`${book} ${chapter}:${v} 구절을 찾을 수 없습니다.`);
    }
    verses.push(`${book} ${chapter}:${v} ${verseText}`);
  }

  return verses;
}
