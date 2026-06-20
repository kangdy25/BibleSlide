import { render, screen } from '@testing-library/react';
import { expect, it, describe, vi } from 'vitest';
import Content from './Content';
import useUserSettings from '../contexts/useUserSettings';

// useUserSettings 훅 모킹
vi.mock('../contexts/useUserSettings', () => ({
  default: vi.fn(),
}));

describe('Content 컴포넌트 테스트', () => {
  it('isBold가 굵게일 때 bold 폰트 스타일로 렌더링되어야 한다', () => {
    (useUserSettings as any).mockReturnValue({
      settings: {
        bibleVersion: '개역개정',
        textSize: 30,
        letterSpacing: 0,
        lineHeight: 1.25,
        font: 'KoPubWorld바탕체 Medium',
        isBold: '굵게',
        align: 'left',
      },
    });

    render(<Content />);

    const textEl = screen.getByText(/태초에 하나님이/);
    expect(textEl).toBeInTheDocument();
    
    // 스타일을 담고 있는 가장 가까운 div를 가져옴
    const displayPanel = textEl.parentElement;
    expect(displayPanel).toHaveStyle({ fontWeight: 'bold' });
  });

  it('isBold가 가늘게일 때 normal 폰트 스타일로 렌더링되어야 한다', () => {
    (useUserSettings as any).mockReturnValue({
      settings: {
        bibleVersion: '개역개정',
        textSize: 30,
        letterSpacing: 0,
        lineHeight: 1.25,
        font: 'KoPubWorld바탕체 Medium',
        isBold: '가늘게',
        align: 'left',
      },
    });

    render(<Content />);

    const textEl = screen.getByText(/태초에 하나님이/);
    expect(textEl).toBeInTheDocument();
    
    const displayPanel = textEl.parentElement;
    expect(displayPanel).toHaveStyle({ fontWeight: 'normal' });
  });
});