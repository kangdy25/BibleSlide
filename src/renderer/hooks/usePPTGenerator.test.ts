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
  const mockAlert = vi.fn();
  const mockConsoleError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // window 객체에 electronAPI 및 alert 모킹 주입
    // @ts-ignore - 테스트 환경에서 window 객체 확장
    window.electronAPI = {
      generateSlide: mockGenerateSlide,
    };
    window.alert = mockAlert;
    
    // console.error 스파이
    vi.spyOn(console, 'error').mockImplementation(mockConsoleError);
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
    });

    expect(mockAlert).toHaveBeenCalledWith('성경 구절을 입력해주세요.');
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

    expect(mockAlert).toHaveBeenCalledWith('생성 성공');
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
    });

    expect(mockAlert).toHaveBeenCalledWith('PPT 생성 실패: 알 수 없는 오류');
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
    });

    expect(mockConsoleError).toHaveBeenCalledWith('IPC 통신 오류:', error);
    expect(mockAlert).toHaveBeenCalledWith('PPT 생성 중 오류가 발생했습니다.');
    expect(result.current.isLoading).toBe(false);
  });
});
