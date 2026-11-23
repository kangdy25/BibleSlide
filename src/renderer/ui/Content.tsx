import BibleFormatPreview from './BibleFormatPreview';
import SlideFormatSelect from '../components/SlideFormatSelect';
import styles from './Content.module.css';
import useUserSettings from '../contexts/useUserSettings';

const Content = () => {
  const { settings, setSettings } = useUserSettings();

  return (
    <div className={styles.previewArea}>
      <BibleFormatPreview ratio={settings.format} />
      <SlideFormatSelect
        value={settings.format}
        onChange={format => setSettings(previous => ({ ...previous, format }))}
      />
    </div>
  );
};

export default Content;
