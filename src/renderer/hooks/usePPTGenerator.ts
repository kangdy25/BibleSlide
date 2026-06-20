import { useState } from 'react';
import useUserSettings from '../contexts/useUserSettings';

const usePPTGenerator = () => {
  const { settings } = useUserSettings();
  const [isLoading, setIsLoading] = useState(false);

  const generatePPT = async () => {
    if (!settings.verseInput) {
      window.electronAPI.showAlert('성경 구절을 입력해주세요.', 'warning');
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
        window.electronAPI.showAlert(result.message, 'info');
      } else {
        window.electronAPI.showAlert(`PPT 생성 실패: ${result.message}`, 'error');
      }
    } catch (error) {
      console.error('IPC 통신 오류:', error);
      window.electronAPI.showAlert('PPT 생성 중 오류가 발생했습니다.', 'error');
      return;
    } finally {
      setIsLoading(false);
      // 네이티브 메시지 박스가 포커스를 반환한 후에도 확실하게 입력창에 다시 포커싱합니다.
      setTimeout(() => {
        const inputEl = document.querySelector('input') as HTMLInputElement | null;
        inputEl?.focus();
      }, 50);
    }
  };

  const copyVerses = async () => {
    if (!settings.verseInput) {
      window.electronAPI.showAlert('성경 구절을 입력해주세요.', 'warning');
      return;
    }

    setIsLoading(true);

    try {
      const verses = await window.electronAPI.fetchVerse(settings.verseInput, settings.bibleVersion);
      
      if (verses[0].startsWith('Error:')) {
        const errorMsg = verses[0].replace('Error: ', '');
        window.electronAPI.showAlert(`구절 조회 실패: ${errorMsg}`, 'error');
        return;
      }

      const parsedVerses = verses.map((v) => {
        const parts = v.split(':');
        if (parts.length < 6) return v;
        const [_, fullName, __, chapter, verse, text] = parts;
        return `${fullName} ${chapter}:${verse} ${text}`;
      });

      const textToCopy = parsedVerses.join('\n');
      await navigator.clipboard.writeText(textToCopy);
      
      window.electronAPI.showAlert('성경 구절이 클립보드에 복사되었습니다.', 'info');
    } catch (error) {
      console.error('구절 복사 오류:', error);
      window.electronAPI.showAlert('구절 복사 중 오류가 발생했습니다.', 'error');
      return;
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        const inputEl = document.querySelector('input') as HTMLInputElement | null;
        inputEl?.focus();
      }, 50);
    }
  };

  return { generatePPT, copyVerses, isLoading };
};

export default usePPTGenerator;
