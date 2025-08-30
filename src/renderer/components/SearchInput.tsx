import styles from './SearchInput.module.css';
import useUserSettings from '../contexts/useUserSettings';

const SearchInput = () => {
  const { settings, setSettings } = useUserSettings();

  return (
    <div className={styles.inputGroup}>
      <input
        className={styles.input}
        value={settings.verseInput}
        onChange={(e) => setSettings((prev) => ({ ...prev, verseInput: e.target.value }))}
        placeholder="창1:1-3"
      />
    </div>
  );
};

export default SearchInput;
