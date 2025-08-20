import { useState } from "react";
import './App.css';
import styles from './BibleSlide.module.css';
import { Download } from "lucide-react"

import Header from "./ui/Header";
import Sidebar from "./ui/Sidebar";

function App() {
  const [verseInput, setVerseInput] = useState("")
  const [slideMethod, setSlideMethod] = useState("성경 한 구절당 1장")
  const [textSize, setTextSize] = useState([24])
  const [letterSpacing, setLetterSpacing] = useState([0]); // 자간 (px)
  const [lineHeight, setLineHeight] = useState([1.75]);   // 줄간격 (em 단위)
  const [font, setFont] = useState("Pretendard");
  const [fontColor, setFontColor] = useState("#000000"); // 텍스트 색상

  const [isDarkMode, setIsDarkMode] = useState(true);

  const allSidebarProps = {
    verseInput,
    slideMethod,
    textSize,
    letterSpacing,
    lineHeight,
    font,
    fontColor,
    setVerseInput,
    setSlideMethod,
    setTextSize,
    setLetterSpacing,
    setLineHeight,
    setFont,
    setFontColor,
  };

  const verseText = `태초에 하나님이 천지를 창조하시니라
땅이 혼돈하고 공허하며 흑암이 깊음 위에 있고
하나님의 영은 수면 위에 운행하시니라
하나님이 이르시되 빛이 있으라 하시니 빛이 있었고`

  return (
    <div className={styles.container}>
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}/>
      <div className={styles.mainContent}>
        <Sidebar {...allSidebarProps}/>

        <div className={styles.previewArea}>
          {/* Single Large Preview Panel */}
          <div className={styles.previewPanel}>
              <div className={styles.verseDisplay} style={{ 
                fontSize: `${textSize[0]}px`, 
                letterSpacing: `${letterSpacing[0]}px`,
                lineHeight: `${lineHeight[0]}`
              }}>
                  <p className={styles.verseLine}>
                    {verseText}
                  </p>
              </div>
          </div>
          <div className={styles.exportSection}>
            <button className={styles.exportButton}>
              <Download className={styles.buttonIcon} />
              <span>PPT 다운로드</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;
