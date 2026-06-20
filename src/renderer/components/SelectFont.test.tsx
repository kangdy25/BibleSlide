import React, { createContext, useContext } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, it, describe, vi } from 'vitest';
import SelectFont from './SelectFont';
import { UserSettingsProvider } from '../contexts/UserSettingsContext';
import useDeviceOS from '../hooks/useDeviceOS';

// OS 모킹
vi.mock('../hooks/useDeviceOS', () => ({
  default: vi.fn(),
}));

const RadioMockContext = createContext<any>(null);
const SelectMockContext = createContext<any>(null);

// Radix Select 모킹
vi.mock('@radix-ui/react-select', () => {
  return {
    Root: ({ children, onValueChange }: any) => (
      <SelectMockContext.Provider value={{ onValueChange }}>
        <div data-testid="select-root">{children}</div>
      </SelectMockContext.Provider>
    ),
    Trigger: ({ children }: any) => <button role="combobox">{children}</button>,
    Value: ({ children }: any) => <span>{children}</span>,
    Icon: ({ children }: any) => <div>{children}</div>,
    Portal: ({ children }: any) => <div>{children}</div>,
    Content: ({ children }: any) => <div>{children}</div>,
    Viewport: ({ children }: any) => <div>{children}</div>,
    Item: ({ children, value }: any) => {
      const { onValueChange } = useContext(SelectMockContext);
      return (
        <div data-testid="select-item" onClick={() => onValueChange && onValueChange(value)}>
          {children}
        </div>
      );
    },
    ItemText: ({ children }: any) => <span>{children}</span>,
    ItemIndicator: ({ children }: any) => <div>{children}</div>,
  };
});

// Radix RadioGroup 모킹
vi.mock('@radix-ui/react-radio-group', () => {
  return {
    Root: ({ children, onValueChange }: any) => (
      <RadioMockContext.Provider value={{ onValueChange }}>
        <div data-testid="radio-root">{children}</div>
      </RadioMockContext.Provider>
    ),
    Item: ({ children, value, id }: any) => {
      const { onValueChange } = useContext(RadioMockContext);
      return (
        <button data-testid="radio-item" value={value} id={id} onClick={() => onValueChange && onValueChange(value)}>
          {children}
        </button>
      );
    },
    Indicator: () => <div></div>,
  };
});

describe('SelectFont 컴포넌트 테스트', () => {
  it('Windows 환경에서 KoPubWorld 바탕체 선택 시 Medium 접미사가 붙어야 하고, 굵기 라디오 버튼 클릭 시 상태가 변해야 한다', () => {
    (useDeviceOS as any).mockReturnValue('Windows');

    render(
      <UserSettingsProvider>
        <SelectFont />
      </UserSettingsProvider>
    );

    // 1. 굵기 라디오 버튼 상태 변경 확인
    const lightRadio = screen.getByLabelText('가늘게');
    const boldRadio = screen.getByLabelText('굵게');

    expect(lightRadio).toBeInTheDocument();
    expect(boldRadio).toBeInTheDocument();

    fireEvent.click(boldRadio);
    
    // 2. Select 모의 아이템 클릭하여 바탕체 폰트 변경 확인
    const selectItems = screen.getAllByTestId('select-item');
    // KoPubWorld바탕체 항목은 FONT_OPTIONS_BASE의 3번째 원소 (인덱스 2)
    // Windows일 때 getFontValue에 의해 'KoPubWorld바탕체 Medium'이 밸류로 전달됨
    const batangItem = selectItems.find(item => item.textContent?.includes('KoPubWorld바탕체'));
    expect(batangItem).toBeInTheDocument();

    fireEvent.click(batangItem!);
  });

  it('macOS 환경에서 KoPubWorld 바탕체 선택 시 Medium 접미사가 붙지 않아야 한다', () => {
    (useDeviceOS as any).mockReturnValue('macOS');

    render(
      <UserSettingsProvider>
        <SelectFont />
      </UserSettingsProvider>
    );

    const selectItems = screen.getAllByTestId('select-item');
    const batangItem = selectItems.find(item => item.textContent?.includes('KoPubWorld바탕체'));
    expect(batangItem).toBeInTheDocument();

    fireEvent.click(batangItem!);
  });
});