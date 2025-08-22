import PptxGenJS from 'pptxgenjs';

/**
 * 주어진 데이터로 PPTX 객체를 생성합니다.
 * @param title - 슬라이드 상단 제목 텍스트
 * @param content - 슬라이드 중앙 본문 내용
 * @returns 생성된 PptxGenJS 객체
 */

export function generatePPT(title: string, content: string): PptxGenJS {
  // pptxgenjs 라이브러리 불러오기
  let pptx = new PptxGenJS();
  let slide = pptx.addSlide();

  // 배경 이미지 경로를 함수 외부에서 전달받는 것이 더 유연합니다.
  // 이 예제에서는 편의상 하드코딩된 경로를 사용합니다.

  // Mac OS 버전
  // slide.background = { path: '/Users/kangdy25/Programming/Web/BibleSlide/public/pptBg.png' };
  // Window 버전
  slide.background = { path: 'C:/Programming/Web/BibleSlide/public/pptBg.png' };

  // 투명한 검정색 사각형 추가
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: '100%',
    h: '100%',
    fill: { color: '000000', transparency: 60 },
  });

  // 상단 제목 추가 (외부에서 전달받은 title 사용)
  slide.addText(title, {
    x: 0,
    y: 0,
    w: '100%',
    h: 1,
    align: 'center',
    fontSize: 24,
    color: 'FFFFFF',
  });

  // 중앙 본문 내용 추가 (외부에서 전달받은 content 사용)
  slide.addText(content, {
    x: '7.5%',
    y: '15%',
    w: '85%',
    h: '70%',
    align: 'left',
    fontSize: 22,
    color: 'FFFFFF',
    bold: true,
    valign: 'top',
  });

  // 하단 출처 추가 (예제: '요한복음 6장'은 title에서 추출)
  const sourceText = title.split(' ')[0] + ' ' + title.split(' ')[1].split(':')[0] + '장';
  slide.addText(sourceText, {
    x: 0,
    y: '85%',
    w: '100%',
    h: 1,
    align: 'center',
    fontSize: 16,
    color: 'FFFFFF',
  });

  // L자 모양 테두리 추가
  const cornerLineStyle = { shape: pptx.ShapeType.line, line: { color: 'FFFFFF', width: 3 } };
  // 좌측 상단
  slide.addShape(pptx.ShapeType.line, { x: 0.5, y: 0.75, w: 0.5, h: 0, ...cornerLineStyle });
  slide.addShape(pptx.ShapeType.line, { x: 0.5, y: 0.75, w: 0, h: 0.5, ...cornerLineStyle });
  // 우측 상단 (위치와 크기 조정)
  slide.addShape(pptx.ShapeType.line, { x: 9.0, y: 0.75, w: 0.5, h: 0, ...cornerLineStyle });
  slide.addShape(pptx.ShapeType.line, { x: 9.5, y: 0.75, w: 0, h: 0.5, ...cornerLineStyle });
  // 좌측 하단 (위치와 크기 조정)
  slide.addShape(pptx.ShapeType.line, { x: 0.5, y: 5, w: 0.5, h: 0, ...cornerLineStyle });
  slide.addShape(pptx.ShapeType.line, { x: 0.5, y: 4.5, w: 0, h: 0.5, ...cornerLineStyle });
  // 우측 하단 (위치와 크기 조정)
  slide.addShape(pptx.ShapeType.line, { x: 9.0, y: 5, w: 0.5, h: 0, ...cornerLineStyle });
  slide.addShape(pptx.ShapeType.line, { x: 9.5, y: 4.5, w: 0, h: 0.5, ...cornerLineStyle });

  // 생성된 pptx 객체를 반환
  return pptx;
}
