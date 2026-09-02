# Kingshill final visual audit notes

Date: 2026-08-25

## Live desktop evidence at 1280 x 1100

- Hero Lusion shell: x=58.875, width=1162.234px.
- About shell: x=25, width=1230px.
- Training shell: x=25, width=1230px.
- Testimonials shell: x=25, width=1230px.
- Footer shell: x=25, width=1230px.
- Therefore the non-Hero section shells still do not match the existing Lusion connector inner width.
- Hero canvas was mounted during the live audit.
- About Passage layer was mounted during the live audit.
- At the Footer viewport, the Passage canvas was display:none/visibility:hidden/opacity:0, consistent with stopping before Footer.
- Training lens visibility was previously gated off by `!inTraining`; source was repaired to keep the Passage canvas visible in Training. A fresh run should recheck the lens after the browser state stabilizes.
- Preloader entry was intermittent during synthetic audit gestures: one run reached Footer with `kh-is-loading=true`, another reached Footer with `kh-is-loading=false`; this indicates the entry transition should be retested with real browser wheel/touch input before final acceptance.
- At the Footer viewport, the Footer closing headline/description had readable normal flow and the directory block was a clear slate glass panel on a consistent near-black background. The particle KINGS HILL wordmark remained visible to the right.
- At the Testimonials viewport, the dominant quote and two supporting quotes were readable, but the section still reads as a conventional lead-plus-rail testimonial layout rather than the more distinctive editorial type-state concept.
- Running CSS animations sampled at the Footer included `kh-menu-wash`; the audit did not prove all JavaScript RAF loops were inactive offscreen.

## Source observations

- Homepage uses Geist variable fonts for the experience layer and Syne/DM Sans for the main homepage.
- Training active programme titles use a CSS variable `--programme-distance` and variable `font-variation-settings`.
- About anchor, section headings, large numerals, testimonial lead quote, and Footer closing line use scroll-state typography variables.
- `prefers-reduced-motion` rules remove selected motion only under the user’s explicit reduced-motion preference.
- The Lusion Hero contains a mobile breakpoint that changes scene sizing but does not replace the canvas with a static mobile fallback.
- Source includes several legacy/dead declarations for removed Training circular nodes and unused Training/Footer shader components; these are cleanup candidates but were not edited during the audit.

## Priority audit conclusions

P0: Align all non-Hero content shells to the measured Lusion shell formula instead of the current 1230px shell.

P0: Retest and harden the preloader entry transition so the cloud/loader overlay cannot remain active while the page scrolls behind it.

P1: Verify the repaired Passage lens visibly renders in Training after the preloader state is stable; do not change the About lens.

P1: Redesign Testimonials typography/layout from the current conventional lead-plus-rail structure into one dominant editorial quote with selectable supporting voices.

P1: Add a real mobile-viewport browser run and record responsive shell widths, text wrapping, WebGL canvas sizes, and touch-state behavior.

P2: Remove stale declarations for deleted Training circular nodes and unused shader components after visual behavior is accepted.

P2: Add direct runtime markers for WebGL/RAF activity so offscreen performance can be verified rather than inferred from CSS animation counts.

## Latest implementation evidence

After the audit checkpoint changes, a live 1280 x 1100 browser run confirmed all five content shells use x=58.875px and width=1162.234px, matching the Lusion Hero shell. A three-wheel preloader probe held scrollY at 0 with both root and body overflow hidden. After entry, the page reported `kh-experience-ready`, the Training section was in view, and the Passage canvas reported display:block, visibility:visible, opacity:1. The Lusion Hero canvas remained mounted.

The Testimonials selectors are now three accessible buttons with `aria-pressed` state; clicking the second choice changed the lead quote state in the live DOM. The Footer reports near-white `rgb(247,248,246)` with darker headline `rgb(6,20,38)` and the existing glass directory gradient/border intact. No role-alert runtime error was detected.

A live browser screenshot at Training showed the restored Passage lens as a visible light lens object beside the Training glass panel. The current implementation still has a dark Training section, which is the existing intended Training environment rather than an audit regression. The screenshot also showed the new editorial Testimonials heading beginning below Training.
