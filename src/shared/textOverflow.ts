// Estimate wrapping with full-width CJK characters and average Latin glyph widths.
export function mayOverflow(text: string, fontSize: number, width: number, height: number, spacing = 1.25, letterSpacing = 0) {
  const available = width * 72;
  const rows = text.split('\n').reduce((total, line) => {
    const points = Array.from(line).reduce((sum, char) =>
      sum + fontSize * (/[^\u0000-\u00ff]/u.test(char) ? 1 : 0.65) + letterSpacing, 0);
    return total + Math.max(1, Math.ceil(points / available));
  }, 0);
  return rows * fontSize * spacing > height * 72 ||
    text.split(/\s+/u).some(word => /^[\x21-\x7e]+$/.test(word) && word.length * (fontSize * 0.65 + letterSpacing) > available);
}
