import { useState } from 'react';
import './App.css';
import Header from './ui/Header';
import Sidebar from './ui/Sidebar';
import Content from './ui/Content';

function App() {
  const [verseInput, setVerseInput] = useState('');
  const [slideMethod, setSlideMethod] = useState('성경 한 구절당 1장');
  const [textSize, setTextSize] = useState([24]);
  const [letterSpacing, setLetterSpacing] = useState([0]); // 자간 (px)
  const [lineHeight, setLineHeight] = useState([1.75]); // 줄간격 (em 단위)
  const [font, setFont] = useState('Pretendard');
  const [fontColor, setFontColor] = useState('#000000'); // 텍스트 색상

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

  return (
    <div className="container">
      <Header />
      <div className="mainContent">
        <Sidebar {...allSidebarProps} />
        <Content />
      </div>
    </div>
  );
}

export default App;
