# AGENTS.md — WorshipSlide / BibleSlide Repository

## Mission

This repository is the existing BibleSlide Electron application, evolving into **WorshipSlide v2.0.0**. The product is **one desktop application with two independent PowerPoint generators**:

1. **BibleSlide** — preserve the existing Bible verse slide generator and its UI/behavior.
2. **LyricsSlide** — add a separate song-lyrics slide generator inside the same application.

The home screen offers **성경 (BibleSlide)** and **찬양 (LyricsSlide)**. Each workflow independently exports its own editable `.pptx`. There is **no unified worship queue, mixed deck, live presentation controller, OBS integration, cloud backend, or separate LyricsSlide installer**.

## Priority order

1. No regression in existing BibleSlide functionality or UI.
2. Correct, readable PPTX output and faithful aspect ratios.
3. Simple workflow suitable for volunteer church operators.
4. Minimal, well-tested code changes and maintainability.
5. Visual consistency with the existing application.

If an instruction conflicts with these priorities, stop and explain the trade-off before changing existing behavior.

## Confirmed baseline (verify against current checkout)

At planning time, `package.json` reported Electron 37, React 19, TypeScript, PptxGenJS 3.12, electron-vite, Vitest, electron-builder, app version `1.3.1`. Existing relevant files included:

- `src/renderer/App.tsx` — renders existing `Header`, `Sidebar`, `Content`.
- `src/renderer/ui/` — existing BibleSlide interface; preserve as far as possible.
- `src/renderer/contexts/UserSettingsContext.tsx` — Bible-only settings.
- `src/renderer/hooks/usePPTGenerator.ts` — existing generation flow; inspect before edits.
- `src/main/utils/generatePPT.ts` — existing Bible PPT generator.
- `src/main/utils/parseVerse.ts` — Bible parsing; preserve semantics.
- `src/main/ipc/pptHandler.ts` — `generate-slide` IPC handler.
- `src/preload/index.ts` — renderer-to-main `contextBridge` API.
- `src/main/index.ts` — window creation and IPC registration.
- `src/main/services/updater.ts` — update behavior.

These are observations, **not permission to assume the checkout has not changed**. Read files before modifying them.

### Legacy aspect ratio warning

`generatePPT.ts` constructed `new PptxGenJS()` without explicitly setting a layout, and used fixed coordinates. **Do not assume existing BibleSlide PPTX is 16:9.** Measure a generated file's actual slide size and preserve its behavior until the user approves any migration. Add 16:9 and 24:9 modes without silently changing the legacy default.

## Immutable compatibility constraints

- Keep electron-builder `build.appId` exactly `com.kangdy25.bibleslide`.
- Keep GitHub publish destination `kangdy25/BibleSlide` unless explicitly authorized.
- Preserve existing Bible parsing, Bible versions, input conventions, typography settings, and PPT output semantics.
- Preserve existing UI layout and styling except for the smallest necessary navigation and aspect controls.
- Do not change auto-updater identity, signing behavior, installer identity, or release workflow without investigation and explicit approval.
- Do not overwrite user changes, rewrite history, force push, publish releases, or introduce unrelated refactors.
- Do not rename or move the existing repository as a prerequisite.

## Required UI architecture

- `HomePage`: two accessible options, BibleSlide and LyricsSlide, matching existing design language.
- `BiblePage`: reuse existing components; add only unobtrusive back-to-home navigation and approved output-format controls.
- `LyricsPage`: new interface for title, multiline lyrics, slide segments, preview, background, text style, ratio, and PPT export.
- Simple React state routing is preferred over a new routing dependency if sufficient.
- Bible and Lyrics states/settings must be separate. Do not force lyrics into `UserSettingsContext` or the Bible verse parser.
- Maintain usable layout in the current 1020×720 non-resizable window, unless a change is justified and approved.

## Slide specifications

| Mode | Slide size | Content |
| --- | --- | --- |
| Bible legacy | **Measure current behavior first** | Preserve original output |
| Bible 16:9 | 13.333333 × 7.5 in | Approved 16:9 Bible layout |
| Bible 24:9 | 20 × 7.5 in | Identical non-mirrored Scripture on left and right; dark/empty center |
| Lyrics 16:9 | 13.333333 × 7.5 in | Background full slide; large centered lyrics |
| Lyrics 24:9 | 20 × 7.5 in | Background full slide; lyrics centered within central 16:9 safe region |

For 24:9, the central 16:9 safe region spans approximately x=3.333333 to 16.666667 inches. This is the **lyrics safe region**, not the Bible text placement region. Bible's dark center gap is approximately 6.6 inches as an initial design target, subject to real-device testing. **Never mirror/reverse the Scripture text. Never duplicate lyrics into left and right panels.**

Use explicit PptxGenJS layout definitions. Centralize dimensions and coordinate calculations. Do not stretch a 16:9 slide to 24:9 or reuse legacy fixed-position decorations without recalculation. Keep text as editable PowerPoint text boxes. Preserve image aspect ratios with cover/crop and avoid text overflow/clipping.

