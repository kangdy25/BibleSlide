/**
 * @vitest-environment node
 */
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { ipcMain, dialog } from 'electron';
import { registerPPTHandler } from './pptHandler';
import { fetchVerses } from '../utils/parseVerse';
import { generatePPT } from '../utils/generatePPT';

// Electron 모듈 모의 (Mock)
vi.mock('electron', () => ({
  ipcMain: {
    handle: vi.fn(),
  },
  dialog: {
    showSaveDialog: vi.fn(),
  },
}));

// pptxgenjs 모듈 모의
vi.mock('pptxgenjs', () => ({
  default: class {
    writeFile = vi.fn().mockResolvedValue(undefined);
  },
}));

// 유틸리티 함수 모의
vi.mock('../utils/generatePPT', () => ({
  generatePPT: vi.fn(),
}));

vi.mock('../utils/parseVerse', () => ({
  fetchVerses: vi.fn(),
}));

describe('PPT 생성 핸들러 (PPT Handler)', () => {
  let handler: Function;

  // 테스트용 기본 데이터
  const mockData = {
    input: 'John 3:16',
    bibleVersion: 'GAE',
    align: 'center' as const,
    font: 'Arial',
    isBold: '굵게' as const,
    textSize: 20,
    letterSpacing: 0,
    lineHeight: 1.5,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // ipcMain.handle 등록 가로채기
    (ipcMain.handle as Mock).mockImplementation((channel, listener) => {
      if (channel === 'generate-slide') {
        handler = listener;
      }
    });
    
    // 핸들러 등록 함수 실행
    registerPPTHandler();
  });

  it('generate-slide 핸들러가 ipcMain에 등록되어야 한다', () => {
    expect(ipcMain.handle).toHaveBeenCalledWith('generate-slide', expect.any(Function));
  });

  it('PPT를 생성하고 사용자 지정 경로에 저장해야 한다', async () => {
    // Mock: 성경 구절 파싱 결과 (형식: 분류:한글책명:영문책명:장:절:내용)
    (fetchVerses as Mock).mockReturnValue(['Bible:요한복음:John:3:16:하나님이 세상을 이처럼 사랑하사...']);
    // Mock: generatePPT는 pptx 객체를 반환 (여기서는 writeFile 메서드를 가진 객체)
    (generatePPT as Mock).mockReturnValue({ writeFile: vi.fn().mockResolvedValue(undefined) });
    // Mock: 저장 대화상자 결과
    (dialog.showSaveDialog as Mock).mockResolvedValue({ filePath: 'C:/Users/Test/Desktop/BibleSlide_Test.pptx' });

    const result = await handler({}, mockData);

    // 검증
    expect(fetchVerses).toHaveBeenCalledWith(mockData.input, mockData.bibleVersion);
    expect(generatePPT).toHaveBeenCalled();
    expect(dialog.showSaveDialog).toHaveBeenCalled();
    expect(result).toEqual({ success: true, message: '파일이 C:/Users/Test/Desktop/BibleSlide_Test.pptx에 저장되었습니다.' });
  });

  it('KJV/NIV 등 영어 성경 요청 시 영문 제목으로 PPT를 생성해야 한다', async () => {
    // Mock: 영어 성경 구절
    (fetchVerses as Mock).mockReturnValue(['Bible:요한복음:John:3:16:For God so loved the world...']);
    (generatePPT as Mock).mockReturnValue({ writeFile: vi.fn().mockResolvedValue(undefined) });
    (dialog.showSaveDialog as Mock).mockResolvedValue({ filePath: 'C:/save.pptx' });

    // 실행 (버전을 KJV로 변경)
    await handler({}, { ...mockData, bibleVersion: 'KJV' });

    // 검증: generatePPT가 호출될 때 영문 제목(John 3:16)이 첫 번째 인자로 전달되었는지 확인
    // generatePPT 시그니처: (title, subTitle, content, ...)
    expect(generatePPT).toHaveBeenCalledWith(
        expect.stringContaining('John 3:16'), // title (영문)
        expect.stringContaining('John 3'),    // subTitle (영문)
        expect.stringContaining('For God'),   // content
        mockData.align,
        mockData.font,
        true, // isBold='굵게' -> true
        mockData.textSize,
        mockData.letterSpacing,
        mockData.lineHeight,
        undefined // 첫 호출 시 pptx 객체는 undefined
    );
  });

  it('파일 저장 대화상자에서 취소 시 실패 메시지를 반환해야 한다', async () => {
    (fetchVerses as Mock).mockReturnValue(['Bible:요한복음:John:3:16:내용']);
    (generatePPT as Mock).mockReturnValue({ writeFile: vi.fn() });
    // Mock: 취소 (filePath가 비어있거나 undefined)
    (dialog.showSaveDialog as Mock).mockResolvedValue({ cancelled: true, filePath: '' });

    const result = await handler({}, mockData);

    expect(result).toEqual({ success: false, message: '파일 저장이 취소되었습니다.' });
  });

  it('PPT 생성 또는 저장 중 오류 발생 시 에러 메시지를 반환해야 한다', async () => {
    (fetchVerses as Mock).mockReturnValue(['Bible:요한복음:John:3:16:내용']);
    // Mock: generatePPT 내부에서 에러 발생
    (generatePPT as Mock).mockImplementation(() => {
        throw new Error('폰트 로드 실패');
    });

    const result = await handler({}, mockData);

    expect(result).toContain('PPT 슬라이드 생성 오류');
    expect(result).toContain('폰트 로드 실패');
  });

  it('isBold가 "가늘게"인 경우 fontWeight를 false로 설정해야 한다', async () => {
    (fetchVerses as Mock).mockReturnValue(['Bible:요한복음:John:3:16:내용']);
    (generatePPT as Mock).mockReturnValue({ writeFile: vi.fn().mockResolvedValue(undefined) });
    (dialog.showSaveDialog as Mock).mockResolvedValue({ filePath: 'C:/save.pptx' });

    // 실행 (isBold를 '가늘게'로 변경)
    await handler({}, { ...mockData, isBold: '가늘게' });

    // 검증: 6번째 인자가 fontWeight (false여야 함)
    expect(generatePPT).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything(),
        false, // fontWeight expected to be false
        expect.anything(),
        expect.anything(),
        expect.anything(),
        undefined // 1st call pptx is undefined
    );
  });
});
