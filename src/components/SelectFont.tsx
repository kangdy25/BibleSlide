import styles from './SelectFont.module.css';
import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import useUserSettings from '../contexts/useUserSettings';
import * as RadioGroup from '@radix-ui/react-radio-group';

const SelectFont = () => {
  const { settings, setSettings } = useUserSettings();
  console.log(settings.isBold);
  return (
    <>
      <div className={styles.section}>
        <label className={styles.sectionLabel}>폰트</label>
        <Select.Root
          value={settings.font}
          onValueChange={(value) => setSettings((prev) => ({ ...prev, font: value }))}
        >
          <Select.Trigger className={styles.selectTrigger}>
            <Select.Value />
            <Select.Icon className={styles.selectIcon}>
              <ChevronDown />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className={styles.selectContent}>
              <Select.Viewport className={styles.selectViewport}>
                {[
                  'Pretendard',
                  'KoPubWorld돋움체_Pro',
                  'KoPubWorld바탕체_Pro',
                  '카페24 단정해 OTF',
                  '카페24 당당해 OTF',
                  '나눔명조',
                  '배찌체',
                  '나눔손글씨 펜',
                ].map((fontOption) => (
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
      <div className={styles.section}>
        <RadioGroup.Root
          className={styles.radioGroup}
          defaultValue="가늘게"
          onValueChange={(value: '가늘게' | '굵게') => setSettings((prev) => ({ ...prev, isBold: value }))}
        >
          <div className={styles.radioItem}>
            <RadioGroup.Item className={styles.radioButton} value="가늘게" id="light">
              <RadioGroup.Indicator className={styles.radioIndicator} />
            </RadioGroup.Item>
            <label className={styles.radioLabel} htmlFor="light">
              가늘게
            </label>
          </div>
          <div className={styles.radioItem}>
            <RadioGroup.Item className={styles.radioButton} value="굵게" id="bold">
              <RadioGroup.Indicator className={styles.radioIndicator} />
            </RadioGroup.Item>
            <label className={styles.radioLabel} htmlFor="bold">
              굵게
            </label>
          </div>
        </RadioGroup.Root>
      </div>
    </>
  );
};

export default SelectFont;
