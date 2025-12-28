import { render } from '@testing-library/react';
import { expect, it, describe } from 'vitest';
import App from './App';
import { UserSettingsProvider } from './contexts/UserSettingsContext';

describe('App Layout 테스트', () => {
  it('App 컴포넌트가 정상적으로 렌더링되어야 한다', () => {
    render(
      <UserSettingsProvider>
        <App />
      </UserSettingsProvider>
    );

    const container = document.querySelector('.container');
    expect(container).toBeInTheDocument();
  });

  it('주요 레이아웃 컴포넌트(Header, Sidebar, Content)가 렌더링되어야 한다', () => {
    render(
      <UserSettingsProvider>
        <App />
      </UserSettingsProvider>
    );

    const mainContent = document.querySelector('.mainContent');
    expect(mainContent).toBeInTheDocument();
  });
});
