import styles from './SelectFont.module.css';

import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

export interface SelectFontProps {
  font: string;
  setFont: Dispatch<SetStateAction<string>>;
}

const SelectFont = ({ font, setFont }: SelectFontProps) => {
  return (
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
              {['Pretendard', 'Noto Sans KR', 'Sans-serif', 'Serif'].map((fontOption) => (
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
  );
};

export default SelectFont;
