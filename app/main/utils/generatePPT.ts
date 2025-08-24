import PptxGenJS from 'pptxgenjs';

/**
 * 주어진 데이터로 PPTX 객체를 생성하거나 기존 PPTX에 슬라이드를 추가합니다.
 * @param title - 슬라이드 상단 제목 텍스트
 * @param content - 슬라이드 중앙 본문 내용
 * @param pptx - 기존 PptxGenJS 객체 (없으면 새로 생성)
 * @returns 생성 또는 수정된 PptxGenJS 객체
 */

export function generatePPT(title: string, content: string, pptx?: PptxGenJS): PptxGenJS {
  // 없으면 새 PPTX 객체 생성
  if (!pptx) pptx = new PptxGenJS();

  const slide = pptx.addSlide();

  // 배경색을 검정색(#000000)으로 지정
  slide.background = { fill: '000000' };

  // 투명한 검정색 사각형 추가
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: '100%',
    h: '100%',
    fill: { color: '000000', transparency: 60 },
  });

  // 상단 제목 추가
  slide.addText(title, {
    x: 0,
    y: 0,
    w: '100%',
    h: 1,
    align: 'center',
    fontSize: 24,
    color: 'FFFFFF',
  });

  // 중앙 본문 내용 추가
  slide.addText(content, {
    x: '7.5%',
    y: '22.5%',
    w: '85%',
    h: '70%',
    align: 'left',
    fontSize: 22,
    color: 'FFFFFF',
    bold: true,
    valign: 'top',
  });

  // 하단 출처 추가
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
  const cornerLineStyle = { shape: pptx.ShapeType.line, line: { color: 'FFFFFF', width: 5 } };
  // 좌측 상단
  slide.addShape(pptx.ShapeType.line, { x: 0.475, y: 1, w: 0.75, h: 0, ...cornerLineStyle });
  slide.addShape(pptx.ShapeType.line, { x: 0.5, y: 1, w: 0, h: 0.5, ...cornerLineStyle });
  // 우측 상단
  // slide.addShape(pptx.ShapeType.line, { x: 8.775, y: 0.75, w: 0.75, h: 0, ...cornerLineStyle });
  // slide.addShape(pptx.ShapeType.line, { x: 9.5, y: 0.75, w: 0, h: 0.5, ...cornerLineStyle });
  // // 좌측 하단
  // slide.addShape(pptx.ShapeType.line, { x: 0.475, y: 5, w: 0.75, h: 0, ...cornerLineStyle });
  // slide.addShape(pptx.ShapeType.line, { x: 0.5, y: 4.5, w: 0, h: 0.5, ...cornerLineStyle });
  // 우측 하단
  slide.addShape(pptx.ShapeType.line, { x: 8.775, y: 5, w: 0.75, h: 0, ...cornerLineStyle });
  slide.addShape(pptx.ShapeType.line, { x: 9.5, y: 4.5, w: 0, h: 0.5, ...cornerLineStyle });

  return pptx;
}
