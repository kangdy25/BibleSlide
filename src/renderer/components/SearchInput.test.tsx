import { render, screen, fireEvent } from '@testing-library/react';
import { expect, it, describe } from 'vitest';
import SearchInput from './SearchInput';
import { UserSettingsProvider } from '../contexts/UserSettingsContext';

describe('SearchInput 컴포넌트 테스트', () => {
  it('입력값이 변경되면 setSettings가 호출되어 상태가 업데이트되어야 한다', () => {
    render(
      <UserSettingsProvider>
        <SearchInput />
      </UserSettingsProvider>
    );

    const inputElement = screen.getByPlaceholderText('창1:1-3') as HTMLInputElement;
    expect(inputElement).toBeInTheDocument();
    expect(inputElement.value).toBe('');

    fireEvent.change(inputElement, { target: { value: '창1:1' } });
    expect(inputElement.value).toBe('창1:1');
  });
});