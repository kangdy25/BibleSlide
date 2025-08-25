import { Dispatch, SetStateAction } from 'react';
import styles from './SearchInput.module.css';

export interface SearchInputProps {
  verseInput: string;
  setVerseInput: Dispatch<SetStateAction<string>>;
}

const SearchInput = ({ verseInput, setVerseInput }: SearchInputProps) => {
  return (
    <div className={styles.inputGroup}>
      <input
        className={styles.input}
        value={verseInput}
        onChange={(e) => setVerseInput(e.target.value)}
        placeholder="창1:1-3"
      />
    </div>
  );
};

export default SearchInput;
