import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import type { SlideRatio } from '../../shared/slideLayouts';
import selectStyles from './SelectFont.module.css';
import styles from './SlideFormatSelect.module.css';

const formats = [['wide', '16:9'], ['led', '24:9']] as const;

export default function SlideFormatSelect({ value, onChange }: {
  value: SlideRatio;
  onChange: (value: SlideRatio) => void;
}) {
  return (
    <div className={styles.formatPicker}>
      <span className={selectStyles.sectionLabel}>출력 형식</span>
      <Select.Root value={value} onValueChange={format => {
        if (format === 'wide' || format === 'led') onChange(format);
      }}>
        <Select.Trigger aria-label="출력 형식" className={selectStyles.selectTrigger}>
          <Select.Value />
          <Select.Icon asChild>
            <ChevronDown className={selectStyles.selectIcon} />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content position="popper" align="end" sideOffset={4} className={`${selectStyles.selectContent} ${styles.formatMenu}`}>
            <Select.Viewport className={selectStyles.selectViewport}>
              {formats.map(([format, label]) => (
                <Select.Item key={format} value={format} className={selectStyles.selectItem}>
                  <Select.ItemText>{label}</Select.ItemText>
                  <Select.ItemIndicator className={selectStyles.selectItemIndicator}>
                    <Check size={14} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
