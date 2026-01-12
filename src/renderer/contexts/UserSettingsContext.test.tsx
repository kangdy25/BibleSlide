import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, renderHook } from '@testing-library/react';
import { UserSettingsProvider } from './UserSettingsContext';
import useUserSettings from './useUserSettings';

// useDeviceOS 모킹
vi.mock('../hooks/useDeviceOS', () => ({
  default: vi.fn(),
}));

import useDeviceOS from '../hooks/useDeviceOS';

describe('UserSettingsContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('UserSettingsProvider', () => {
    it('children을 정상적으로 렌더링해야 한다', () => {
      (useDeviceOS as any).mockReturnValue('Unknown');

      render(
        <UserSettingsProvider>
          <div data-testid="child">Child Content</div>
        </UserSettingsProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('Windows OS인 경우 폰트 이름 뒤에 Medium을 붙여야 한다', () => {
      (useDeviceOS as any).mockReturnValue('Windows');

      const TestComponent = () => {
        const { settings } = useUserSettings();
        return <div data-testid="font">{settings.font}</div>;
      };

      render(
        <UserSettingsProvider>
          <TestComponent />
        </UserSettingsProvider>
      );

      expect(screen.getByTestId('font')).toHaveTextContent('KoPubWorld바탕체 Medium');
    });

    it('Windows가 아닌 경우 기본 폰트 이름을 사용해야 한다', () => {
      (useDeviceOS as any).mockReturnValue('MacOS');

      const TestComponent = () => {
        const { settings } = useUserSettings();
        return <div data-testid="font">{settings.font}</div>;
      };

      render(
        <UserSettingsProvider>
          <TestComponent />
        </UserSettingsProvider>
      );

      expect(screen.getByTestId('font')).toHaveTextContent('KoPubWorld바탕체');
    });

    it('OS가 변경되면(예: 초기 로드 후 감지) 폰트 설정을 OS에 맞게 업데이트해야 한다', () => {
      // 1. 처음에는 Unknown (Windows 아님)으로 시작
      (useDeviceOS as any).mockReturnValue('Unknown');

      const TestComponent = () => {
        const { settings } = useUserSettings();
        return <div data-testid="font">{settings.font}</div>;
      };

      const { rerender } = render(
        <UserSettingsProvider>
          <TestComponent />
        </UserSettingsProvider>
      );

      expect(screen.getByTestId('font')).toHaveTextContent('KoPubWorld바탕체');

      // 2. OS가 Windows로 변경됨을 시뮬레이션
      (useDeviceOS as any).mockReturnValue('Windows');

      // 3. 재렌더링하여 변경된 mock 값을 반영
      rerender(
        <UserSettingsProvider>
          <TestComponent />
        </UserSettingsProvider>
      );

      // 4. useEffect가 동작하여 폰트가 업데이트되었는지 확인
      expect(screen.getByTestId('font')).toHaveTextContent('KoPubWorld바탕체 Medium');
    });
  });

  describe('useUserSettings Hook', () => {
    it('Provider 내부에서 사용 시 설정을 조회하고 업데이트할 수 있어야 한다', async () => {
      (useDeviceOS as any).mockReturnValue('MacOS');

      const { result } = renderHook(() => useUserSettings(), {
        wrapper: UserSettingsProvider,
      });

      // 초기값 확인
      expect(result.current.settings.bibleVersion).toBe('개역개정');

      // 업데이트 실행
      await act(async () => {
        result.current.setSettings((prev) => ({
          ...prev,
          bibleVersion: '새번역',
        }));
      });

      // 업데이트 반영 확인
      expect(result.current.settings.bibleVersion).toBe('새번역');
    });

    it('Provider 외부에서 사용 시 에러를 던져야 한다', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useUserSettings());
      }).toThrow('useUserSettings는 UserSettingsProvider 내부에서 사용해야 합니다.');

      spy.mockRestore();
    });
  });
});
