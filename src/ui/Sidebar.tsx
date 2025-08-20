import styles from './Sidebar.module.css'
import { Dispatch, SetStateAction } from "react";

import * as Select from "@radix-ui/react-select"
import { ChevronDown, Check } from "lucide-react"
import SearchInput from '../components/SearchInput';
import TextSlider from '../components/TextSlider';

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
  fontColor: string;
  setFontColor: Dispatch<SetStateAction<string>>;
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
  fontColor,
  setFontColor,
}: SidebarProps) => {

  const allTextSliderProps = {
    textSize,
    setTextSize,
    letterSpacing,
    setLetterSpacing,
    lineHeight,
    setLineHeight
  }

  return (
    <div className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            <SearchInput verseInput={verseInput} setVerseInput={setVerseInput} />
            <TextSlider {...allTextSliderProps} />

            <div className={styles.section}>
              <label className={styles.sectionLabel}>폰트</label>
              <Select.Root value={font} onValueChange={setFont}>
                <Select.Trigger className={styles.selectTrigger}>
                  <Select.Value />
                  <Select.Icon className={styles.selectIcon}>
                    <ChevronDown />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className={styles.selectContent}>
                    <Select.Viewport className={styles.selectViewport}>
                      {["Pretendard", "Noto Sans KR", "Sans-serif", "Serif"].map((fontOption) => (
                        <Select.Item key={fontOption} className={styles.selectItem} value={fontOption}>
                          <Select.ItemText>{fontOption}</Select.ItemText>
                          <Select.ItemIndicator className={styles.selectItemIndicator}>
                            <Check />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            {/* 텍스트 색상 */}
            <div className={styles.section}>
              <label className={styles.sectionLabel}>텍스트 색상</label>
              <input
                type="color"
                value={fontColor}
                onChange={e => setFontColor(e.target.value)}
                className={styles.colorInput}
              />
            </div>
          </div>
        </div>
  )
}

export default Sidebar