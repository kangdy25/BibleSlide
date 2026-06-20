import { render, screen, fireEvent } from '@testing-library/react';
import { expect, it, describe, vi } from 'vitest';
import TextSlider from './TextSlider';
import { UserSettingsProvider } from '../contexts/UserSettingsContext';

// Radix UI Slider 모킹
vi.mock('@radix-ui/react-slider', () => {
  return {
    Root: ({ children, onValueChange, value }: any) => (
      <div 
        data-testid="slider-root" 
        onClick={() => onValueChange && onValueChange([value[0] + 1])}
      >
        {children}
      </div>
    ),
    Track: ({ children }: any) => <div>{children}</div>,
    Range: () => <div></div>,
    Thumb: () => <div></div>,
  };
});

describe('TextSlider 컴포넌트 테스트', () => {
  it('텍스트 크기, 자간, 행간 슬라이더가 정상 동작하고 수치가 업데이트되어야 한다', () => {
    render(
      <UserSettingsProvider>
        <TextSlider />
      </UserSettingsProvider>
    );

    const labels = [
      screen.getByText(/텍스트 크기:/),
      screen.getByText(/자간:/),
      screen.getByText(/행간:/),
    ];

    expect(labels[0]).toBeInTheDocument();
    expect(labels[1]).toBeInTheDocument();
    expect(labels[2]).toBeInTheDocument();

    const sliders = screen.getAllByTestId('slider-root');
    expect(sliders).toHaveLength(3);

    // 슬라이더 클릭 시 값 증가 및 텍스트 변화 확인
    fireEvent.click(sliders[0]); // 텍스트 크기: 30 -> 31
    expect(screen.getByText(/텍스트 크기: 31px/)).toBeInTheDocument();

    fireEvent.click(sliders[1]); // 자간: 0 -> 1
    expect(screen.getByText(/자간: 1px/)).toBeInTheDocument();

    fireEvent.click(sliders[2]); // 행간: 1.25 -> 2.25
    expect(screen.getByText(/행간: 2.25/)).toBeInTheDocument();
  });
});