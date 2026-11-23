import BibleFormatPreview from './BibleFormatPreview';
import styles from './Content.module.css';
import useUserSettings from '../contexts/useUserSettings';

const Content = () => {
  const { settings, setSettings } = useUserSettings();

  return (
    <div className={styles.previewArea}>
      <BibleFormatPreview ratio={settings.format} />
      <label className="bibleFormat">
        출력 형식
        <select value={settings.format} onChange={({ target }) => {
          const format = target.value;
          if (format === 'wide' || format === 'led') {
            setSettings(previous => ({ ...previous, format }));
          }
        }}>
          <option value="wide">16:9</option>
          <option value="led">24:9</option>
        </select>
      </label>
    </div>
  );
};

export default Content;
