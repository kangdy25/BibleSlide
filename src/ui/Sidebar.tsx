import styles from './Sidebar.module.css';
import { Dispatch, SetStateAction } from 'react';
import SearchInput from '../components/SearchInput';
import TextSlider from '../components/TextSlider';
import SelectFont from '../components/SelectFont';

export interface SidebarProps {
  verseInput: string;
  setVerseInput: Dispatch<SetStateAction<string>>;
  textSize: number[];
  setTextSize: Dispatch<SetStateAction<number[]>>;
  letterSpacing: number[];
  setLetterSpacing: Dispatch<SetStateAction<number[]>>;
  lineHeight: number[];
  setLineHeight: Dispatch<SetStateAction<number[]>>;
  font: string;
  setFont: Dispatch<SetStateAction<string>>;
}

const Sidebar = ({
  verseInput,
  setVerseInput,
  textSize,
  setTextSize,
  letterSpacing,
  setLetterSpacing,
  lineHeight,
  setLineHeight,
  font,
  setFont,
}: SidebarProps) => {
  const allTextSliderProps = {
    textSize,
    setTextSize,
    letterSpacing,
    setLetterSpacing,
    lineHeight,
    setLineHeight,
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        {/* PPT로 제작할 성경을 입력 받을 Input */}
        <SearchInput verseInput={verseInput} setVerseInput={setVerseInput} />

        {/* 글자 옵션을 정하는 Slider */}
        <TextSlider {...allTextSliderProps} />

        {/* 폰트를 지정할 드롭다운 */}
        <SelectFont font={font} setFont={setFont} />

        {/* PPT 제작 버튼 */}
        <div className={styles.exportSection}>
          <button className={styles.exportButton}>
            <span>PPT 제작하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
