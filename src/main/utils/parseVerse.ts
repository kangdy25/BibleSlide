import bibleData from '../../data/bible.json' with { type: 'json' };
import { BIBLE_BOOKS } from '../constant/bible.ts';

type BibleData = Record<string, Record<string, Record<string, Record<number, string>>>>;

/**
 * 다양한 형식의 성경 구절 입력을 파싱하는 객체입니다.
 * 예: "창1:1", "창세기 1:1", "Gen 1:1-3", "genesis1:1"
 */
export function parseInput(input: string): {
  book: string;
  fullName: string;
  engName: string;
  chapter: number;
  startVerse?: number;
  endVerse?: number;
} {
  // 1. 정규식을 사용하여 [책이름], [장], [시작 절], [끝 절]을 추출합니다.
  //    - 책 이름 뒤에 공백이 있을 수도 있고 없을 수도 있습니다.
  //    - 절 정보(:시작절-끝절)는 선택 사항입니다.
  const regex = /^([a-zA-Z가-힣]+)\s*(\d+)(?::(\d+)(?:-(\d+))?)?$/;
  const match = input.trim().match(regex);

  if (!match) {
    throw new Error(`잘못된 형식의 입력입니다: "${input}"`);
  }

  // 2. 정규식 결과에서 각 부분을 추출합니다.
  const [_, bookName, chapterStr, startVerseStr, endVerseStr] = match;
  const chapter = parseInt(chapterStr, 10);
  const startVerse = startVerseStr ? parseInt(startVerseStr, 10) : undefined;
  // 끝 절이 없으면 시작 절과 동일하게 설정합니다. (시작 절이 있을 때만 해당)
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
    book: foundBook.short, // Ex: 창
    fullName: foundBook.full, // Ex: 창세기
    engName: foundBook.engFull, // Ex: Genesis
    chapter, // Ex: 1
    startVerse, // Ex: 1 또는 undefined
    endVerse, // Ex: 1 또는 undefined
  };
}

// 기존 fetchVerses 함수를 장수만 입력하는 경우에도 동작하도록 수정합니다.
export function fetchVerses(input: string, version: string): string[] {
  const abbrVersion = {
    개역개정: 'GAE',
    개역한글: 'RHV',
    새번역: 'SAENEW',
    KJV: 'KJV',
    NIV: 'NIV',
  } as const;

  const { book, fullName, engName, chapter, startVerse, endVerse } = parseInput(input);
  const versionKey = abbrVersion[version as keyof typeof abbrVersion];
  if (!versionKey) {
    throw new Error(`"${version}" 버전을 찾을 수 없습니다. 올바른 버전 이름인지 확인해주세요.`);
  }

  const chapterData = (bibleData as BibleData)?.[versionKey]?.[book]?.[chapter];
  if (!chapterData) {
    throw new Error(`${book} ${chapter}장을 찾을 수 없습니다.`);
  }

  let finalStart = 1;
  let finalEnd = 1;

  if (startVerse === undefined) {
    // 장만 지정된 경우, 1절부터 해당 장의 마지막 절까지 가져옵니다.
    const verseKeys = Object.keys(chapterData).map((k) => parseInt(k, 10));
    if (verseKeys.length === 0) {
      throw new Error(`${book} ${chapter}장에 구절이 없습니다.`);
    }
    finalStart = 1;
    finalEnd = Math.max(...verseKeys);
  } else {
    finalStart = startVerse;
    finalEnd = endVerse ?? startVerse;
  }

  if (finalStart > finalEnd) {
    throw new Error(`시작 절(${finalStart})이 끝 절(${finalEnd})보다 클 수 없습니다.`);
  }

  const verses: string[] = [];

  for (let v = finalStart; v <= finalEnd; v++) {
    // bibleData의 key는 표준 약어('창')를 사용하므로 문제없이 동작합니다.
    const verseText = chapterData[v];
    if (!verseText) {
      throw new Error(`${book} ${chapter}:${v} 구절을 찾을 수 없습니다.`);
    }
    verses.push(`${book}:${fullName}:${engName}:${chapter}:${v}:${verseText}`);
  }

  return verses;
}
