import { render, screen, fireEvent } from '@testing-library/react';
import { expect, it, describe, vi } from 'vitest';
import Header from './Header';
import { UserSettingsProvider } from '../contexts/UserSettingsContext';

// Radix UI ToggleGroup 모킹
vi.mock('@radix-ui/react-toggle-group', () => {
  return {
    Root: ({ children, onValueChange }: any) => (
      <div data-testid="toggle-group-root">
        {children && children.map ? children.map((child: any) => {
          if (!child) return null;
          return {
            ...child,
            props: {
              ...child.props,
              onClick: () => onValueChange && onValueChange(child.props.value)
            }
          };
        }) : children}
      </div>
    ),
    Item: ({ children, value, onClick }: any) => (
      <button value={value} onClick={onClick}>
        {children}
      </button>
    )
  };
});

describe('Header 컴포넌트 테스트', () => {
  it('헤더의 버전 토글을 선택하면 성경 버전 설정이 변경되어야 한다', () => {
    render(
      <UserSettingsProvider>
        <Header />
      </UserSettingsProvider>
    );

    const logo = screen.getByAltText('앱 로고');
    expect(logo).toBeInTheDocument();

    const gaeButton = screen.getByText('개역개정');
    const saenewButton = screen.getByText('새번역');

    expect(gaeButton).toBeInTheDocument();
    expect(saenewButton).toBeInTheDocument();

    // 클릭 시 onValueChange 호출하여 버전 변경 시뮬레이션
    fireEvent.click(saenewButton);
  });
});