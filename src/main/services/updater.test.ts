/**
 * @vitest-environment node
 */
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { autoUpdater } from 'electron-updater';
import { dialog } from 'electron';
import { setupAutoUpdater, checkForUpdates } from './updater';

// Electron 모듈 모의
vi.mock('electron', () => ({
  dialog: {
    showMessageBox: vi.fn().mockResolvedValue({ response: 0 }),
  },
}));

// Electron-Updater 모듈 모의
vi.mock('electron-updater', () => ({
  autoUpdater: {
    on: vi.fn(),
    checkForUpdatesAndNotify: vi.fn(),
    quitAndInstall: vi.fn(),
    verifyUpdateCodeSignature: true,
  },
  AppUpdater: class {},
}));

describe('자동 업데이트 서비스 (Updater Service)', () => {
  const originalPlatform = process.platform;

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
      configurable: true
    });
    // 기본적으로 서명 검증 true로 초기화 (테스트 격리를 위해)
    (autoUpdater as any).verifyUpdateCodeSignature = true;
  });

  afterEach(() => {
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
      configurable: true
    });
  });

  it('초기화 시 이벤트 리스너들이 등록되어야 한다', () => {
    setupAutoUpdater();
    
    // 주요 이벤트 리스너 등록 확인
    expect(autoUpdater.on).toHaveBeenCalledWith('update-downloaded', expect.any(Function));
    expect(autoUpdater.on).toHaveBeenCalledWith('error', expect.any(Function));
    expect(autoUpdater.on).toHaveBeenCalledWith('checking-for-update', expect.any(Function));
    expect(autoUpdater.on).toHaveBeenCalledWith('update-available', expect.any(Function));
  });

  it('Windows 플랫폼에서는 verifyUpdateCodeSignature를 false로 설정해야 한다', () => {
    Object.defineProperty(process, 'platform', {
      value: 'win32',
      configurable: true
    });

    setupAutoUpdater();
    expect((autoUpdater as any).verifyUpdateCodeSignature).toBe(false);
  });

  it('macOS 등 다른 플랫폼에서는 verifyUpdateCodeSignature를 변경하지라 않아야 한다 (기본값 유지)', () => {
    Object.defineProperty(process, 'platform', {
      value: 'darwin',
      configurable: true
    });
    // 재설정을 위해 true로 명시적 초기화
    (autoUpdater as any).verifyUpdateCodeSignature = true;

    setupAutoUpdater();
    expect((autoUpdater as any).verifyUpdateCodeSignature).toBe(true);
  });

  it('업데이트 확인 함수 호출 시 autoUpdater를 트리거해야 한다', () => {
    checkForUpdates();
    expect(autoUpdater.checkForUpdatesAndNotify).toHaveBeenCalled();
  });

  it('업데이트 다운로드 완료 후 사용자가 "재시작 및 설치"를 선택하면 quitAndInstall을 호출해야 한다', async () => {
    let downloadCallback: Function | undefined;
    (autoUpdater.on as Mock).mockImplementation((event, cb) => {
      if (event === 'update-downloaded') {
        downloadCallback = cb;
      }
    });
    
    // 사용자가 '재시작' (버튼 인덱스 0) 선택 모의
    (dialog.showMessageBox as Mock).mockResolvedValue({ response: 0 });

    setupAutoUpdater();
    const mockInfo = { version: '2.0.0' };
    
    // 이벤트 트리거
    await downloadCallback!(mockInfo);

    expect(dialog.showMessageBox).toHaveBeenCalled();
    // nextTick 대기 (showMessageBox promise resolution)
    await new Promise(process.nextTick);

    expect(autoUpdater.quitAndInstall).toHaveBeenCalledWith(false, true);
  });

  it('업데이트 다운로드 완료 후 사용자가 "나중에"를 선택하면 quitAndInstall을 호출하지 않아야 한다', async () => {
    let downloadCallback: Function | undefined;
    (autoUpdater.on as Mock).mockImplementation((event, cb) => {
      if (event === 'update-downloaded') {
        downloadCallback = cb;
      }
    });

    // 사용자가 '나중에' (버튼 인덱스 1) 선택 모의
    (dialog.showMessageBox as Mock).mockResolvedValue({ response: 1 });

    setupAutoUpdater();
    const mockInfo = { version: '2.0.0' };
    
    await downloadCallback!(mockInfo);

    expect(dialog.showMessageBox).toHaveBeenCalled();
    await new Promise(process.nextTick);

    expect(autoUpdater.quitAndInstall).not.toHaveBeenCalled();
  });

  describe('콘솔 로그 이벤트 테스트', () => {
    let consoleLogSpy: any;
    let consoleErrorSpy: any;

    beforeEach(() => {
      consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleLogSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    // 헬퍼 함수: 특정 이벤트의 콜백을 가져오는 함수
    const getEventCallback = (eventName: string): Function | undefined => {
      const calls = (autoUpdater.on as Mock).mock.calls;
      const call = calls.find(c => c[0] === eventName);
      return call ? call[1] : undefined;
    };

    it('에러 발생 시(error) 콘솔에 에러를 출력해야 한다', () => {
      setupAutoUpdater();
      const callback = getEventCallback('error');
      expect(callback).toBeDefined();

      const errorMsg = '네트워크 연결 실패';
      callback!(errorMsg);

      expect(consoleErrorSpy).toHaveBeenCalledWith('업데이트 오류 발생:', errorMsg);
    });

    it('업데이트 확인 중(checking-for-update)일 때 로그를 출력해야 한다', () => {
      setupAutoUpdater();
      const callback = getEventCallback('checking-for-update');
      expect(callback).toBeDefined();

      callback!();

      expect(consoleLogSpy).toHaveBeenCalledWith('업데이트 확인 중...');
    });

    it('업데이트가 가능할 때(update-available) 로그를 출력해야 한다', () => {
      setupAutoUpdater();
      const callback = getEventCallback('update-available');
      expect(callback).toBeDefined();

      callback!();

      expect(consoleLogSpy).toHaveBeenCalledWith('새로운 업데이트가 있습니다.');
    });
  });
});
