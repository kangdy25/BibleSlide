import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import styles from './SelectAlign.module.css';
import useUserSettings from '../contexts/useUserSettings';
type TextAlign = 'left' | 'center' | 'right';

const SelectAlign = () => {
  const { settings, setSettings } = useUserSettings();
  const displayAlign = settings.align.charAt(0).toUpperCase() + settings.align.slice(1);

  return (
    <div className={styles.container}>
      {/* 컴포넌트 제목 */}
      <div className={styles.label}>텍스트 정렬: {displayAlign}</div>

      {/* Radix Toggle Group */}
      <ToggleGroup.Root
        className={styles.alignGroup}
        type="single"
        aria-label="텍스트 정렬 선택"
        value={settings.align}
        onValueChange={(value) => setSettings((prev) => ({ ...prev, align: value as TextAlign }))}
      >
        <ToggleGroup.Item className={styles.alignItem} value="left" aria-label="왼쪽 정렬">
          <AlignLeft size={18} />
        </ToggleGroup.Item>

        <ToggleGroup.Item className={styles.alignItem} value="center" aria-label="가운데 정렬">
          <AlignCenter size={18} />
        </ToggleGroup.Item>

        <ToggleGroup.Item className={styles.alignItem} value="right" aria-label="오른쪽 정렬">
          <AlignRight size={18} />
        </ToggleGroup.Item>
      </ToggleGroup.Root>
    </div>
  );
};

export default SelectAlign;
