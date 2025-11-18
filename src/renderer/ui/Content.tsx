import styles from './Content.module.css';
import useUserSettings from '../contexts/useUserSettings';
import { mockVerse } from '../../main/constant/mockVerse';

const Content = () => {
  const { settings } = useUserSettings();

  return (
    <div className={styles.previewArea}>
      {/* Single Large Preview Panel */}
      <div className={styles.previewPanel}>
        <div
          className={styles.verseDisplay}
          style={{
            fontSize: `${settings.textSize}px`,
            letterSpacing: `${settings.letterSpacing}px`,
            lineHeight: `${settings.lineHeight + 0.3}`,
            fontFamily: `${settings.font}`,
            fontWeight: `${settings.isBold === '굵게' ? 'bold' : 'normal'}`,
            textAlign: `${settings.align}`,
          }}
        >
          <p className={styles.verseLine}>{mockVerse[settings.bibleVersion]}</p>
        </div>
      </div>
    </div>
  );
};

export default Content;
