import styles from './Header.module.css';
import { Dispatch, SetStateAction, useState } from 'react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import * as Switch from '@radix-ui/react-switch';
import { Moon, Sun } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: Dispatch<SetStateAction<boolean>>;
}

const BIBLE_VERSIONS = ['개역개정', '개역한글', '새번역', 'KJV', 'NIV'];

const Header = ({ isDarkMode, setIsDarkMode }: HeaderProps) => {
  const [bibleVersion, setBibleVersion] = useState('개역개정');

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.headerLeft}>
          <img className={styles.logo} src="/logo.png" />
        </div>

        <div className={styles.headerRight}>
          <ToggleGroup.Root
            className={styles.toggleGroup}
            type="single"
            value={bibleVersion}
            onValueChange={(value) => value && setBibleVersion(value)}
            aria-label="성경 버전 선택"
          >
            {BIBLE_VERSIONS.map((version) => (
              <ToggleGroup.Item key={version} className={styles.toggleItem} value={version}>
                {version}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>

          <div className={styles.switchContainer}>
            <Switch.Root
              className={styles.switchRoot}
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
              aria-label="다크 모드 전환"
            >
              <Switch.Thumb className={styles.switchThumb}>
                {isDarkMode ? (
                  <Sun className={styles.switchIcon} />
                ) : (
                  <Moon className={styles.switchIcon} />
                )}
              </Switch.Thumb>
            </Switch.Root>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
