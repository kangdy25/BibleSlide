/**
 * @vitest-environment node
 */
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { ipcMain } from 'electron';
import { registerVerseHandler } from './verseHandler';
import { fetchVerses } from '../utils/parseVerse';

// Electron ipcMain 모의
vi.mock('electron', () => ({
  ipcMain: {
    handle: vi.fn(),
  },
}));

// 구절 파싱 유틸리티 모의
vi.mock('../utils/parseVerse', () => ({
  fetchVerses: vi.fn(),
}));

describe('성경 구절 핸들러 (Verse Handler)', () => {
  let handler: Function;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // 핸들러 캡처
    (ipcMain.handle as Mock).mockImplementation((channel, listener) => {
      if (channel === 'fetch-verse') {
        handler = listener;
      }
    });
    
    registerVerseHandler();
  });

  it('fetch-verse 채널에 핸들러가 등록되어야 한다', () => {
    expect(ipcMain.handle).toHaveBeenCalledWith('fetch-verse', expect.any(Function));
  });

  it('정상적인 입력에 대해 파싱된 구절 배열을 반환해야 한다', async () => {
    const mockOutput = ['창세기 1장 1절 태초에...', '창세기 1장 2절 땅이...'];
    (fetchVerses as Mock).mockReturnValue(mockOutput);

    // 핸들러 실행 (event 객체는 빈 객체로 전달)
    const result = await handler({}, '창 1:1-2', 'GAE');

    expect(fetchVerses).toHaveBeenCalledWith('창 1:1-2', 'GAE');
    expect(result).toEqual(mockOutput);
  });

  it('버전 인자가 없을 경우 기본값(GAE)으로 호출해야 한다', async () => {
    (fetchVerses as Mock).mockReturnValue([]);
    
    await handler({}, '창 1:1'); // version 인자 생략

    expect(fetchVerses).toHaveBeenCalledWith('창 1:1', 'GAE');
  });

  it('파싱 중 에러 발생 시 에러 메시지가 담긴 배열을 반환해야 한다', async () => {
    (fetchVerses as Mock).mockImplementation(() => {
      throw new Error('유효하지 않은 구절입니다');
    });

    const result = await handler({}, '잘못된입력');

    expect(result).toHaveLength(1);
    expect(result[0]).toContain('Error');
    expect(result[0]).toContain('유효하지 않은 구절입니다');
  });
});
