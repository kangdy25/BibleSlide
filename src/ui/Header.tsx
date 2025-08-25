import styles from './Header.module.css';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import * as Switch from '@radix-ui/react-switch';
import { Moon, Sun } from 'lucide-react';
import useUserSettings from '../contexts/useUserSettings';
import { BIBLE_VERSIONS, BibleVersion } from '../../app/main/constant/bible';

const Header = () => {
  const { settings, setSettings } = useUserSettings();

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
            value={settings.bibleVersion}
            onValueChange={(value) =>
              value && setSettings((prev) => ({ ...prev, bibleVersion: value as BibleVersion }))
            }
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
              checked={settings.isDarkMode}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, isDarkMode: checked }))}
              aria-label="다크 모드 전환"
            >
              <Switch.Thumb className={styles.switchThumb}>
                {settings.isDarkMode ? (
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
