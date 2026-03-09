/**
 * @vitest-environment node
 */
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { app, BrowserWindow } from 'electron';
import { checkForUpdates, setupAutoUpdater } from './services/updater';
import { registerVerseHandler } from './ipc/verseHandler';
import { registerPPTHandler } from './ipc/pptHandler';

// 의존성 모듈 모의
vi.mock('./services/updater', () => ({
  setupAutoUpdater: vi.fn(),
  checkForUpdates: vi.fn(),
}));
vi.mock('./ipc/verseHandler', () => ({
  registerVerseHandler: vi.fn(),
}));
vi.mock('./ipc/pptHandler', () => ({
  registerPPTHandler: vi.fn(),
}));

// Electron 모듈 모의
const mockLoadURL = vi.fn();
const mockLoadFile = vi.fn();
const mockOpenDevTools = vi.fn();
// 생성자 호출 감지용 Mock
const mockBrowserWindowCtor = vi.fn();

vi.mock('electron', () => {
  return {
    app: {
      whenReady: vi.fn().mockResolvedValue(true),
      on: vi.fn(),
      quit: vi.fn(),
      isPackaged: true, // 기본: 패키징됨
    },
    // BrowserWindow를 클래스로 정의
    BrowserWindow: class {
      constructor(options: any) {
        mockBrowserWindowCtor(options);
      }
      loadURL = mockLoadURL;
      loadFile = mockLoadFile;
      webContents = { openDevTools: mockOpenDevTools };
      // static methods
      static getAllWindows = vi.fn().mockReturnValue([]);
    }
  };
});

describe('메인 프로세스 진입점 (index.ts)', () => {
  const originalPlatform = process.platform;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env.ELECTRON_RENDERER_URL = '';
    
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
      configurable: true
    });
    // 기본값 리셋
    (app as any).isPackaged = true;
  });

  afterEach(() => {
    delete process.env.ELECTRON_RENDERER_URL;
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
      configurable: true
    });
  });

  it('앱 시작 시 초기화 함수들을 호출해야 한다', async () => {
    await import('./index');
    expect(setupAutoUpdater).toHaveBeenCalled();
    expect(registerVerseHandler).toHaveBeenCalled();
    expect(registerPPTHandler).toHaveBeenCalled();
  });

  it('기본 설정(프로덕션) 시 loadFile과 업데이트 확인을 호출해야 한다', async () => {
    await import('./index');
    await new Promise(process.nextTick);
    
    // 생성자 옵션 검증
    expect(mockBrowserWindowCtor).toHaveBeenCalledWith(
        expect.objectContaining({
            width: 1020,
            height: 720,
            webPreferences: expect.objectContaining({ sandbox: false })
        })
    );

    expect(mockLoadFile).toHaveBeenCalledWith(expect.stringContaining('index.html'));
    expect(mockLoadURL).not.toHaveBeenCalled();
    expect(checkForUpdates).toHaveBeenCalled();
  });

  it('패키징되지 않은 환경(isPackaged=false)에서는 업데이트를 확인하지 않아야 한다', async () => {
    (app as any).isPackaged = false;
    
    await import('./index');
    await new Promise(process.nextTick);

    expect(checkForUpdates).not.toHaveBeenCalled();
  });

  it('개발 환경(ELECTRON_RENDERER_URL 설정) 시 loadURL과 openDevTools를 호출해야 한다', async () => {
    process.env.ELECTRON_RENDERER_URL = 'http://localhost:5173';
    
    await import('./index');
    await new Promise(process.nextTick);

    expect(mockBrowserWindowCtor).toHaveBeenCalled();
    expect(mockLoadURL).toHaveBeenCalledWith('http://localhost:5173');
    expect(mockOpenDevTools).toHaveBeenCalledWith({ mode: 'detach' });
    expect(mockLoadFile).not.toHaveBeenCalled();
  });

  it('window-all-closed 이벤트 발생 시 darwin(mac)이 아니면 앱을 종료해야 한다', async () => {
    Object.defineProperty(process, 'platform', {
      value: 'win32',
      configurable: true 
    });

    await import('./index');

    const calls = (app.on as Mock).mock.calls;
    const closedHandler = calls.find(call => call[0] === 'window-all-closed')?.[1];
    
    expect(closedHandler).toBeDefined();
    closedHandler();

    expect(app.quit).toHaveBeenCalled();
  });

  it('window-all-closed 이벤트 발생 시 darwin(mac)이면 앱을 종료하지 않아야 한다', async () => {
    Object.defineProperty(process, 'platform', {
      value: 'darwin',
      configurable: true
    });

    await import('./index');

    const calls = (app.on as Mock).mock.calls;
    const closedHandler = calls.find(call => call[0] === 'window-all-closed')?.[1];
    
    closedHandler();

    expect(app.quit).not.toHaveBeenCalled();
  });

  it('activate 이벤트 발생 시 열린 창이 없으면 createWindow를 호출해야 한다', async () => {
    await import('./index');

    // 이벤트 등록 확인
    const calls = (app.on as Mock).mock.calls;
    const activateHandler = calls.find(call => call[0] === 'activate')?.[1];
    expect(typeof activateHandler).toBe('function');

    // 초기 실행으로 한 번 호출되었으므로 카운트 초기화
    mockBrowserWindowCtor.mockClear();

    // 열린 창이 없음 (모의)
    (BrowserWindow as any).getAllWindows.mockReturnValue([]);

    // 핸들러 실행
    activateHandler();

    expect(mockBrowserWindowCtor).toHaveBeenCalled();
  });

  it('activate 이벤트 발생 시 이미 창이 열려있으면 createWindow를 호출하지 않아야 한다', async () => {
    await import('./index');

    const calls = (app.on as Mock).mock.calls;
    const activateHandler = calls.find(call => call[0] === 'activate')?.[1];

    mockBrowserWindowCtor.mockClear();

    // 창 1개 존재 (모의)
    (BrowserWindow as any).getAllWindows.mockReturnValue([{}]); 

    activateHandler();

    expect(mockBrowserWindowCtor).not.toHaveBeenCalled();
  });
});
