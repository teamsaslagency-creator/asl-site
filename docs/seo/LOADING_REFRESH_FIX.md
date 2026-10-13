# Restore the original ASL entrance on refresh

13 October 2026 (Asia/Colombo). The owner requested the original burgundy ASL
sign loading film on homepage refresh after seeing it disappear.

Before: an existing sessionStorage intro-seen flag dismissed the screen on refresh
without assigning or downloading the film. Reproduced in the live mobile browser.

After: a navigation timing entry of type `reload` explicitly replays the original
`/asl-loading-burgundy-refined.mp4`, regardless of the seen flag, homepage hash,
late hydration or reported slow connection. Ordinary navigation retains those
bypasses. Reduced-motion and save-data preferences still bypass playback.
The film, visual styles, skip button/Escape, autoplay-error handling, 12-second
safety timer, hydration safeguard, page transitions and all SEO content are preserved.

Validation: two new replay tests failed before the fix; all 20 tests passed after
it. TypeScript, production build and nine-route SEO regressions passed. At 390×844,
a real browser refresh with intro-seen=true produced a playing video and the
original burgundy ASL sign. Skip restored scrolling and a non-inert homepage.

An explicit refresh now incurs the film's loading/playback time by design. No new
Lighthouse or field performance result is claimed. Previous mobile performance
and real Formspree-delivery warnings remain documented in the release reports.
