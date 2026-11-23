import { useState } from 'react';
import { defaultLyricsLineHeight, lyricsLimits, parseLyrics, type LyricsExport } from '../../shared/lyrics';
import { lyricsBounds, lyricsTitleBounds, slideLayouts } from '../../shared/slideLayouts';
import { mayOverflow } from '../../shared/textOverflow';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download } from 'lucide-react';
import { FontSettings } from '../components/SelectFont';
import SlideFormatSelect from '../components/SlideFormatSelect';
import { TextValueSlider } from '../components/TextSlider';
import buttonStyles from '../components/GeneratePPTButton.module.css';
import headerStyles from '../ui/Header.module.css';
import panelStyles from '../ui/Sidebar.module.css';
import previewStyles from '../ui/Content.module.css';
import lyricsLogo from '../assets/LyricsSlide_logo.png?inline';
import './LyricsPage.css';

const initialStyle = {
  ratio: 'wide' as LyricsExport['ratio'],
  font: '나눔바른고딕',
  size: 48,
  lineHeight: defaultLyricsLineHeight,
  bold: true,
};

export default function LyricsPage({ onHome }: { onHome: () => void }) {
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('');
  const [selected, setSelected] = useState(0);
  const [style, setStyle] = useState(initialStyle);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const slides = parseLyrics(source);
  const current = slides[selected] ?? '';
  const slideTitle = title.trim();
  const titleBounds = lyricsTitleBounds(style.ratio, slideTitle);
  const bounds = lyricsBounds(style.ratio);
  const canvas = slideLayouts[style.ratio];
  const previewRatio = canvas.width / canvas.height;
  const scaledPoints = (points: number) => `${points / (72 * canvas.width) * 100}cqw`;
  const currentOverflows = mayOverflow(current, style.size, bounds.w, bounds.h, style.lineHeight);

  function updateStyle<K extends keyof typeof style>(key: K, value: (typeof style)[K]) {
    setStyle(previous => ({ ...previous, [key]: value }));
  }

  async function save() {
    if (!slideTitle) return setStatus('찬양 제목을 입력해 주세요.');
    if (!slides.length) return setStatus('전체 가사를 입력해 주세요.');
    if (slides.length > lyricsLimits.slides || slides.some(text => text.length > lyricsLimits.segment)) {
      return setStatus('최대 200장, 장당 4,000자까지 저장할 수 있습니다.');
    }
    const deckOverflows = slides.some(text => mayOverflow(text, style.size, bounds.w, bounds.h, style.lineHeight));
    if (deckOverflows && !window.confirm('글자가 넘칠 수 있는 슬라이드가 있습니다. 현재 설정으로 저장할까요?')) return;
    setStatus('');
    setBusy(true);
    try {
      const result = await window.electronAPI.generateLyrics({
        ...style, title: slideTitle, slides, background: '#000000', color: '#ffffff', align: 'center',
      });
      if (result.success) {
        void window.electronAPI.showAlert('PPT 저장이 완료되었습니다.', 'info').catch(() => undefined);
      } else if (!result.canceled) {
        setStatus(result.message);
      }
    } catch {
      setStatus('찬양 PPT를 저장할 수 없습니다.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="lyricsPage">
      <header className={headerStyles.header}>
        <div className={headerStyles.headerContent}>
          <div className={headerStyles.headerLeft}>
            <h1 className="lyricsBrand" aria-label="LyricsSlide">
              <button className={headerStyles.logoButton} type="button" onClick={onHome}
                aria-label="WorshipSlide 홈으로" title="WorshipSlide 홈으로">
                <img className={headerStyles.logo} src={lyricsLogo} alt="LyricsSlide" />
              </button>
            </h1>
          </div>
        </div>
      </header>
      <main className="mainContent lyricsWorkspace">
        <section className={`${panelStyles.sidebar} lyricsCard lyricsEditor`} aria-label="가사 편집">
          <label className="lyricsField">
            제목
            <input className="lyricsInput" placeholder="예: 주님만이 왕이십니다" value={title}
              maxLength={lyricsLimits.title} onChange={e => setTitle(e.target.value)} />
          </label>
          <label className="lyricsField">
            전체 가사
            <textarea className="lyricsInput lyricsSource" rows={12} value={source} maxLength={lyricsLimits.source}
              placeholder="빈 줄로 슬라이드를 구분하세요." onChange={e => {
                setSource(e.target.value);
                setSelected(0);
                setStatus('');
              }} />
          </label>
          <button className={buttonStyles.exportButton} type="button" disabled={busy} onClick={save}>
            <Download size={16} aria-hidden="true" /> PPT 저장
          </button>
        </section>
        <section className="lyricsDesign" aria-label="찬양 디자인">
          <div className="lyricsPreviewStage" style={{ aspectRatio: previewRatio }}>
            <div className={`${previewStyles.previewPanel} lyricsPreview`} role="region" aria-label="선택한 슬라이드 미리보기" style={{
              aspectRatio: previewRatio,
              width: `min(100%, ${previewRatio * 100}cqh)`,
            }}>
              {slideTitle && (
                <div className="lyricsPreviewTitle" style={{
                  top: `${titleBounds.y / canvas.height * 100}%`,
                  left: `${titleBounds.x / canvas.width * 100}%`,
                  width: `${titleBounds.w / canvas.width * 100}%`,
                  height: `${titleBounds.h / canvas.height * 100}%`,
                  fontFamily: style.font, fontSize: scaledPoints(titleBounds.fontSize),
                }}>{slideTitle}</div>
              )}
              {slides.length ? (
                <div className="lyricsPreviewText" style={{
                  left: `${bounds.x / canvas.width * 100}%`, width: `${bounds.w / canvas.width * 100}%`,
                  top: `${bounds.y / canvas.height * 100}%`, height: `${bounds.h / canvas.height * 100}%`,
                  fontFamily: style.font, fontWeight: style.bold ? 700 : 400,
                  fontSize: scaledPoints(style.size), lineHeight: style.lineHeight,
                }}><div>{current}</div></div>
              ) : (
                <p className="lyricsPreviewEmpty">가사를 입력하면 미리볼 수 있어요.</p>
              )}
            </div>
          </div>
          <div className="lyricsPreviewToolbar">
            {slides.length > 1 && (
              <div className="lyricsPreviewNavigation" role="group" aria-label="미리보기 이동">
                <button type="button" className="lyricsButton" aria-label="처음 미리보기" title="처음"
                  disabled={selected === 0} onClick={() => setSelected(0)}>
                  <ChevronsLeft size={16} aria-hidden="true" />
                </button>
                <button type="button" className="lyricsButton" aria-label="이전 미리보기"
                  disabled={selected === 0} onClick={() => setSelected(selected - 1)}>
                  <ChevronLeft size={16} aria-hidden="true" />
                </button>
                <span aria-live="polite">{selected + 1} / {slides.length}</span>
                <button type="button" className="lyricsButton" aria-label="다음 미리보기"
                  disabled={selected >= slides.length - 1} onClick={() => setSelected(selected + 1)}>
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
                <button type="button" className="lyricsButton" aria-label="끝 미리보기" title="끝"
                  disabled={selected === slides.length - 1} onClick={() => setSelected(slides.length - 1)}>
                  <ChevronsRight size={16} aria-hidden="true" />
                </button>
              </div>
            )}
            <SlideFormatSelect value={style.ratio} onChange={ratio => updateStyle('ratio', ratio)} />
          </div>
          {currentOverflows && <p className="lyricsWarning" role="status">현재 슬라이드의 글자가 넘칠 수 있습니다.</p>}
          {status && <p className="lyricsStatus" role="status">{status}</p>}
          <div className={`${panelStyles.sidebar} lyricsCard lyricsSettings`} role="group" aria-label="슬라이드 스타일">
            <FontSettings font={style.font} weight={style.bold ? '굵게' : '가늘게'}
              onFontChange={font => updateStyle('font', font)} onWeightChange={weight => updateStyle('bold', weight === '굵게')} />
            <div className="lyricsTypography">
              <TextValueSlider label="텍스트 크기" value={style.size} min={12} max={120} unit="pt"
                onChange={value => updateStyle('size', value)} />
              <TextValueSlider label="행간" value={style.lineHeight} min={1} max={3} step={0.05}
                onChange={value => updateStyle('lineHeight', value)} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
