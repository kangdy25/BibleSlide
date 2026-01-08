import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generatePPT } from './generatePPT';
import PptxGenJS from 'pptxgenjs';

const mockAddSlide = vi.fn();
const mockSlideAddText = vi.fn();
const mockSlideAddShape = vi.fn();

// pptxgenjs 모듈을 모킹힌다.
vi.mock('pptxgenjs', () => {
  function MockPptxGenJS() {
    return {
      addSlide: mockAddSlide,
      ShapeType: {
        rect: 'rect', 
        line: 'line' 
      },
    };
  }

  return { default: MockPptxGenJS };
});

describe('generatePPT 함수 테스트', () => {
  let mockSlide: any;
  let mockPptxInstance: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // 슬라이드 객체 정의
    mockSlide = {
      background: { fill: '' },
      addShape: mockSlideAddShape,
      addText: mockSlideAddText,
    };

    // addSlide가 슬라이드 객체(mockSlide)를 반환하도록 설정
    mockAddSlide.mockReturnValue(mockSlide);
    mockSlideAddText.mockReturnValue(mockSlide);
    mockSlideAddShape.mockReturnValue(mockSlide);

    // 테스트 내에서 직접 인스턴스를 만들어서 쓸 경우를 대비
    mockPptxInstance = new PptxGenJS();
  });

  it('pptx 객체가 제공되지 않으면 새로운 PptxGenJS 인스턴스를 생성해야 한다', () => {
    generatePPT('제목', '부제목', '내용', 'left', 'Font', false, 10, 0, 1);
    
    expect(mockAddSlide).toHaveBeenCalled();
  });

  it('제공된 PptxGenJS 인스턴스를 사용해야 한다', () => {
    // 이미 생성된 인스턴스(mockPptxInstance)를 전달
    generatePPT('제목', '부제목', '내용', 'left', 'Font', false, 10, 0, 1, mockPptxInstance);
    
    // 전달한 인스턴스의 메서드가 호출되어야 함
    expect(mockAddSlide).toHaveBeenCalledTimes(1);
  });

  it('올바른 배경과 도형이 포함된 슬라이드를 추가해야 한다', () => {
    generatePPT('제목', '부제목', '내용', 'left', 'Font', false, 10, 0, 1, mockPptxInstance);

    // 배경 사각형 확인 (ShapeType.rect 사용 확인)
    expect(mockSlideAddShape).toHaveBeenCalledWith(
      // MockPptxGenJS.ShapeType.rect 값이 'rect'로 설정됨
      'rect', 
      // 두 번째 인자인 객체에 fill 속성 안에 color가 '000000'인 객체가 있는지 확인한다.
      expect.objectContaining({ 
        fill: expect.objectContaining({ color: '000000' }) 
      })
    );
  });

  it('텍스트 요소를 올바르게 추가해야 한다', () => {
    const title = '나의 제목';
    const subTitle = '나의 부제목';
    const content = '나의 내용';
    
    generatePPT(title, subTitle, content, 'center', 'Arial', true, 20, 0, 1.2, mockPptxInstance);

    // 제목 (상단)
    expect(mockSlideAddText).toHaveBeenCalledWith(
        title,
        expect.objectContaining({
            fontSize: 20,
            align: 'center'
        })
    );

    // 내용 (본문)
    expect(mockSlideAddText).toHaveBeenCalledWith(
        content,
        expect.objectContaining({
            x: '7.5%',
            fontFace: 'Arial',
            bold: true
        })
    );

    // 부제목 (하단)
    expect(mockSlideAddText).toHaveBeenCalledWith(
        subTitle,
        expect.objectContaining({
            y: '90%'
        })
    );
  });
});
