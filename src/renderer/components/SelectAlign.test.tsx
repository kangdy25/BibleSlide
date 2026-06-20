import { render, screen, fireEvent } from '@testing-library/react';
import { expect, it, describe, vi } from 'vitest';
import SelectAlign from './SelectAlign';
import { UserSettingsProvider } from '../contexts/UserSettingsContext';

// Radix UI ToggleGroup 모킹하여 jsdom에서 제대로 작동하게 조치
vi.mock('@radix-ui/react-toggle-group', () => {
  return {
    Root: ({ children, onValueChange, value }: any) => (
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
    Item: ({ children, value, onClick, 'aria-label': ariaLabel }: any) => (
      <button value={value} onClick={onClick} aria-label={ariaLabel}>
        {children}
      </button>
    )
  };
});

describe('SelectAlign 컴포넌트 테스트', () => {
  it('정렬 옵션을 클릭하면 상태가 올바르게 업데이트되어야 한다', () => {
    render(
      <UserSettingsProvider>
        <SelectAlign />
      </UserSettingsProvider>
    );

    const label = screen.getByText(/텍스트 정렬:/);
    expect(label).toBeInTheDocument();

    const leftButton = screen.getByLabelText('왼쪽 정렬');
    const centerButton = screen.getByLabelText('가운데 정렬');
    const rightButton = screen.getByLabelText('오른쪽 정렬');

    expect(leftButton).toBeInTheDocument();
    expect(centerButton).toBeInTheDocument();
    expect(rightButton).toBeInTheDocument();

    fireEvent.click(centerButton);
    expect(screen.getByText('텍스트 정렬: Center')).toBeInTheDocument();

    fireEvent.click(rightButton);
    expect(screen.getByText('텍스트 정렬: Right')).toBeInTheDocument();

    fireEvent.click(leftButton);
    expect(screen.getByText('텍스트 정렬: Left')).toBeInTheDocument();
  });
});