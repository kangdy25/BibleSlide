export type SlideRatio = 'wide' | 'led';
export type BibleFormat = 'legacy' | SlideRatio;

export const slideLayouts = {
  wide: { width: 40 / 3, height: 7.5 },
  led: { width: 20, height: 7.5 },
};

export function lyricsBounds(ratio: SlideRatio) {
  const width = slideLayouts.wide.width - 1;
  return { x: (slideLayouts[ratio].width - width) / 2, y: 0.8, w: width, h: slideLayouts[ratio].height - 1.6 };
}

export function lyricsTitleBounds(ratio: SlideRatio, title: string) {
  const inset = 0.45;
  const w = slideLayouts[ratio].width - 2 * inset;
  // Reserve one em per character so long Korean titles fit on one line.
  const fontSize = Math.min(20, Math.floor(72 * w / Math.max(1, Array.from(title).length)));
  return { x: inset, y: 0.28, w, h: 0.44, fontSize };
}

export function biblePanels(ratio: SlideRatio) {
  if (ratio === 'wide') {
    return [{ x: 0.5, w: slideLayouts.wide.width - 1, bodyInsetLeft: 0.2, bodyInsetRight: 0.2 }];
  }

  // Split the 24:9 width into 9 parts of Scripture, 6 blank, and 9 of Scripture.
  const partWidth = slideLayouts.led.width / 24;
  const panelWidth = 9 * partWidth;
  return [
    { x: 0, w: panelWidth, bodyInsetLeft: 0.25, bodyInsetRight: 0.25 },
    { x: 15 * partWidth, w: panelWidth, bodyInsetLeft: 0.25, bodyInsetRight: 0.25 },
  ];
}
