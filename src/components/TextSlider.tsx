import styles from './TextSlider.module.css';
import * as Slider from '@radix-ui/react-slider';
import { Dispatch, SetStateAction } from 'react';

export interface TextSliderProps {
  textSize: number[];
  setTextSize: Dispatch<SetStateAction<number[]>>;
  letterSpacing: number[];
  setLetterSpacing: Dispatch<SetStateAction<number[]>>;
  lineHeight: number[];
  setLineHeight: Dispatch<SetStateAction<number[]>>;
}

const TextSlider = ({
  textSize,
  setTextSize,
  letterSpacing,
  setLetterSpacing,
  lineHeight,
  setLineHeight,
}: TextSliderProps) => {
  return (
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
  );
};

export default TextSlider;
