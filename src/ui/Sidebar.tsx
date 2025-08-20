import styles from './Sidebar.module.css'
import { Dispatch, SetStateAction } from "react";

import * as RadioGroup from "@radix-ui/react-radio-group"
import * as Select from "@radix-ui/react-select"
import * as Slider from "@radix-ui/react-slider"
import { ChevronDown, Check } from "lucide-react"
import SearchInput from '../components/SearchInput';

export interface SidebarProps {
  verseInput: string;
  setVerseInput: Dispatch<SetStateAction<string>>;
  slideMethod: string;
  setSlideMethod: Dispatch<SetStateAction<string>>;
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
  slideMethod,
  setSlideMethod,
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

  return (
    <div className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            <SearchInput verseInput={verseInput} setVerseInput={setVerseInput} />

            <div className={styles.section}>
              <label className={styles.sectionLabel}>슬라이드 생성 방식</label>
              <RadioGroup.Root className={styles.radioGroup} value={slideMethod} onValueChange={setSlideMethod}>
                <div className={styles.radioItem}>
                  <RadioGroup.Item className={styles.radioButton} value="성경 한 구절당 1장" id="method1">
                    <RadioGroup.Indicator className={styles.radioIndicator} />
                  </RadioGroup.Item>
                  <label className={styles.radioLabel} htmlFor="method1">
                    성경 한 구절당 1장
                  </label>
                </div>
                <div className={styles.radioItem}>
                  <RadioGroup.Item className={styles.radioButton} value="성경 합치기" id="method2">
                    <RadioGroup.Indicator className={styles.radioIndicator} />
                  </RadioGroup.Item>
                  <label className={styles.radioLabel} htmlFor="method2">
                    성경 합치기
                  </label>
                </div>
              </RadioGroup.Root>
            </div>

            <div className={styles.section}>
              <label className={styles.sectionLabel}>텍스트 크기: {textSize[0]}px</label>
              <Slider.Root
                className={styles.sliderRoot}
                value={textSize}
                onValueChange={setTextSize}
                max={48} min={12} step={2}
              >
                <Slider.Track className={styles.sliderTrack}>
                  <Slider.Range className={styles.sliderRange} />
                </Slider.Track>
                <Slider.Thumb className={styles.sliderThumb} />
              </Slider.Root>

              {/* 자간 */}
              <label className={styles.sectionLabel}>자간: {letterSpacing[0]}px</label>
              <Slider.Root
                className={styles.sliderRoot}
                value={letterSpacing}
                min={0} max={20} step={1}
                onValueChange={setLetterSpacing}
              >
                <Slider.Track className={styles.sliderTrack}>
                  <Slider.Range className={styles.sliderRange} />
                </Slider.Track>
                <Slider.Thumb className={styles.sliderThumb} />
              </Slider.Root>

              {/* 줄간격 */}
              <label className={styles.sectionLabel}>행간: {lineHeight[0]}</label>
              <Slider.Root
                className={styles.sliderRoot}
                value={lineHeight}
                min={1} max={3} step={0.1}
                onValueChange={setLineHeight}
              >
                <Slider.Track className={styles.sliderTrack}>
                  <Slider.Range className={styles.sliderRange} />
                </Slider.Track>
                <Slider.Thumb className={styles.sliderThumb} />
              </Slider.Root>
            </div>

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