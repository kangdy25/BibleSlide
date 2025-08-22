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

  const handleGeneratePpt = async () => {
    // 폰트 크기, 자간, 행간은 배열 형태이므로 첫 번째 값을 사용합니다.
    const data = {
      title: verseInput,
      verse: verseInput,
      font: font,
      textSize: textSize[0],
      letterSpacing: letterSpacing[0],
      lineHeight: lineHeight[0],
    };

    try {
      // preload.ts를 통해 노출된 API 호출
      const result = await window.electronAPI.generateSlide(data);
      if (result.success) {
        alert(result.message);
      } else {
        alert(`PPT 생성 실패: ${result.message}`);
      }
    } catch (error) {
      console.error('IPC 통신 오류:', error);
      alert('PPT 생성 중 오류가 발생했습니다.');
    }
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
          <button className={styles.exportButton} onClick={handleGeneratePpt}>
            <span>PPT 제작하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
