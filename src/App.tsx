import { useState } from "react";
import './App.css';
import styles from './BibleSlide.module.css';

import * as ToggleGroup from "@radix-ui/react-toggle-group"
import * as Switch from "@radix-ui/react-switch"
import * as RadioGroup from "@radix-ui/react-radio-group"
import * as Select from "@radix-ui/react-select"
import * as Slider from "@radix-ui/react-slider"
import { Download, Moon, Sun, ChevronDown, Check, } from "lucide-react"

function App() {
  const [verseInput, setVerseInput] = useState("창1:1-3")
  const [slideMethod, setSlideMethod] = useState("성경 한 구절당 1장")
  const [textSize, setTextSize] = useState([24])
  const [letterSpacing, setLetterSpacing] = useState([0]); // 자간 (px)
  const [lineHeight, setLineHeight] = useState([1.5]);   // 줄간격 (em 단위)
  const [font, setFont] = useState("Pretendard")
  const [background, setBackground] = useState("기본 배경")
  const [bibleVersion, setBibleVersion] = useState("개역개정")
  const [isDarkMode, setIsDarkMode] = useState(true)

  const [fontColor, setFontColor] = useState("#000000"); // 텍스트 색상
  
  const verseText = `태초에 하나님이 천지를 창조하시니라
땅이 혼돈하고 공허하며 흑암이 깊음 위에 있고
하나님의 영은 수면 위에 운행하시니라
하나님이 이르시되 빛이 있으라 하시니 빛이 있었고`

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <div className={styles.macosControls}>
              <button className={`${styles.macosControl} ${styles.close}`}></button>
              <button className={`${styles.macosControl} ${styles.minimize}`}></button>
              <button className={`${styles.macosControl} ${styles.maximize}`}></button>
            </div>
            <h1 className={styles.title}>BibleSlide</h1>
          </div>

          <div className={styles.headerRight}>
            <ToggleGroup.Root
              className={styles.toggleGroup}
              type="single"
              value={bibleVersion}
              onValueChange={(value) => value && setBibleVersion(value)}
            >
              {["개역개정", "개역한글", "새번역", "KJV", "NIV"].map((version) => (
                <ToggleGroup.Item key={version} className={styles.toggleItem} value={version}>
                  {version}
                </ToggleGroup.Item>
              ))}
            </ToggleGroup.Root>

            <div className={styles.switchContainer}>
              <Switch.Root className={styles.switchRoot} checked={isDarkMode} onCheckedChange={setIsDarkMode}>
                <Switch.Thumb className={styles.switchThumb}>
                  {isDarkMode ? <Sun className={styles.switchIcon} /> : <Moon className={styles.switchIcon} />}
                </Switch.Thumb>
              </Switch.Root>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.mainContent}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            {/* Search Input */}
            <div className={styles.inputGroup}>
              <input
                className={styles.input}
                value={verseInput}
                onChange={(e) => setVerseInput(e.target.value)}
                placeholder="창1:1-3"
              />
            </div>

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
                max={48}
                min={12}
                step={2}
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
                min={0}
                max={20}
                step={1}
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
                min={1}
                max={3}
                step={0.1}
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

        <div className={styles.previewArea}>
          {/* Single Large Preview Panel */}
          <div className={styles.previewPanel}>
              <div className={styles.verseDisplay} style={{ fontSize: `${textSize[0]}px` }}>
                  <p className={styles.verseLine}>
                    {verseText}
                  </p>
              </div>
          </div>

          <div className={styles.exportSection}>
            <button className={styles.exportButton}>
              <Download className={styles.buttonIcon} />
              <span>PPT로 내보내기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;
