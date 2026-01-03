import { describe, it, expect } from 'vitest';
import { fetchVerses, parseInput } from './parseVerse';

describe('성경 구절 유틸리티 테스트', () => {
  describe('parseInput 함수 (단위 테스트)', () => {
    it('한글 약어 형식을 올바르게 파싱해야 한다', () => {
      const result = parseInput('창1:1');
      expect(result).toEqual({
        book: '창',
        fullName: '창세기',
        engName: 'Genesis',
        chapter: 1,
        startVerse: 1,
        endVerse: 1,
      });
    });

    it('범위 입력을 올바르게 객체로 변환해야 한다', () => {
      const result = parseInput('Genesis 1:1-3');
      expect(result).toMatchObject({
        startVerse: 1,
        endVerse: 3,
      });
    });

    it('대소문자와 공백이 섞인 입력도 파싱해야 한다', () => {
      const result = parseInput('  gEnEsIs 1:1  ');
      expect(result.book).toBe('창');
    });

    it('잘못된 형식이 들어오면 명확한 에러 메시지를 던져야 한다', () => {
      expect(() => parseInput('invalid-text')).toThrow(/잘못된 형식/);
    });

    it('잘못된 책의 이름이 들어오면 명확한 에러 메세지를 던져야 한다', () => {
      expect(() => parseInput('민숙이1:1')).toThrow(/찾을 수 없습니다./);
    });
  });

  describe('fetchVerses 함수 (단위 테스트)', () => {
    const DEFAULT_VERSION = '개역개정';

    it('단일 구절 조회 시 결과 배열의 길이는 1이어야 한다', () => {
      const result = fetchVerses('창1:1', DEFAULT_VERSION);
      expect(result).toHaveLength(1);
    });

    it('여러 절을 요청하면 요청한 개수만큼 반환해야 한다', () => {
      const result = fetchVerses('창1:1-3', DEFAULT_VERSION);
      expect(result).toHaveLength(3);
    });

    it('시작 절이 끝 절보다 큰 경우(예: 10-5) 에러를 던져야 한다', () => {
      expect(() => fetchVerses('창1:10-5', DEFAULT_VERSION)).toThrow(
        '시작 절(10)이 끝 절(5)보다 클 수 없습니다.'
      );
    });

    it('창세기 1장의 마지막 절을 올바르게 가져와야 한다', () => {
      const result = fetchVerses('창1:31', '개역개정');

      expect(result).toHaveLength(1);
      expect(result[0]).toContain('31');
      expect(result[0]).not.toContain('undefined');
    });

    it('성경 데이터에 없는 절을 요청하면 에러를 던져야 한다', () => {
      expect(() => fetchVerses('창1:32', DEFAULT_VERSION)).toThrow(/찾을 수 없습니다/);
    });

    it('존재하지 않는 버전 요청 시 에러가 발생해야 한다', () => {
      expect(() => fetchVerses('창1:1', '없는버전')).toThrow(/찾을 수 없습니다./);
    });
  });
});
