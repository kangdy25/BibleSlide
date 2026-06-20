import { render, screen, fireEvent } from '@testing-library/react';
import { expect, it, describe, vi } from 'vitest';
import GeneratePPTButton from './GeneratePPTButton';
import usePPTGenerator from '../hooks/usePPTGenerator';

// usePPTGenerator 훅 모킹
vi.mock('../hooks/usePPTGenerator', () => ({
  default: vi.fn(),
}));

describe('GeneratePPTButton 컴포넌트 테스트', () => {
  it('일반 상태에서 버튼들이 올바르게 작동해야 한다', () => {
    const mockGeneratePPT = vi.fn();
    const mockCopyVerses = vi.fn();

    (usePPTGenerator as any).mockReturnValue({
      generatePPT: mockGeneratePPT,
      copyVerses: mockCopyVerses,
      isLoading: false,
    });

    render(<GeneratePPTButton />);

    const copyButton = screen.getByText('구절만 복사하기');
    const exportButton = screen.getByText('PPT 제작하기');

    expect(copyButton).toBeInTheDocument();
    expect(exportButton).toBeInTheDocument();

    expect(copyButton.closest('button')).not.toBeDisabled();
    expect(exportButton.closest('button')).not.toBeDisabled();

    fireEvent.click(copyButton);
    expect(mockCopyVerses).toHaveBeenCalled();

    fireEvent.click(exportButton);
    expect(mockGeneratePPT).toHaveBeenCalled();
  });

  it('로딩 중(isLoading: true)일 때 버튼들이 비활성화되고 텍스트가 변경되어야 한다', () => {
    (usePPTGenerator as any).mockReturnValue({
      generatePPT: vi.fn(),
      copyVerses: vi.fn(),
      isLoading: true,
    });

    render(<GeneratePPTButton />);

    const copyButton = screen.getByText('구절만 복사하기').closest('button');
    const exportButton = screen.getByText('생성 중...').closest('button');

    expect(copyButton).toBeDisabled();
    expect(exportButton).toBeDisabled();
  });
});