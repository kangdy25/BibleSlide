import puppeteer from "puppeteer";

export async function getVerseText(bookNum: number, chapter: string, verse: string): Promise<string> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // 갓피아 성경 URL 예시 (필요에 따라 수정하세요)
  const url = `https://www.godpia.com/read/reading.asp?BIBLE=${bookNum}&CHAPTER=${chapter}&VERSE=${verse}`;

  await page.goto(url, { waitUntil: "networkidle2" });

  // 크롤링할 성경 구절 텍스트 CSS 선택자 (실제 사이트 구조에 맞게 수정 필요)
  const verseText = await page.$eval(".bible_text", el => el.textContent?.trim() || "");

  await browser.close();
  return verseText;
}
