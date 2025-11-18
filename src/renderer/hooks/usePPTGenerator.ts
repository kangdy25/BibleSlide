import { useState } from 'react';
import useUserSettings from '../contexts/useUserSettings';

const usePPTGenerator = () => {
  const { settings } = useUserSettings();
  const [isLoading, setIsLoading] = useState(false);

  const generatePPT = async () => {
    if (!settings.verseInput) {
      alert('성경 구절을 입력해주세요.');
      return;
    }

    setIsLoading(true);

    const data = {
      input: settings.verseInput,
      bibleVersion: settings.bibleVersion,
      font: settings.font,
      align: settings.align,
      isBold: settings.isBold,
      textSize: settings.textSize,
      letterSpacing: settings.letterSpacing,
      lineHeight: settings.lineHeight,
    };

    try {
      // 메인 프로세스로 데이터 전송 및 결과 대기
      const result = await window.electronAPI.generateSlide(data);
      if (result.success) {
        alert(result.message);
      } else {
        alert(`PPT 생성 실패: ${result.message}`);
      }
    } catch (error) {
      console.error('IPC 통신 오류:', error);
      alert('PPT 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return { generatePPT, isLoading };
};

export default usePPTGenerator;
