import { ArrowUpRight } from 'lucide-react';
import lyricsLogo from '../assets/LyricsSlide_logo.png?inline';
import './HomePage.css';

interface HomePageProps {
  onOpenBible: () => void;
  onOpenLyrics: () => void;
}

export default function HomePage({ onOpenBible, onOpenLyrics }: HomePageProps) {
  return (
    <main className="homePage">
      <div className="homeContent">
        <header className="homeIntro">
          <h1 className="homeWordmark">Worship<span>Slide</span></h1>
          <p>성경 구절과 찬양 가사로 예배용 PPT를 만드세요.</p>
        </header>
        <div className="homeOptions">
          <button type="button" className="homeOption homeOptionBible"
            aria-label="성경 BibleSlide" onClick={onOpenBible}>
            <img className="homeOptionLogo" src="./logo.png" alt="" />
            <span className="homeOptionCaption">
              <span>
                <strong>성경</strong>
                <span className="homeOptionDescription">성경 구절로 말씀 슬라이드 만들기</span>
              </span>
              <ArrowUpRight className="homeOptionArrow" size={21} aria-hidden="true" />
            </span>
          </button>
          <button type="button" className="homeOption homeOptionLyrics"
            aria-label="찬양 LyricsSlide" onClick={onOpenLyrics}>
            <img className="homeOptionLogo" src={lyricsLogo} alt="" />
            <span className="homeOptionCaption">
              <span>
                <strong>찬양</strong>
                <span className="homeOptionDescription">곡 제목과 가사로 찬양 슬라이드 만들기</span>
              </span>
              <ArrowUpRight className="homeOptionArrow" size={21} aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}
