import PptxGenJS from "pptxgenjs";

export async function createPPT(title: string, content: string) {
  const pptx = new PptxGenJS();
  const slide = pptx.addSlide();

  slide.addText(title, { x: 0.5, y: 0.5, fontSize: 24, bold: true });
  slide.addText(content, { x: 0.5, y: 1.5, fontSize: 18, color: "363636", wrap: true });

  await pptx.writeFile({ fileName: `${title}.pptx` });
}
