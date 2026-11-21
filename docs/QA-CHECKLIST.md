# Bilingual QA checklist (manual: needs a real browser)

Run once in **English (LTR)** and once in **Arabic (RTL)**, on a 1440px desktop, 768px tablet and 390px phone.
Switch language mid-flow at least once and confirm no data is lost.

| Area | Check |
|---|---|
| Language switch | Persists after reload; `<html lang dir>` updates; no flash of the wrong direction on reload |
| Landing | Nav, hero visual (arrow flips), sections, footer; no horizontal scroll at 390px |
| Upload | Drag/drop, browse, progress bar, remove, upload another; each error code shows a translated message |
| Profession | Cards wrap; "suggested" badge sits at the logical end; language cards |
| Processing | Steps, error + retry, "not configured" screen + sample data |
| Templates | Filters, desktop/mobile thumbs, preview dialog, use template |
| Editor | Panels swap sides in RTL; mobile tab bar; up/down/eye controls; Arabic typed in inputs; email/phone/URL fields stay LTR; undo/redo; reset dialog |
| Preview | Desktop/tablet/mobile widths; edits appear instantly |
| Export | ZIP opens offline (`index.html`); lang/dir correct; menu works at 390px; language toggle only with both versions; single HTML works |
| Typography | Arabic glyphs connect correctly; mixed Arabic + Latin sentence renders in the right order; line height comfortable |
| Overlap/overflow | No clipped or overlapping buttons, no text overflow in cards at 390px, in both languages |

All 12 templates × EN/AR are covered by an automated render test (`tests/templates.test.tsx`); layout and visual checks above are not automatable here.
