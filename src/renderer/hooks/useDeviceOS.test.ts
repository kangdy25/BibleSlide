import { describe, it, expect, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import useDeviceOS from './useDeviceOS';

describe('useDeviceOS', () => {
  const originalUserAgent = window.navigator.userAgent;

  afterEach(() => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true,
    });
  });

  function mockUserAgent(userAgent: string) {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: userAgent,
      configurable: true,
    });
  }

  it('Windows UserAgent를 감지해야 한다', () => {
    mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
    const { result } = renderHook(() => useDeviceOS());
    expect(result.current).toBe('Windows');
  });

  it('MacOS UserAgent를 감지해야 한다', () => {
    mockUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)');
    const { result } = renderHook(() => useDeviceOS());
    expect(result.current).toBe('MacOS');
  });

  it('iOS (iPhone) UserAgent를 감지해야 한다', () => {
    mockUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)');
    const { result } = renderHook(() => useDeviceOS());
    expect(result.current).toBe('iOS');
  });

  it('Android UserAgent를 감지해야 한다', () => {
    mockUserAgent('Mozilla/5.0 (Linux; Android 11; SM-G991B)');
    const { result } = renderHook(() => useDeviceOS());
    expect(result.current).toBe('Android');
  });

  it('Linux UserAgent를 감지해야 한다', () => {
    mockUserAgent('Mozilla/5.0 (X11; Linux x86_64)');
    const { result } = renderHook(() => useDeviceOS());
    expect(result.current).toBe('Linux');
  });

  it('알 수 없는 UserAgent는 Unknown을 반환해야 한다', () => {
    mockUserAgent('UnknownBot/1.0');
    const { result } = renderHook(() => useDeviceOS());
    expect(result.current).toBe('Unknown');
  });
});