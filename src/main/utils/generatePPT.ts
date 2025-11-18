import PptxGenJS from 'pptxgenjs';

// 주어진 데이터로 PPTX 객체를 생성하거나 기존 PPTX에 슬라이드를 추가합니다.

export function generatePPT(
  title: string,
  subTitle: string,
  content: string,
  align: 'left' | 'center' | 'right',
  font: string,
  fontWeight: boolean,
  textSize: number,
  letterSpacing: number,
  lineHeight: number,
  pptx?: PptxGenJS
): PptxGenJS {
  // 없으면 새 PPTX 객체 생성
  if (!pptx) pptx = new PptxGenJS();

  const slide = pptx.addSlide();

  slide.background = { fill: '000000' };

  // 투명한 검정색 사각형 추가
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: '100%',
    h: '100%',
    fill: { color: '000000', transparency: 50 },
  });

  // 상단 제목 추가
  slide.addText(title, {
    x: 0,
    y: 0.2,
    w: '100%',
    h: 0.5,
    align: 'center',
    fontFace: '나눔바른고딕',
    fontSize: 20,
    bold: true,
    color: 'FFFFFF',
  });

  // 중앙 본문 내용 추가
  slide.addText(content, {
    x: '7.5%',
    y: '17.5%',
    w: '85%',
    h: '75%',
    align: align,
    fontFace: font,
    fontSize: textSize,
    charSpacing: letterSpacing,
    lineSpacingMultiple: lineHeight,
    color: 'FFFFFF',
    bold: fontWeight,
    valign: 'top',
  });

  // 하단 출처 추가
  const sourceText = subTitle;
  slide.addText(sourceText, {
    x: 0,
    y: '90%',
    w: '100%',
    h: 0.5,
    align: 'center',
    fontFace: '나눔바른고딕',
    fontSize: 16,
    color: 'FFFFFF',
  });

  // L자 모양 테두리 추가
  const cornerLineStyle = { shape: pptx.ShapeType.line, line: { color: 'FFFFFF', width: 5 } };
  // 좌측 상단
  slide.addShape(pptx.ShapeType.line, { x: 0.465, y: 0.75, w: 0.75, h: 0, ...cornerLineStyle });
  slide.addShape(pptx.ShapeType.line, { x: 0.5, y: 0.75, w: 0, h: 0.5, ...cornerLineStyle });
  // 우측 하단
  slide.addShape(pptx.ShapeType.line, { x: 8.785, y: 5, w: 0.75, h: 0, ...cornerLineStyle });
  slide.addShape(pptx.ShapeType.line, { x: 9.5, y: 4.5, w: 0, h: 0.5, ...cornerLineStyle });

  return pptx;
}
