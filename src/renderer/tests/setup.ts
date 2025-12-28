import '@testing-library/jest-dom';

// ResizeObserver가 없는 환경(JSDOM)을 위한 Mock 설정
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserverMock;
