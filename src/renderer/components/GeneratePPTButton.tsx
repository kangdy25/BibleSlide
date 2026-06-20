import usePPTGenerator from '../hooks/usePPTGenerator';
import styles from './GeneratePPTButton.module.css';

const GeneratePPTButton = () => {
  const { generatePPT, copyVerses, isLoading } = usePPTGenerator();

  return (
    <div className={styles.exportSection}>
      <button className={styles.copyButton} onClick={copyVerses} disabled={isLoading}>
        <span>구절만 복사하기</span>
      </button>
      <button className={styles.exportButton} onClick={generatePPT} disabled={isLoading}>
        <span>{isLoading ? '생성 중...' : 'PPT 제작하기'}</span>
      </button>
    </div>
  );
};

export default GeneratePPTButton;
