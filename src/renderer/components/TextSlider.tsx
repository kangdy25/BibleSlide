import styles from './TextSlider.module.css';
import * as Slider from '@radix-ui/react-slider';
import useUserSettings from '../contexts/useUserSettings';

interface TextValueSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export function TextValueSlider({ label, value, min, max, step = 1, unit = '', onChange }: TextValueSliderProps) {
  return (
    <div className={styles.control}>
      <span className={styles.sectionLabel}>{label}: {value}{unit}</span>
      <Slider.Root
        className={styles.sliderRoot}
        value={[value]}
        onValueChange={([next]) => onChange(next)}
        min={min}
        max={max}
        step={step}
      >
        <Slider.Track className={styles.sliderTrack}>
          <Slider.Range className={styles.sliderRange} />
        </Slider.Track>
        <Slider.Thumb className={styles.sliderThumb} aria-label={label} />
      </Slider.Root>
    </div>
  );
}

const TextSlider = () => {
  const { settings, setSettings } = useUserSettings();
  return (
    <div className={styles.section}>
      <TextValueSlider label="텍스트 크기" value={settings.textSize} min={12} max={48} unit="px"
        onChange={textSize => setSettings(previous => ({ ...previous, textSize }))} />
      <TextValueSlider label="자간" value={settings.letterSpacing} min={0} max={20} unit="px"
        onChange={letterSpacing => setSettings(previous => ({ ...previous, letterSpacing }))} />
      <TextValueSlider label="행간" value={settings.lineHeight} min={1} max={3} step={0.05}
        onChange={lineHeight => setSettings(previous => ({ ...previous, lineHeight }))} />
    </div>
  );
};

export default TextSlider;
