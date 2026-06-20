import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import usePPTGenerator from './usePPTGenerator';
import useUserSettings from '../contexts/useUserSettings';

// useUserSettings 훅 모킹
vi.mock('../contexts/useUserSettings', () => ({
  default: vi.fn(),
}));

describe('usePPTGenerator 훅 테스트', () => {
  // window.electronAPI 모킹을 위한 준비
  const mockGenerateSlide = vi.fn();
  const mockShowAlert = vi.fn().mockResolvedValue({ success: true });
  const mockConsoleError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // window 객체에 electronAPI 모킹 주입
    // @ts-ignore - 테스트 환경에서 window 객체 확장
    window.electronAPI = {
      generateSlide: mockGenerateSlide,
      showAlert: mockShowAlert,
    };
    
    // console.error 스파이
    vi.spyOn(console, 'error').mockImplementation(mockConsoleError);

    // navigator.clipboard 모킹
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    // 가상 DOM에 input 엘리먼트 배치
    const input = document.createElement('input');
    document.body.appendChild(input);
  });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();

    // 가상 DOM 정리
    const input = document.querySelector('input');
    if (input) {
      document.body.removeChild(input);
    }
  });

  it('초기 상태에서 isLoading은 false여야 한다', () => {
    // 기본 설정 모킹
    (useUserSettings as any).mockReturnValue({
      settings: { verseInput: 'Test Verse' },
    });

    const { result } = renderHook(() => usePPTGenerator());
    expect(result.current.isLoading).toBe(false);
  });

  it('성경 구절 입력이 없으면 경고창을 띄우고 중단해야 한다', async () => {
    // verseInput이 빈 문자열인 경우
    (useUserSettings as any).mockReturnValue({
      settings: { verseInput: '' },
    });

    const { result } = renderHook(() => usePPTGenerator());

    await act(async () => {
      await result.current.generatePPT();
      vi.runAllTimers();
    });

    expect(mockShowAlert).toHaveBeenCalledWith('성경 구절을 입력해주세요.', 'warning');
    expect(mockGenerateSlide).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });

  it('PPT 생성이 성공하면 성공 메시지를 알림으로 보여줘야 한다', async () => {
    // 정상적인 설정 모킹
    const mockDataSettings = {
      verseInput: '창세기 1:1',
      bibleVersion: '개역개정',
      font: 'Pretendard',
      align: 'center',
      isBold: true,
      textSize: 20,
      letterSpacing: 0,
      lineHeight: 1.0,
    };

    (useUserSettings as any).mockReturnValue({
      settings: mockDataSettings,
    });

    // 성공 응답 모킹
    mockGenerateSlide.mockResolvedValue({ success: true, message: '생성 성공' });

    const { result } = renderHook(() => usePPTGenerator());

    // 실행 및 로딩 상태 확인
    await act(async () => {
      const promise = result.current.generatePPT();
      await promise;
      vi.runAllTimers();
    });

    // 호출 파라미터 확인 (settings 기반 데이터 매핑 확인)
    expect(mockGenerateSlide).toHaveBeenCalledWith({
      input: mockDataSettings.verseInput,
      bibleVersion: mockDataSettings.bibleVersion,
      font: mockDataSettings.font,
      align: mockDataSettings.align,
      isBold: mockDataSettings.isBold,
      textSize: mockDataSettings.textSize,
      letterSpacing: mockDataSettings.letterSpacing,
      lineHeight: mockDataSettings.lineHeight,
    });

    expect(mockShowAlert).toHaveBeenCalledWith('생성 성공', 'info');
    expect(result.current.isLoading).toBe(false);
  });

  it('PPT 생성이 실패하면 에러 메시지를 알림으로 보여줘야 한다', async () => {
    (useUserSettings as any).mockReturnValue({
      settings: { verseInput: 'Test' },
    });

    mockGenerateSlide.mockResolvedValue({ success: false, message: '알 수 없는 오류' });

    const { result } = renderHook(() => usePPTGenerator());

    await act(async () => {
      await result.current.generatePPT();
      vi.runAllTimers();
    });

    expect(mockShowAlert).toHaveBeenCalledWith('PPT 생성 실패: 알 수 없는 오류', 'error');
    expect(result.current.isLoading).toBe(false);
  });

  it('IPC 통신 중 에러가 발생하면 예외 처리를 해야 한다', async () => {
    (useUserSettings as any).mockReturnValue({
      settings: { verseInput: 'Test' },
    });

    // 통신 에러 발생
    const error = new Error('IPC Error');
    mockGenerateSlide.mockRejectedValue(error);

    const { result } = renderHook(() => usePPTGenerator());

    await act(async () => {
      await result.current.generatePPT();
      vi.runAllTimers();
    });

    expect(mockConsoleError).toHaveBeenCalledWith('IPC 통신 오류:', error);
    expect(mockShowAlert).toHaveBeenCalledWith('PPT 생성 중 오류가 발생했습니다.', 'error');
    expect(result.current.isLoading).toBe(false);
  });

  describe('copyVerses 기능 테스트', () => {
    it('성경 구절 입력이 없으면 경고창을 띄우고 중단해야 한다', async () => {
      (useUserSettings as any).mockReturnValue({
        settings: { verseInput: '' },
      });

      const { result } = renderHook(() => usePPTGenerator());

      await act(async () => {
        await result.current.copyVerses();
        vi.runAllTimers();
      });

      expect(mockShowAlert).toHaveBeenCalledWith('성경 구절을 입력해주세요.', 'warning');
      expect(result.current.isLoading).toBe(false);
    });

    it('성경 구절 조회가 성공하면 클립보드에 복사하고 성공 알림을 보여줘야 한다', async () => {
      (useUserSettings as any).mockReturnValue({
        settings: { verseInput: '창1:1', bibleVersion: '개역개정' },
      });

      const mockFetchVerse = vi.fn().mockResolvedValue(['창:창세기:Genesis:1:1:태초에...']);
      window.electronAPI.fetchVerse = mockFetchVerse;

      const { result } = renderHook(() => usePPTGenerator());

      await act(async () => {
        await result.current.copyVerses();
        vi.runAllTimers();
      });

      expect(mockFetchVerse).toHaveBeenCalledWith('창1:1', '개역개정');
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('창세기 1:1 태초에...');
      expect(mockShowAlert).toHaveBeenCalledWith('성경 구절이 클립보드에 복사되었습니다.', 'info');
      expect(result.current.isLoading).toBe(false);
    });

    it('조회된 구절이 없거나 에러가 있으면 에러 메시지를 보여줘야 한다', async () => {
      (useUserSettings as any).mockReturnValue({
        settings: { verseInput: '창1:1', bibleVersion: '개역개정' },
      });

      // 에러 반환 모킹
      window.electronAPI.fetchVerse = vi.fn().mockResolvedValue(['Error: 구절을 찾을 수 없습니다.']);

      const { result } = renderHook(() => usePPTGenerator());

      await act(async () => {
        await result.current.copyVerses();
        vi.runAllTimers();
      });

      expect(mockShowAlert).toHaveBeenCalledWith('구절 조회 실패: 구절을 찾을 수 없습니다.', 'error');
      expect(result.current.isLoading).toBe(false);
    });

    it('복사 로직 수행 중 예외 발생 시 에러 처리를 해야 한다', async () => {
      (useUserSettings as any).mockReturnValue({
        settings: { verseInput: '창1:1' },
      });

      const error = new Error('Clipboard Failed');
      window.electronAPI.fetchVerse = vi.fn().mockRejectedValue(error);

      const { result } = renderHook(() => usePPTGenerator());

      await act(async () => {
        await result.current.copyVerses();
        vi.runAllTimers();
      });

      expect(mockConsoleError).toHaveBeenCalledWith('구절 복사 오류:', error);
      expect(mockShowAlert).toHaveBeenCalledWith('구절 복사 중 오류가 발생했습니다.', 'error');
      expect(result.current.isLoading).toBe(false);
    });

    it('구절 형식의 파트 개수가 6개 미만이면 원래 문자열을 그대로 반환하여 복사해야 한다', async () => {
      (useUserSettings as any).mockReturnValue({
        settings: { verseInput: '창1:1', bibleVersion: '개역개정' },
      });

      const mockFetchVerse = vi.fn().mockResolvedValue(['짧은구절', '창:창세기:Genesis:1:1:태초에...']);
      window.electronAPI.fetchVerse = mockFetchVerse;

      const { result } = renderHook(() => usePPTGenerator());

      await act(async () => {
        await result.current.copyVerses();
        vi.runAllTimers();
      });

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('짧은구절\n창세기 1:1 태초에...');
      expect(mockShowAlert).toHaveBeenCalledWith('성경 구절이 클립보드에 복사되었습니다.', 'info');
      expect(result.current.isLoading).toBe(false);
    });
  });
});
