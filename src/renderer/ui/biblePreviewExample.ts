import type { BibleVersion } from '../../main/constant/bible';

const genesisOneVerseOne: Record<BibleVersion, string> = {
  개역개정: '태초에 하나님이 천지를 창조하시니라',
  개역한글: '태초에 하나님이 천지를 창조하시니라',
  새번역: '태초에 하나님이 천지를 창조하셨다.',
  KJV: 'In the beginning God created the heaven and the earth.',
  NIV: 'In the beginning God created the heavens and the earth.',
};

export function biblePreviewExample(version: BibleVersion) {
  const isEnglish = version === 'KJV' || version === 'NIV';
  return {
    title: isEnglish ? 'Genesis 1:1' : '창세기 1장 1절',
    text: genesisOneVerseOne[version],
    source: `${isEnglish ? 'Genesis 1' : '창세기 1장'} · ${version}`,
  };
}
