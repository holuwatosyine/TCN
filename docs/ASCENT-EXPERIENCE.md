# Kingshill Ascent Experience

This document supersedes the older multi-canvas Kingshill WebGL audit/handoff notes. The current product is the editorial `coaching-nation` build evolved into one persistent spatial experience.

## North star

Kingshill is represented as a luminous topographic world. The metaphor is **discovery through ascent**, not hiking or outdoor adventure. Terrain, elevation, illumination and time-of-day are visual systems; visible copy remains institutional and editorial.

### Non-negotiable brand rules

- Navy `#07131f` is the night/world base.
- Gold `#c9a95d` is used as light, selected state, accreditation or data — never as general decoration.
- Bone/paper remains the principal editorial surface.
- Typography and content stay DOM-native for accessibility and sharp rendering.
- The world supports the content; it never obscures or gamifies it.
- Camera movement is authored and restrained. Pointer input moves illumination, not the camera.
- No neon/sci-fi treatment, excessive bloom, bouncing motion, free camera or decorative effect stacking.

## Mobile is the primary experience

There is no reduced mobile design and no static mobile poster. Phones receive the same terrain, contour illumination, atmospheric transition, route pulse and interactive programme world as desktop.

Performance adaptation may change internal cost only:

- render scale
- device pixel ratio cap
- terrain tessellation
- simulation/post-processing resolution when introduced

It must not remove the world or substitute a different visual system. Accessibility-driven `prefers-reduced-motion` remains respected.

## Runtime architecture

`ExperienceRuntime` owns the global pointer and scroll signals and mounts a single `AscentWorld` canvas. `AscentWorld` persists while React Router changes routes; route changes only change uniforms/world state.

The canvas renders:

1. Atmospheric sky / dawn field.
2. Displaced procedural terrain.
3. Contour isolines.
4. Lantern illumination from pointer/touch state.
5. Valley mist and sparse gold dust.
6. Route-transition isoline pulse.

DOM remains responsible for:

- headings and body copy
- navigation
- forms
- semantic images/video
- accessibility
- route content
- fine ruled grids and micro-labels

## Homepage progression

1. **Night / Hero** — terrain is the stage. The lantern reveals gold contours and the pressure heading responds independently but quietly.
2. **Discovery / About** — terrain visually flattens into paper; photography is revealed through contour language.
3. **Routes / Programmes** — programmes are trajectories through one topographic system. Hover previews, selection commits.
4. **Dawn / Voices** — interaction quiets down and typography dominates.
5. **Summit / Footer** — warm paper and architectural glass close the experience.

## Inner routes

All routes exist in the same world but use different material expressions:

- About: photograph / paper / warm mineral.
- Training: pathways / terraces / waypoints.
- Faculty: portrait-led editorial system; temporary topographic plates remain only until proper portraits exist.
- Resources: archive / index / paper cartography.
- Gallery: cinema / touch-native image rail / focused image view.
- Contact: geographic signal / location field / calm form.

## Performance contract

- One persistent WebGL2 context for the world.
- No WebGL context per button or footer decoration.
- Render loop fully stops while the document is hidden.
- Sustained frame time adapts render scale with hysteresis-like bounded steps.
- Mobile DPR is capped at 1.5; desktop at 1.75 in the first pass.
- Terrain density is selected from capability, not viewport width alone.
- All future GPU effects must reuse the persistent world unless isolation is technically necessary and justified.

## Donor repository policy

Donor repositories contribute capabilities, not aesthetics. Extract solvers, shaders, FBO patterns, materials, interaction math and quality-control techniques; discard demo styling, palettes, GUIs and scene concepts unless they belong naturally to Kingshill.

Primary donor candidates identified so far:

- `three-fluid-fx`: interaction field, distortion, reveal masks, later fluid typography.
- `webgpu-mesh-transmission-material`: rare signature optical objects only.
- `liquid-glass-carousel`: gallery inertia/focus/FBO techniques, not its demo look.
- `hologram-particles`: GPU compute/morphing techniques for restrained signal/mark transformations only.

## Known content ceiling

Faculty photography and some WhatsApp-origin media remain the largest non-code quality limitation. The implementation should art-direct them consistently now, but the final AAA pass requires properly directed, high-resolution portraits/photography.

## Visual pass — stages, trails and mobile-first lighting

The world is now **stage-driven**. Every `[data-world-stage]` element (home sections, each inner-route hero, the footer)
names a *look*; `AscentWorld` blends between the looks of the sections around the viewport's 55% line and eases the
result, so the hillside changes vantage point and hour as you scroll and glides on route change.

- **Looks** (`HOME_STAGES`, `ROUTE_LOOKS` in `AscentWorld.tsx`): camera height/pitch/distance, hour (`time`), trails,
  terraces, summit sun, sonar beacon, dim, contour density, relief flattening, resting lantern position and power.
- **Home:** `night` (hero) → `discovery` (paper About) → `routes` (high top-down map; the four programmes are gold trails
  with waypoints, the selected one lit) → `dawn` (voices) → `summit` (footer sunrise, rising dust).
- **Inner routes:** about = low dusk ridge, training = terraced slopes, faculty = calm/dim, resources = dense cartography,
  gallery = cinematic dim, contact = sonar beacon.
- **Touch first:** a finger moves the lantern and holds for ~1.4s, a tap sends a gold ripple through the terrain, and
  the lantern idles/drifts on its own. Nothing depends on hover.
- **Loader:** the count only reaches 100 once fonts are decoded and the world has drawn; the line then settles onto
  the horizon while the world is revealed, and hero copy waits for `kingshill:intro-start`.
- **Images:** `InteractiveImage` is DOM-only (graded photo + lantern highlight via `--mx/--my`). `kageCloth.ts` was
  removed, so the site now uses exactly one WebGL context.
- **Type:** Instrument Serif (`--kh-serif`) replaces Georgia; `Lexend Outline KH` is an overlap-free static instance used
  only for the outlined hero lines.
- **Performance:** one canvas, DPR capped at 1.5 on phones, adaptive render scale down to 0.5, mesh/dust tiers by
  device quality. WebGL2 is required (iOS 15+, Android Chrome 58+); the static poster remains only as a hard-failure
  safety net, not as a reduced mobile mode.
