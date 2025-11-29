import styles from './SelectFont.module.css';
import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import useUserSettings from '../contexts/useUserSettings';
import * as RadioGroup from '@radix-ui/react-radio-group';
import useDeviceOS from '../hooks/useDeviceOS';

// Kopub 폰트의 기본 이름
const KOPUB_DOTUM_BASE = 'KoPubWorld돋움체';
const KOPUB_BATANG_BASE = 'KoPubWorld바탕체';

// 모든 폰트 옵션 목록 (사용자에게 보여줄 기본 이름)
const FONT_OPTIONS_BASE = [
  'Pretendard',
  KOPUB_DOTUM_BASE,
  KOPUB_BATANG_BASE,
  '나눔바른고딕',
  '나눔명조',
  '나눔손글씨 펜',
];

const SelectFont = () => {
  const { settings, setSettings } = useUserSettings();
  const os = useDeviceOS();
  const isWindows = os === 'Windows';

  // Windows 운영체제인 경우, KoPub 폰트에는 Medium을 붙여주기
  const getFontValue = (baseName: string): string => {
    if (isWindows && (baseName === KOPUB_DOTUM_BASE || baseName === KOPUB_BATANG_BASE)) {
      return `${baseName} Medium`;
    }
    return baseName;
  };

  return (
    <div className={styles.section}>
      {/* Font 종류 선택 */}
      <div className={styles.fontSelect}>
        <label className={styles.sectionLabel}>폰트 설정</label>
        <Select.Root
          // value에는 settings.font (Medium이 포함될 수 있는 최종 이름)을 사용합니다.
          value={settings.font}
          onValueChange={(value) => setSettings((prev) => ({ ...prev, font: value }))}
        >
          <Select.Trigger className={styles.selectTrigger}>
            {/* Windows 운영체제일 때, Context API에서 붙이는 KoPub 폰트명의 Medium을 제거하기 */}
            <Select.Value>{settings.font.replace(' Medium', '')}</Select.Value>
            <Select.Icon className={styles.selectIcon}>
              <ChevronDown />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className={styles.selectContent}>
              <Select.Viewport className={styles.selectViewport}>
                {FONT_OPTIONS_BASE.map((fontBaseName) => {
                  const fontValue = getFontValue(fontBaseName);

                  return (
                    <Select.Item key={fontValue} className={styles.selectItem} value={fontValue}>
                      <Select.ItemText>{fontBaseName}</Select.ItemText>
                      <Select.ItemIndicator className={styles.selectItemIndicator}>
                        <Check />
                      </Select.ItemIndicator>
                    </Select.Item>
                  );
                })}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      {/* Font 굵기 선택  */}
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
