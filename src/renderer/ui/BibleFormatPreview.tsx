import styles from './Content.module.css';
import { useEffect, useState } from 'react';
import { biblePreviewExample } from './biblePreviewExample';
import { biblePanels, slideLayouts, type SlideRatio } from '../../shared/slideLayouts';
import { mayOverflow } from '../../shared/textOverflow';
import useUserSettings from '../contexts/useUserSettings';

export default function BibleFormatPreview({ ratio }: { ratio: SlideRatio }) {
  const { settings } = useUserSettings();
  const { width, height } = slideLayouts[ratio];
  const [preview, setPreview] = useState<{ input: string; version: string; verse: string }>();
  const { verseInput, bibleVersion } = settings;

  useEffect(() => {
    if (!verseInput.trim()) return;
    let active = true;
    const timer = setTimeout(() => {
      void window.electronAPI.fetchVerse(verseInput, bibleVersion).then(([verse]) => {
        if (!active) return;
        setPreview({
          input: verseInput,
          version: bibleVersion,
          verse: verse && !verse.startsWith('Error:') ? verse : '',
        });
      }).catch(() => {
        if (active) setPreview({ input: verseInput, version: bibleVersion, verse: '' });
      });
    }, 250);
    return () => { active = false; clearTimeout(timer); };
  }, [verseInput, bibleVersion]);

  const matchesSelection = preview?.input === verseInput && preview.version === bibleVersion;
  const showExample = !verseInput.trim() || (matchesSelection && !preview.verse);
  const verse = matchesSelection ? preview.verse : '';
  const example = showExample ? biblePreviewExample(bibleVersion) : { title: '', source: '', text: '' };
  const [, korean, english, chapter, number, ...content] = verse.split(':');
  const isEnglish = preview?.version === 'KJV' || preview?.version === 'NIV';
  const title = verse ? (isEnglish ? `${english} ${chapter}:${number}` : `${korean} ${chapter}장 ${number}절`) : example.title;
  const source = verse ? (isEnglish ? `${english} ${chapter}` : `${korean} ${chapter}장`) : example.source;
  const text = verse ? content.join(':') : example.text;
  const pt = (size: number) => `${size / (72 * width) * 100}cqw`;
  const position = (y: number, h: number) => ({ top: `${y / height * 100}%`, height: `${h / height * 100}%` });
  const panels = biblePanels(ratio);
  const { w, bodyInsetLeft, bodyInsetRight } = panels[0];

  return (
    <section className="bibleNewPreview" aria-label="성경 출력 미리보기">
      <div className={`${styles.previewPanel} ${styles.adaptivePreviewPanel}`} style={{ aspectRatio: width / height }}>
        {panels.map(({ x, w, bodyInsetLeft, bodyInsetRight }) => (
          <div className="biblePreviewPanel" key={x} style={{ left: `${x / width * 100}%`, width: `${w / width * 100}%` }}>
            <div style={{ ...position(0.25, 0.45), fontSize: pt(20), fontWeight: 700 }}>{title}</div>
            <div className="biblePreviewText" style={{
              ...position(1.3, 5.25), left: `${bodyInsetLeft / w * 100}%`, right: `${bodyInsetRight / w * 100}%`,
              fontSize: pt(settings.textSize), letterSpacing: pt(settings.letterSpacing),
              textAlign: settings.align, fontFamily: settings.font, lineHeight: settings.lineHeight,
              fontWeight: settings.isBold === '굵게' ? 700 : 400,
            }}>{text}</div>
            <div style={{ ...position(6.85, 0.45), fontSize: pt(16) }}>{source}</div>
          </div>
        ))}
      </div>
      {mayOverflow(text, settings.textSize, w - bodyInsetLeft - bodyInsetRight, 5.25, settings.lineHeight, settings.letterSpacing) &&
        <p className="bibleWarning" role="status">본문이 넘칠 수 있습니다. 글자 크기와 줄 간격을 확인해 주세요.</p>}
    </section>
  );
}
