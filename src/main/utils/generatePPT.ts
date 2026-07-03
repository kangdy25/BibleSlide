import PptxGenJS from 'pptxgenjs';
import { loadSlideConfig } from '../config/slideConfig';

export function generatePPT(
  title: string,
  subTitle: string,
  content: string,
  align: 'left' | 'center' | 'right',
  pptx?: PptxGenJS
): PptxGenJS {
  // ★ 설정 파일에서 모든 설정 가져오기
  const config = loadSlideConfig();

  if (!pptx) pptx = new PptxGenJS();

  const slide = pptx.addSlide();

  // 배경 이미지 추가 (설정에 따라)
  if (config.background.useImage && config.background.imagePath) {
    try {
      slide.background = { path: config.background.imagePath };
      console.log('✅ 배경 이미지 로드:', config.background.imagePath);
    } catch (error) {
      console.warn('⚠️ 배경 이미지 로드 실패:', error);
      slide.background = { fill: 'F5F5F5' };
    }
  } else {
    slide.background = { fill: 'F5F5F5' };
  }

  // 투명한 어두운 오버레이 추가
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: '100%',
    h: '100%',
    fill: { color: '000000', transparency: config.background.opacity * 100 },
  });

  // ★ 상단 제목 (설정에서 가져온 스타일 적용)
  slide.addText(`${title} ${subTitle}`, {
    x: 0,
    y: 0.3,
    w: '100%',
    h: 0.7,
    align: 'center',
    fontFace: config.title.fontFace,
    fontSize: config.title.fontSize,
    bold: config.title.bold,
    color: config.title.color,
  });

  // 구분선 (설정에서 가져온 스타일)
  slide.addShape(pptx.ShapeType.line, {
    x: '10%',
    y: 1.15,
    w: '80%',
    h: 0,
    line: {
      color: config.dividerLine.color,
      width: config.dividerLine.width,
      dashType: config.dividerLine.dashType as any,
    },
  });

  // ★ 중앙 본문 (설정에서 가져온 스타일)
  slide.addText(content, {
    x: '7.5%',
    y: '18%',
    w: '85%',
    h: '65%',
    align: align,
    fontFace: config.content.fontFace,
    fontSize: config.content.fontSize,
    color: config.content.color,
    bold: config.content.bold,
    lineSpacingMultiple: config.content.lineHeight,
    valign: 'top',
  });

  // ★ 하단 출처 (설정에서 가져온 스타일)
  slide.addText(subTitle, {
    x: 0,
    y: '88%',
    w: '100%',
    h: 0.5,
    align: 'center',
    fontFace: config.footer.fontFace,
    fontSize: config.footer.fontSize,
    color: config.footer.color,
  });

  return pptx;
}