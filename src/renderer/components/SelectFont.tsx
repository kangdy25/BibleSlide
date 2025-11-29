import styles from './SelectFont.module.css';
import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import useUserSettings from '../contexts/useUserSettings';
import * as RadioGroup from '@radix-ui/react-radio-group';
import useDeviceOS from '../hooks/useDeviceOS';

// Kopub 폰트의 기본 이름
const KOPUB_DOTUM = 'KoPubWorld돋움체';
const KOPUB_BATANG = 'KoPubWorld바탕체';

const SelectFont = () => {
  const { settings, setSettings } = useUserSettings();
  const os = useDeviceOS();

  const isWindows = os === 'Windows';

  const kopubDotum = isWindows ? `${KOPUB_DOTUM} Medium` : KOPUB_DOTUM;
  const kopubBatang = isWindows ? `${KOPUB_BATANG} Medium` : KOPUB_BATANG;

  return (
    <div className={styles.section}>
      {/* Font 종류 선택 */}
      <div className={styles.fontSelect}>
        <label className={styles.sectionLabel}>폰트 설정</label>
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
                {['Pretendard', kopubDotum, kopubBatang, '나눔바른고딕', '나눔명조', '나눔손글씨 펜'].map(
                  (fontOption) => (
                    <Select.Item key={fontOption} className={styles.selectItem} value={fontOption}>
                      <Select.ItemText>{fontOption}</Select.ItemText>
                      <Select.ItemIndicator className={styles.selectItemIndicator}>
                        <Check />
                      </Select.ItemIndicator>
                    </Select.Item>
                  )
                )}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      {/* Font 굵기 선택 */}
      <div className={styles.boldSelect}>
        <RadioGroup.Root
          className={styles.radioGroup}
          defaultValue={settings.isBold}
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
    </div>
  );
};

export default SelectFont;
