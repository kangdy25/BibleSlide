import styles from './Header.module.css';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import useUserSettings from '../contexts/useUserSettings';
import { BIBLE_VERSIONS, BibleVersion } from '../../main/constant/bible';

const Header = ({ onHome }: { onHome?: () => void }) => {
  const { settings, setSettings } = useUserSettings();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.headerLeft}>
          {onHome ? (
            <button className={styles.logoButton} type="button" onClick={onHome}
              aria-label="WorshipSlide 홈으로" title="WorshipSlide 홈으로">
              <img className={styles.logo} src="./logo.png" alt="앱 로고" />
            </button>
          ) : (
            <img className={styles.logo} src="./logo.png" alt="앱 로고" />
          )}
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
        </div>
      </div>
    </header>
  );
};

export default Header;
