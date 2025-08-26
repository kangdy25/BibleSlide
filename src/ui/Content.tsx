import styles from './Content.module.css';
import { Download } from 'lucide-react';
import useUserSettings from '../contexts/useUserSettings';

const Content = () => {
  const { settings, setSettings } = useUserSettings();
  const verseText = `태초에 하나님이 천지를 창조하시니라
땅이 혼돈하고 공허하며 흑암이 깊음 위에 있고
하나님의 영은 수면 위에 운행하시니라
하나님이 이르시되 빛이 있으라 하시니 빛이 있었고`;

  return (
    <div className={styles.previewArea}>
      {/* Single Large Preview Panel */}
      <div className={styles.previewPanel}>
        <div
          className={styles.verseDisplay}
          style={{
            fontSize: `${settings.textSize}px`,
            letterSpacing: `${settings.letterSpacing}px`,
            lineHeight: `${settings.lineHeight}`,
            fontFamily: `${settings.font}`,
          }}
        >
          <p className={styles.verseLine}>{verseText}</p>
        </div>
      </div>
      <div className={styles.exportSection}>
        <button className={styles.exportButton}>
          <Download className={styles.buttonIcon} />
          <span>PPT 다운로드</span>
        </button>
      </div>
    </div>
  );
};

export default Content;