## Lyrics workflow rules

- Paste complete lyrics into a multiline editor.
- Split into slides on one or more blank/whitespace-only lines. Normalize CRLF/LF; preserve single newlines within a slide.
- Let users edit each resulting slide and change order, add, or remove segments.
- Do not silently lose manual edits on reparsing; define clear source-of-truth state.
- Show overflow/legibility warnings rather than silently truncating or arbitrarily shrinking text.
- Allow song title, background image or solid color, font family/size/weight/color, alignment, and aspect ratio.
- Provide a per-slide preview reflecting the selected ratio and output layout.
- Output independent `.pptx` with editable text, correct slide order, safe filename, and proper cancellation/error feedback.
- Do not bundle third-party copyrighted lyrics or website photos without permission. Reference visual approach only: `https://kangdy25.tistory.com/182`, `https://kangdy25.tistory.com/181`.

## Electron and security rules

- Keep filesystem access, file dialogs, and PPT writing in Electron main; renderer communicates through narrowly scoped preload `contextBridge` APIs.
- Do not expose generic `ipcRenderer`, arbitrary filesystem access, shell execution, or unrestricted IPC channels to renderer.
- Validate IPC payloads at runtime, including lengths, types, file extensions, image format/size, and user-selected paths.
- Do not introduce remote content, analytics, telemetry, login, or network requirements.
- Do not weaken existing security or auto-update signature checks.
- Handle save cancellation as a normal outcome. Use predictable typed success/failure results.

## Coding discipline

- Prefer minimal diffs. Read call sites and tests before changing a function signature.
- Reuse existing UI and style primitives; avoid wholesale UI redesign or new component frameworks.
- Introduce shared helpers only for genuinely shared behavior (slide dimensions, safe filenames, image fit, result types).
- Keep Bible generation and Lyrics generation logically independent.
- Use TypeScript types for renderer/preload/main contracts and runtime validation at IPC boundaries.
- Do not install dependencies unless needed and justified. Respect existing package manager and lockfile.
- Do not modify unrelated code or run destructive commands on user files.
- Use Korean for UI strings and user-facing progress summaries; code names may remain English.
- Add concise comments for non-obvious coordinate formulas and compatibility constraints.

## Tests and verification

Before coding, run/inspect the current tests and capture a baseline. Use the project's actual scripts (e.g. `npm run test:run`, `npm run build` only after checking package manager and environment). If full packaging is unavailable, run the build stages possible and report limitations.

**Must test:**
- Existing Bible inputs, versions, settings, generated slide count, save/cancel/error flows, and unchanged legacy output.
- Navigation home ↔ Bible and home ↔ Lyrics; separate state/settings.
- Lyrics parser: LF, CRLF, blank lines, multiple blank lines, leading/trailing blanks, empty input, Unicode, repeated chorus.
- Lyrics segment editing/reordering/deletion/addition and exact export order.
- PPTX file dimensions by inspecting `ppt/presentation.xml` `p:sldSz` (or equivalent), slide count, text nodes, image relationships.
- Bible 24:9 duplicated left/right non-reversed text with center empty.
- Lyrics 24:9 centered text entirely within x=3.333333..16.666667, full-slide background, no left/right lyric copies.
- 16:9 lyrics, image cover without distortion, long-line overflow warning, invalid images, cancellation.
- PPT text remains editable (not flattened to images).
- Windows PowerPoint and real 5120×1920 LED/OBS cropping are **manual acceptance checks**; do not claim completion without actual access.
- Existing 1.3.1 → 2.0.0 installer/updater compatibility must be investigated before release.

## Phased workflow

0. **Audit**: inspect repository, `git status`, current AGENTS instructions, baseline tests, actual legacy slide dimensions, and compatibility risks. Report plan and blockers.
1. **Navigation**: add HomePage, BiblePage wrapper, LyricsPage shell; preserve Bible UI. Verify regression.
2. **Bible 24:9**: add explicit layout and mirrored-content placement (duplicated, not reversed). Verify legacy output unchanged.
3. **Lyrics**: parser, segment editor, preview, background/style, independent PPT generator and IPC. Verify outputs.
4. **QA/release readiness**: automated tests, manual validation checklist, branding/updater analysis; version bump/release only with approval.

At the end of each phase, report changed files, observed behavior, exact commands/results, remaining failures, risks, and next phase. Do not claim unrun tests passed. Stop for approval before changing legacy output defaults, release identity, or publishing.

## Definition of done

- Home offers two independent functions.
- Existing BibleSlide is recognizably the same UI and its prior workflows remain functional.
- Bible 24:9 places identical Scripture in both side panels and leaves the middle dark.
- Lyrics 16:9 and 24:9 generate readable, editable PPTX with customizable full-slide backgrounds and centered lyrics.
- Lyrics are correctly split and editable without unintended data loss.
- No mixed worship queue or extraneous features exist.
- Tests and build outcomes are documented; release compatibility risks are resolved or clearly marked pending.
