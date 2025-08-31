import styles from './TextSlider.module.css';
import * as Slider from '@radix-ui/react-slider';
import useUserSettings from '../contexts/useUserSettings';

const TextSlider = () => {
  const { settings, setSettings } = useUserSettings();

  return (
    <div className={styles.section}>
      <label className={styles.sectionLabel}>텍스트 크기: {settings.textSize}px</label>
      <Slider.Root
        className={styles.sliderRoot}
        value={[settings.textSize]}
        onValueChange={(value) => setSettings((prev) => ({ ...prev, textSize: value[0] }))}
        max={48}
        min={12}
        step={1}
      >
        <Slider.Track className={styles.sliderTrack}>
          <Slider.Range className={styles.sliderRange} />
        </Slider.Track>
        <Slider.Thumb className={styles.sliderThumb} />
      </Slider.Root>

      {/* 자간 */}
      <label className={styles.sectionLabel}>자간: {settings.letterSpacing}px</label>
      <Slider.Root
        className={styles.sliderRoot}
        value={[settings.letterSpacing]}
        min={0}
        max={20}
        step={1}
        onValueChange={(value) => setSettings((prev) => ({ ...prev, letterSpacing: value[0] }))}
      >
        <Slider.Track className={styles.sliderTrack}>
          <Slider.Range className={styles.sliderRange} />
        </Slider.Track>
        <Slider.Thumb className={styles.sliderThumb} />
      </Slider.Root>

      {/* 줄간격 */}
      <label className={styles.sectionLabel}>행간: {settings.lineHeight}</label>
      <Slider.Root
        className={styles.sliderRoot}
        value={[settings.lineHeight]}
        min={1}
        max={3}
        step={0.05}
        onValueChange={(value) => setSettings((prev) => ({ ...prev, lineHeight: value[0] }))}
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
