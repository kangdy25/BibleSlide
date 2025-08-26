import styles from './Sidebar.module.css';
import { Dispatch, SetStateAction, version } from 'react';
import SearchInput from '../components/SearchInput';
import TextSlider from '../components/TextSlider';
import SelectFont from '../components/SelectFont';
import useUserSettings from '../contexts/useUserSettings';

export interface SidebarProps {
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

  const { settings, setSettings } = useUserSettings();

  const handleGeneratePpt = async () => {
    // verseInput이 비어있으면 함수를 종료합니다.
    if (!settings.verseInput) {
      alert('성경 구절을 입력해주세요.');
      return;
    }
    console.log(settings.verseInput);

    // IPC 통신을 통해 메인 프로세스로 데이터 전송
    const data = {
      input: settings.verseInput,
      // title: verseInput, // 제목으로 사용
      // verse: verseInput, // 구절 입력값으로 사용
      // font: font,
      // textSize: textSize[0],
      // letterSpacing: letterSpacing[0],
      // lineHeight: lineHeight[0],
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
        <SearchInput />

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
