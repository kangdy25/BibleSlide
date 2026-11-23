import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import App from './App';
import { UserSettingsProvider } from './contexts/UserSettingsContext';

it('성경과 찬양 화면을 오가도 성경 입력과 역본을 유지한다', () => {
  render(
    <UserSettingsProvider>
      <App />
    </UserSettingsProvider>
  );

  expect(screen.getByRole('heading', { name: 'WorshipSlide' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '성경 BibleSlide' }));
  const format = screen.getByRole('combobox', { name: '출력 형식' });
  expect(format).toHaveValue('wide');
  expect(screen.queryByRole('option', { name: '기존 형식' })).not.toBeInTheDocument();
  fireEvent.change(format, { target: { value: 'led' } });
  expect(format).toHaveValue('led');
  const input = screen.getByPlaceholderText('창1:1-3');
  fireEvent.change(input, { target: { value: '시23:1' } });
  fireEvent.click(screen.getByRole('radio', { name: 'KJV' }));

  fireEvent.click(screen.getByRole('button', { name: 'WorshipSlide 홈으로' }));
  fireEvent.click(screen.getByRole('button', { name: '찬양 LyricsSlide' }));
  expect(screen.getByRole('heading', { name: 'LyricsSlide' })).toBeInTheDocument();
  expect(screen.queryByPlaceholderText('창1:1-3')).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'WorshipSlide 홈으로' }));
  fireEvent.click(screen.getByRole('button', { name: '성경 BibleSlide' }));
  expect(screen.getByPlaceholderText('창1:1-3')).toHaveValue('시23:1');
  expect(screen.getByRole('radio', { name: 'KJV' })).toBeChecked();
});

it('전체 가사가 빈 줄로 나뉘고 각 미리보기에 같은 제목이 표시된다', () => {
  render(<UserSettingsProvider><App /></UserSettingsProvider>);
  fireEvent.click(screen.getByRole('button', { name: '찬양 LyricsSlide' }));
  fireEvent.change(screen.getByLabelText('제목'), { target: { value: '테스트 찬양' } });
  const lyrics = '첫 장\n\n둘째 장\n\n마지막 장';
  fireEvent.change(screen.getByLabelText('전체 가사'), { target: { value: lyrics } });
  const preview = within(screen.getByRole('region', { name: '선택한 슬라이드 미리보기' }));
  expect(preview.getByText('첫 장')).toBeInTheDocument();
  expect(preview.getByText('테스트 찬양')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '처음 미리보기' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: '다음 미리보기' }));
  expect(preview.getByText('둘째 장')).toBeInTheDocument();
  expect(preview.getByText('테스트 찬양')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '끝 미리보기' }));
  expect(preview.getByText('마지막 장')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '끝 미리보기' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: '처음 미리보기' }));
  expect(preview.getByText('첫 장')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'WorshipSlide 홈으로' }));
  fireEvent.click(screen.getByRole('button', { name: '찬양 LyricsSlide' }));
  expect(screen.getByLabelText('전체 가사')).toHaveValue(lyrics);
  expect(screen.queryByLabelText('선택한 슬라이드 가사')).not.toBeInTheDocument();
});

it('찬양 저장 완료는 화면 문구 대신 알림으로 표시한다', async () => {
  const generateLyrics = vi.fn().mockResolvedValue({ success: true, message: '찬양.pptx 저장을 완료했습니다.' });
  const showAlert = vi.fn().mockResolvedValue({ success: true });
  vi.stubGlobal('electronAPI', { generateLyrics, showAlert });

  try {
    render(<UserSettingsProvider><App /></UserSettingsProvider>);
    fireEvent.click(screen.getByRole('button', { name: '찬양 LyricsSlide' }));
    expect(screen.getByRole('slider', { name: '행간' })).toBeInTheDocument();
    expect(screen.queryByRole('slider', { name: '자간' })).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('제목'), { target: { value: '찬양' } });
    fireEvent.change(screen.getByLabelText('전체 가사'), { target: { value: '첫 줄\n둘째 줄' } });
    fireEvent.click(screen.getByRole('button', { name: 'PPT 저장' }));

    await waitFor(() => expect(showAlert).toHaveBeenCalledWith('PPT 저장이 완료되었습니다.', 'info'));
    expect(generateLyrics).toHaveBeenCalledWith(expect.objectContaining({
      font: '나눔바른고딕', lineHeight: 1.25, align: 'center', slides: ['첫 줄\n둘째 줄'],
    }));
    expect(screen.queryByText('찬양.pptx 저장을 완료했습니다.')).not.toBeInTheDocument();
  } finally {
    vi.unstubAllGlobals();
  }
});
