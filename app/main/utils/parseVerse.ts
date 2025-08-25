import bibleData from '../../../data/bible.json' with { type: 'json' };
import { BIBLE_BOOKS } from '../constant/bible.ts';

/**
 * 다양한 형식의 성경 구절 입력을 파싱하는 객체입니다.
 * 예: "창1:1", "창세기 1:1", "Gen 1:1-3", "genesis1:1"
 */
function parseInput(input: string): {
  book: string;
  fullName: string;
  engName: string;
  chapter: number;
  startVerse: number;
  endVerse: number;
} {
  // 1. 정규식을 사용하여 [책이름], [장], [시작 절], [끝 절]을 추출합니다.
  //    - 책 이름 뒤에 공백이 있을 수도 있고 없을 수도 있습니다.
  //    - 끝 절은 선택 사항입니다.
  const regex = /^([a-zA-Z가-힣]+)\s*(\d+):(\d+)(?:-(\d+))?$/;
  const match = input.trim().match(regex);

  if (!match) {
    throw new Error(`잘못된 형식의 입력입니다: "${input}"`);
  }

  // 2. 정규식 결과에서 각 부분을 추출합니다.
  const [, bookName, chapterStr, startVerseStr, endVerseStr] = match;
  const chapter = parseInt(chapterStr, 10);
  const startVerse = parseInt(startVerseStr, 10);
  // 끝 절이 없으면 시작 절과 동일하게 설정합니다.
  const endVerse = endVerseStr ? parseInt(endVerseStr, 10) : startVerse;

  // 3. 입력된 책 이름(bookName)을 표준 약어로 변환합니다.
  const lowerCaseBookName = bookName.toLowerCase();
  const foundBook = BIBLE_BOOKS.find(
    (b) =>
      b.short.toLowerCase() === lowerCaseBookName ||
      b.full.toLowerCase() === lowerCaseBookName ||
      b.engShort.toLowerCase() === lowerCaseBookName ||
      b.engFull.toLowerCase() === lowerCaseBookName
  );

  if (!foundBook) {
    throw new Error(`"${bookName}"을(를) 찾을 수 없습니다. 올바른 성경 책 이름인지 확인해주세요.`);
  }

  // 4. 표준화된 결과 객체를 반환합니다.
  return {
    book: foundBook.short, // bibleData에서 사용할 표준 약어 '창'을 반환
    fullName: foundBook.full,
    engName: foundBook.engFull,
    chapter,
    startVerse,
    endVerse,
  };
}

// 기존 fetchVerses 함수는 그대로 사용 가능합니다.
export function fetchVerses(input: string, version: string = 'GAE'): string[] {
  // 새로 만든 parseInput 함수가 여기서 사용됩니다.
  const { book, fullName, engName, chapter, startVerse, endVerse } = parseInput(input);
  const verses: string[] = [];

  for (let v = startVerse; v <= endVerse; v++) {
    // bibleData의 key는 표준 약어('창')를 사용하므로 문제없이 동작합니다.
    const verseText = (bibleData as any)?.[version]?.[book]?.[chapter]?.[v];
    if (!verseText) {
      throw new Error(`${book} ${chapter}:${v} 구절을 찾을 수 없습니다.`);
    }
    verses.push(`${book}:${fullName}:${engName}:${chapter}:${v}:${verseText}`);
  }

  return verses;
}
