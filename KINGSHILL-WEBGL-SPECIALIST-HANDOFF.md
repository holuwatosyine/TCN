# Kingshill Coaching Academy — WebGL Specialist Handoff

## 1. Purpose of this document

This document describes the current Kingshill Coaching Academy web experience as an implementation system rather than as a visual pitch. It is intended for a WebGL specialist reviewing the project and should make clear what is rendered by React and CSS, what is rendered by raw Three.js or React Three Fiber, how motion signals travel through the application, which scenes are coupled to scroll or pointer input, and where the current architecture may still be improved.

The homepage is deliberately designed as a **WebGL-first editorial experience**. The HTML and CSS provide the semantic structure, typography, navigation, layout, accessibility labels, links, and responsive composition. WebGL supplies the atmosphere, depth, physical response, refractive surfaces, cloud passage, interactive image deformation, shader fields, button surfaces, cursor treatment, and particle typography. The project does not attempt to put all text inside a canvas; the main content remains real DOM text so it is readable, linkable, responsive, and accessible.

> The guiding separation is: **HTML owns meaning and navigation; WebGL owns depth, atmosphere, physical response, and visual continuity.**

## 2. Project and route architecture

The project is a Vite React application using TypeScript, React Router, Three.js, React Three Fiber, Drei, Rapier, `@react-three/postprocessing`, `maath`, and the local `shaders/react` package. The top-level application is defined in [`src/App.tsx`](src/App.tsx). It creates the query and tooltip providers, the toast systems, skip-link support, an error boundary, the browser router, and the global [`ExperienceRuntime`](src/experience/ExperienceRuntime.tsx).

The router lazy-loads the production pages. The principal routes are `/`, `/about`, `/training`, `/faculty`, `/resources`, `/gallery`, `/contact`, `/material-lab`, and the catch-all not-found page. The homepage is [`src/pages/Index.tsx`](src/pages/Index.tsx), which places the global [`Navigation`](src/components/Navigation.tsx) above `<main id="main-content">` and mounts [`HomeExperience`](src/components/HomeExperience.tsx).

| Route | Role in the project | WebGL behavior |
|---|---|---|
| `/` | Main Kingshill WebGL experience | Full preloader, cloud passage, Lusion Hero, traveling Passage lens, section shaders, interactive image, liquid CTA, and footer particle scenes. |
| `/about` | Editorial About route | Uses the global runtime and route decoration; receives the subpage atmosphere canvas and animated reveal/magnetic/reactive classes. |
| `/training` | Training route | Uses the global runtime and route atmosphere, with route-level content and shared interaction classes. |
| `/faculty`, `/resources`, `/gallery`, `/contact` | Supporting content routes | Lazy-loaded through the router and decorated by the shared runtime with route reveals, magnetic actions, reactive headings, and image tilt behavior. |
| `/material-lab` | Isolated material investigation route | A separate R3F laboratory for pmndrs-derived material and geometry studies. It is not part of the production homepage’s visual world. |

The homepage is a single composition in [`HomeExperience.tsx`](src/components/HomeExperience.tsx). It lazy-loads lower-priority effects so the preloader and Hero can begin sooner. The page mounts the cloud prelude, the fixed Passage lens, the Hero scene, About content, Training content and shader, Testimonials content and shader, and the Footer shader and particle scenes.

## 3. Global runtime: the system underneath every route

[`ExperienceRuntime.tsx`](src/experience/ExperienceRuntime.tsx) is the global motion orchestrator. It is mounted inside the router and therefore exists for every route. On normal motion settings it creates one Lenis instance with `smoothWheel`, `syncTouch`, a `lerp` of `0.075`, a wheel multiplier of `0.82`, a touch multiplier of `1.05`, and a touch synchronization lerp of `0.09`. Lenis reports scroll position, scroll limit, velocity, and direction into the shared experience state. If the user has enabled the operating system’s `prefers-reduced-motion` setting, Lenis is not created and native scrolling is used instead.

The runtime keeps one application-level `requestAnimationFrame` loop. Each frame it advances Lenis, ticks the smoothed pointer state, and writes the shared pointer variables onto the root element. It also writes homepage-specific variables so DOM typography and section surfaces can respond to the same signals used by WebGL.

| Shared CSS variable | Meaning | Typical consumers |
|---|---|---|
| `--kh-pointer-x`, `--kh-pointer-y` | Raw viewport pointer coordinates in pixels | Global cursor and route effects. |
| `--kh-pointer-nx`, `--kh-pointer-ny` | Smoothed normalized device-coordinate-like pointer values | Route motion and scene-adjacent CSS. |
| `--kh-pointer-speed` | Smoothed pointer energy | Cursor, text response, and interactive controls. |
| `--home-pointer-x`, `--home-pointer-y` | Smoothed homepage pointer coordinates | Hero caption, section headings, programme motion, testimonial typography, and Footer identity. |
| `--home-pointer-speed` | Smoothed homepage pointer velocity | Homepage depth and energy styling. |
| `--kh-scroll-progress` | Normalized document scroll progress | Route and global CSS motion. |
| `--kh-scroll-velocity` | Absolute scroll velocity normalized against a fixed scale | Section typography and shader energy. |
| `--page-progress` | Homepage progress written by `HomeExperience` | Page-level motion relationships. |
| `--section-progress` | Local progress for each `.kh2-section` and `.kh2-footer-zone` | Section-local title, row, quote, and Footer movement. |

The runtime also owns pointer semantics. A `pointermove` event updates the shared pointer state and checks the event target for links, buttons, `[data-cursor]`, `.kh-reactive-type`, `.kh-magnetic`, and `.kh-route-image`. The active target receives cursor mode, text displacement, magnetic displacement, or image tilt variables. Pointer down sets a shared pressed state; pointer up and pointer cancel clear it; pointer leave hides the cursor and clears active local transforms.

The pointer state itself is defined in [`src/experience/state.ts`](src/experience/state.ts). It stores client coordinates, normalized coordinates, smoothed coordinates, deltas, speed, smoothed speed, pressed state, active state, coarse-pointer status, and input type. `updatePointer()` normalizes the input against the current viewport, computes motion deltas and speed, and records whether the input type is mouse or another pointer. `tick()` performs exponential smoothing and decays instantaneous deltas and speed. This means the scenes do not directly consume noisy DOM pointer events; they consume a stable, shared, physically softer signal.

The same state object stores scroll current position, normalized progress, velocity, direction, and the separate `cloudProgress` used only by the preloader cloud walk. It also stores `entered`, the quality tier, the OS-level reduced-motion preference, and readiness keys for assets, cloud, water, and fluid cursor initialization.

## 4. Navigation and global CSS shell

[`Navigation.tsx`](src/components/Navigation.tsx) renders the official Kingshill logo asset, the wordmark, and the Menu trigger. It is positioned above the homepage Hero and is not placed inside the Lusion connector field. The menu is a DOM overlay with seven route entries: Home, About, Training, Faculty, Resources, Gallery, and Contact. It tracks the active item, responds to hover and focus, closes on Escape, and adds the `kh-menu-open` root class while open.

[`experience.css`](src/experience/experience.css) is the global runtime stylesheet. It handles the loading lock, fixed cursor layers, preloader controls, the cloud staging, subpage atmosphere positioning, route reveal classes, and the reduced-motion accessibility mode. The effective cloud rules intentionally force the cloud wrapper to be fixed, full viewport, non-interactive, and non-layout-affecting after entry. The file contains historical override blocks from earlier cloud-corridor experiments; the late `.kh-cloud-prelude--fixed` rules are the effective invariant and should be treated as the source of truth during cleanup.

The global CSS hides the browser scrollbar visually but does not remove scrolling. During loading, the document is locked with the `kh-is-loading` class. After the preloader completes, the class is removed and `kh-experience-ready` is added to the body. The cursor system remains CSS/WebGL-driven unless the operating system requests reduced motion.

## 5. Preloader: shader loader and internal entry gesture

The preloader is [`ExperiencePreloader.tsx`](src/experience/ExperiencePreloader.tsx). It is a full-screen DOM overlay with its own raw Three.js renderer and a fullscreen shader plane. It does not use the Hero renderer and it does not display a logo inside the cloud scene. Its loader shader draws a progress-track shape that transforms into the Kingshill mark as progress reaches completion. The shader has uniforms for aspect ratio, progress, and exit amount. The visual palette is navy, muted gold, and warm paper white.

The preloader begins by adding `kh-is-loading` to the root HTML element. It starts downloading a declared asset list with streaming progress where possible. The declared preload list includes the cloud texture, water normals, the Lusion connector GLB, the atmosphere audio, the Geist font files, the About and supporting images, and course imagery. Each asset contributes to a weighted progress estimate. The loading progress is capped below completion until the runtime reports the required readiness signals and the Lusion connector module has been imported.

The preloader waits for the `assets` readiness key, the `cloud`, `water`, and `fluid` runtime keys, the browser font promise, and the dynamic Lusion connector import. Once those dependencies are ready, the progress target reaches 1 and the UI changes from `Loading` to `Scroll to enter`.

The entry gesture is deliberately internal to the preloader. A captured wheel event prevents normal document scroll and adds the absolute wheel distance to `gestureProgress`. A captured touch move does the same using the difference between the previous and current touch Y positions. Arrow Down, Page Down, and Space each contribute one viewport equivalent. The target travel is `window.innerHeight * 6.5`, so the user walks through approximately six and a half viewport-lengths of internal gesture travel before the experience enters.

When `gestureProgress` reaches 1, `experienceState.entered` is set to true and a timed exit begins. The shader receives `uExit`, the loader overlay receives `--loader-exit`, and the overlay dissolves. Once the exit reaches 1, the loader removes its listeners, disposes its renderer, removes `kh-is-loading`, adds `kh-experience-ready`, and unmounts itself.

The rendered loader UI contains the small text brand, a status line, a numeric three-digit counter, and the Sound control. Audio is lazy-created only when the Sound button is used. It loads `/experience/audio/kingshill-atmosphere.mp3`, loops it, and uses a low volume of `0.14`.

## 6. CloudPrelude: the preloader-only cloud passage

[`CloudPrelude.tsx`](src/experience/CloudPrelude.tsx) is a separate raw Three.js scene. It belongs to the preloader lifecycle and must not become normal homepage content. It uses a transparent Three renderer, ACES filmic tone mapping, a slight exposure lift, transparent clear color, and fog. Its camera follows a Catmull–Rom curve through six points that run from a high cloud position into a deeper, lower corridor.

The cloud field is built from nine instanced plane-cloud clusters. Each cluster has a deterministic seed, world position, bounds, color, shadow color, volume, instance count, and fade interval. The instances receive offset, scale, color, opacity, phase, and fade attributes. The vertex shader applies time-based breathing, subtle stretch driven by energy, and soft per-instance motion. The fragment shader samples `/experience/cloud.png`, applies alpha shaping, respects per-cluster fade ranges, and multiplies the result by the dissolve amount.

The scene also creates a small additive spark field from 96 points. The spark field is intentionally secondary to the cloud volume. It rotates very slowly and fades with the same exit progress. The camera moves along the curve based on `experienceState.scroll.cloudProgress`, while smoothed pointer values add a small camera and look-at offset. The preloader gesture is therefore not a fake DOM progress bar: it physically advances the camera through the cloud corridor.

The cloud renderer uses an IntersectionObserver and `document.visibilityState` to stop its animation loop when it is not visible or when the browser tab is hidden. It marks the `cloud` readiness key after an asynchronous compile. The final exit hides the root and disposes the cloud geometries, texture, materials, renderer, and event listeners.

The most important lifecycle rule is that, after entry, the cloud wrapper is fixed and hidden. It has no document-flow height, no pointer events, and no ability to push the Hero downward. The cloud remains in the DOM only as a lifecycle object until the preloader unmounts it.

## 7. The Hero: original Lusion connector mechanism

The production Hero is [`LusionHero.tsx`](src/components/effects/LusionHero.tsx). It is based on the designated pmndrs/Lusion connector mechanism and is intentionally kept as the central visual field. The Hero is not replaced by a generic sphere, portal, blob, or morphing artifact.

The scene uses React Three Fiber and a Rapier physics world with zero gravity. It loads `/experience/models/c-transformed.glb`, whose connector geometry and base map are reused by the model instances. The scene creates a set of connector bodies with three perpendicular cuboid colliders. Each body receives linear and angular damping and is pulled toward the origin by a per-frame impulse proportional to the negative of its current translation. This produces the floating, colliding, self-organizing connector field.

A kinematic pointer body with a ball collider follows the shared smoothed pointer position, transformed through the R3F viewport. It interacts with the dynamic connector bodies and is the primary reason the field visibly reacts to pointer movement. Every standard connector model uses a `meshStandardMaterial` with the source map, controlled metalness, and roughness. Material colors are damped toward their target colors with `maath` easing rather than changed abruptly.

The connector field includes a sequence of neutral gray, white, and accent-colored pieces. The accent sequence cycles on canvas click through blue, green, red, and yellow values inherited from the mechanism. One additional connector body carries a `MeshTransmissionMaterial` with clearcoat, thickness, anisotropic blur, chromatic aberration, and quality-tiered samples and resolution. This gives the field one physically different refractive component without turning the entire Hero into a glossy generic blob.

Lighting consists of a low ambient light, a high-intensity spotlight, and a procedural Drei environment containing four circular Lightformers. The environment is what supplies the studio-like reflections and highlight structure. The camera is positioned at `[0, 0, 15]` with a narrow 17.5-degree field of view, near plane 1, and far plane 20.

The Hero uses `EffectComposer` with `N8AO`. Composer multisampling is quality-tiered: high quality uses four samples, while medium and low tiers avoid the extra multisampling cost. N8AO remains present across quality tiers. The R3F canvas uses adaptive DPR limits and `powerPreference: "high-performance"`.

The Hero layout is defined in [`LusionHero.css`](src/components/effects/LusionHero.css). The scene occupies its own central grid row with a dark inset panel. The eyebrow, caption, title, statement, buttons, and metadata occupy separate DOM rows. This is a structural constraint: **no text or CTA is rendered inside the connector field**. On desktop the Hero shell is a centered maximum-width composition; on narrow screens it collapses into a one-column flow and reduces the scene height, but it keeps the scene mounted and animated.

The Hero now observes its own visibility. When the Hero leaves the viewport, its R3F `frameloop` changes to `never`; when it re-enters, it returns to `always`. This pauses the physics and render loop without altering the connector mechanism.

## 8. Passage: the traveling lens between About, Training, and Testimonials

[`KingshillPassage.tsx`](src/components/effects/KingshillPassage.tsx) is a fixed, transparent React Three Fiber layer that travels through the About, Training, and Testimonials span. It is not the Hero artifact and it does not continue into the Footer. Its CSS contract is in [`KingshillPassage.css`](src/components/effects/KingshillPassage.css): the layer is fixed across the viewport, has `pointer-events: none`, uses normal blending, and keeps the canvas absolutely filling the viewport.

The Passage loads the About image and two supporting images, plus `/material-lab/lens-transformed.glb`. It creates a portal scene and a framebuffer object. Three image planes are rendered into the FBO with custom shader materials. The image shader applies a slight vertical displacement, RGB channel shift, zoom, opacity, and tint. The lens geometry then uses the FBO texture as the input to a `MeshTransmissionMaterial`.

The lens position is driven by four keyframes. Each keyframe contains normalized progress, X and Y position, scale, and X/Y rotation. A smoothstep interpolation selects the current position across the About-to-Testimonial range. The scene calculates its start and end from the actual DOM bounds of `#perspective`, `#programmes`, and `#contact .kh2-proof`, rather than from hard-coded document heights. This allows the lens to move with the actual layout.

The Passage responds to three shared inputs. Normalized scroll determines its travel progress. Scroll velocity controls a smoothed energy value that drives image shift and zoom. Pointer position adds a small position and rotation offset. The material tint transitions from a pale mineral tone through a subtle mint tint in Training and back toward a pale neutral tone near Testimonials.

The FBO is rendered before the lens. The code explicitly sets the render target, clears the target to a light neutral color, renders the portal scene, restores the default framebuffer, and then explicitly calls `gl.setClearColor("#000000", 0)`. This final reset is critical. Without it, the FBO clear color can leak into the default framebuffer and wash the page with an unintended opaque field.

The Passage renderer is quality-tiered. High quality uses the strongest FBO and transmission settings; medium and low reduce FBO samples, transmission samples, transmission resolution, environment resolution, and DPR. The lens remains scroll-linked and animated on mobile; only pixel workload changes.

## 9. About section: clean editorial content with a deformable image surface

The About section is the light, clean interval after the Hero. Its content remains HTML: a numbered section eyebrow, a photograph of a Kingshill facilitator, a caption, a lead statement, supporting copy, a Read our story link, and three principles: Peak Performance, Productivity, and Excellence.

The photograph uses [`InteractiveImage.tsx`](src/components/effects/InteractiveImage.tsx). The image is still rendered as a real `<img>` with an accessible alt description and lazy loading. When motion is available, the component creates a Kage cloth surface using [`kageCloth.ts`](src/components/effects/kageCloth.ts). Kage is a raw WebGL2 simulation with a 65×65 node grid. It rasterizes the image into an offscreen cover plate, uploads that plate as a texture, and deforms the surface through a CPU-side wave simulation whose vertex data is uploaded into WebGL buffers.

The Kage vertex shader receives grid coordinates, simulated depth, normal data, image offsets, bleed, and focal length. The fragment shader samples the image texture, computes a subtle directional light and specular term from the simulated normal, applies a rounded fabric distance field, and outputs the image with shaped alpha. Pointer movement over the wrapper drives a damped touch imprint. The cloth also has a low-amplitude continuous gust, so it is not only a hover-triggered effect.

The component uses a ResizeObserver to keep its canvas backing size aligned with the displayed box, an IntersectionObserver to start only when the image is in view, and explicit disposal for its buffers, texture, program, and shaders. Under OS-level reduced motion it does not create the cloth and the real image remains visible.

The DOM typography in About receives the shared section progress and pointer signals through the homepage CSS. The image and the Passage lens provide the WebGL layer; the section’s content remains legible and structurally independent.

## 10. Training section: dark shader field and selected pathway signal

The Training section is a dark interval with the heading “Our diplomas and programmes” and four real programme links. The programmes are represented in DOM so each one can route to `/training`, receive focus, and expose an accessible label. The active programme is stored in React state. Mouse enter and keyboard focus update the active index.

The four programmes are Life Coaching Certification, NLP Training Program, Corporate Coaching Program, and Transitional Youth Coaching Program. Each row contains a number, title, description, metadata, and arrow. The selected pathway panel shows the current number, title, description, and a View programme link.

The selected pathway visual is CSS-driven but intentionally treated as a live scene-adjacent object. It contains a central signal core, three inner elements, and an orbit with three points. Its rotation is controlled by the `--program-angle` variable derived from the active programme. Pointer and section-progress variables add additional transform and depth response. The current styling is a frosted, mineral-glass treatment rather than the earlier opaque green or blue card direction.

The section background is [`TrainingShaderBackground.tsx`](src/components/effects/TrainingShaderBackground.tsx). It is a raw Three.js fullscreen plane with a custom vertex shader and fragment shader. The fragment shader uses a four-stage near-black palette, time-based color-stage interpolation, a moving drift term, pointer position, scroll energy, a broad bloom-like field, a pointer touch field, and low-amplitude wave modulation. The current palette is intentionally graphite, ink, and deep mineral teal rather than bright blue.

The Training renderer uses an orthographic-style fullscreen camera and a `ShaderMaterial`. It caps DPR at 1.5 and uses the actual canvas client dimensions to set the renderer and shader resolution. Its IntersectionObserver pauses the render loop when the section is offscreen and restarts it on re-entry. The loop reads the absolute shared scroll velocity, smooths it into `uScroll`, and sends the shared pointer position into `uPointer`.

## 11. Testimonials: light shader field and client stories

The Testimonials section is the fourth numbered content interval and is intentionally client-focused rather than graduate- or alumni-focused. Its heading is “What changes after Kingshill.” It contains one lead testimonial and two compact supporting testimonial cards, followed by three factual statistics: 25+ Years of Excellence, 1,000+ People reached, and CCC Accredited.

The testimonial cards remain DOM articles with blockquotes, client names, roles, indices, and arrow marks. The lead card is visually larger; the other two form a supporting rail. A glass glaze layer sits inside the lead card and the cards receive pointer and section-progress-driven movement through CSS. The actual quotes are about Kingshill coaching, NLP training, and youth coaching outcomes.

The background is [`TestimonialShaderBackground.tsx`](src/components/effects/TestimonialShaderBackground.tsx), built with the local `shaders/react` package. Its stack is a light-gray Godrays base with white rays, FilmGrain at low strength, a near-white RGB Tritone, and a ZoomBlur pass. The intended result is a true light/white environment so the Testimonials interval breaks the darker Training field without becoming visually flat.

The shader package owns its own renderer, visibility observer, and animation lifecycle. The homepage supplies a class name and CSS box; the package creates the canvas and attaches its shader graph internally.

## 12. Footer: closing shader, semantic directory, and particle typography

The Footer is the closing sequence rather than a small conventional footer. It starts with a dark shader field from [`FooterShaderBackground.tsx`](src/components/effects/FooterShaderBackground.tsx). The current stack is a near-black Godrays background `#05090d`, muted mineral ray color `#6faea4`, low ray intensity, low FilmGrain, a dark RGB Tritone from `#03070b` through `#0a151b` to `#29514f`, and a restrained ZoomBlur. The shader is intentionally darker than the Hero and Training text is set to pale mineral/ivory values for contrast.

The Footer masthead contains “Kingshill / Lagos”, the closing statement “See further. Lead with purpose.”, a short academy description, and the particle wordmark. The semantic fallback closing heading remains in the DOM behind or alongside the particle canvas so the message is not dependent on a successful WebGL particle rasterization.

[`FooterClosingText.tsx`](src/components/effects/FooterClosingText.tsx) creates the closing statement as a particle field. It first uses a hidden 1600×440 2D canvas to rasterize the two lines of text with the Syne font. It samples the alpha channel at a quality-dependent step and builds a `THREE.BufferGeometry` containing the assembled position, a scatter position, and a seed per particle. The vertex shader interpolates from scatter to assembled text, adds cursor-pressure displacement, applies slow Z breathing, and adds a small scroll-velocity drift. The fragment shader renders soft circular points blended between mineral teal and ivory. The particle text responds to the shared pointer speed, pointer press state, local pointer position, and shared scroll velocity.

The particle text uses an IntersectionObserver that fully stops its requestAnimationFrame loop when offscreen and restarts it on re-entry. It also waits for `document.fonts.ready` before rasterizing, which prevents the particle geometry from being built from a fallback font too early.

[`FooterWordmarkScene.tsx`](src/components/effects/FooterWordmarkScene.tsx) performs a similar but smaller particle rasterization for “KINGS HILL”. It uses a hidden 1600×340 source canvas, samples the text into positions and scatter attributes, and renders soft mineral/ivory points. Its motion is slower and more compact than the closing statement. It is gated by IntersectionObserver and document visibility using R3F’s `setAnimationLoop`.

Below the masthead, the Footer has a semantic three-column directory. The first column links to the four programmes. The second contains the Lagos address, two phone numbers, and `pg@thecoachingnations.com`. The third contains the supplied Facebook, Instagram, and LinkedIn links. A final metadata line repeats the academy’s registration, accreditation, Lagos origin, and Life Transformation & Social Development statement.

## 13. Liquid CTA surface

[`LiquidButton.tsx`](src/components/effects/LiquidButton.tsx) is a small raw WebGL surface wrapped in a real React Router `<Link>`. It renders a fullscreen quad behind the button label. Its fragment shader combines navy, muted gold, and foam colors using procedural noise, a pointer-centered ripple, and a smoothed energy value. The energy comes from shared pointer speed and pointer pressed state.

The button canvas uses a capped DPR of 1.5 and a ResizeObserver. It also has an IntersectionObserver, although its current loop continues scheduling frames while offscreen and only skips the draw call. This is a small remaining optimization opportunity for the specialist: it can be converted to the same fully stopped/resumed loop pattern used by the Training and Footer particle canvases.

## 14. Global cursor shader

[`FluidPointer.tsx`](src/experience/FluidPointer.tsx) is the shared visual cursor layer. It marks the `fluid` readiness key on mount and otherwise renders a fixed `shaders/react` canvas. Its graph includes an invisible DotGrid driven by an invisible ChromaFlow source, two LinearGradient layers, and CursorRipples. The gradients use dark neutral tones and a black-to-white HSL mask driven by the trail dots. Cursor behavior is selected from DOM target semantics by the global runtime: default, interactive, liquid, text, image, or hidden.

This cursor layer is not disabled because the viewport is narrow or because the input is coarse. It is only omitted when the operating system has requested reduced motion. On a normal modern phone, the fixed shader cursor component remains mounted; touch and pointer events continue to update the shared state even though there is no traditional hover cursor.

## 15. Motion map: how input reaches the visuals

The project has one shared motion vocabulary rather than independent scroll implementations scattered across each section.

| Input | State signal | DOM consumers | WebGL consumers |
|---|---|---|---|
| Mouse or touch pointer position | `pointer.clientX/Y`, `ndcX/Y`, smoothed coordinates | Reactive typography, magnetic links, image tilt, selected pathway depth, Hero caption | Lusion pointer collider, Passage offset/rotation, Training shader pointer field, Kage cloth pointer imprint, cursor shader. |
| Pointer movement speed | `pointer.speed`, `smoothSpeed` | Text shadow and local energy styling | Hero color/material damping context, Training touch energy, liquid CTA ripple energy, Footer particle pressure, Passage image shift. |
| Pointer press | `pointer.pressed` | Pressed interaction styling | Liquid CTA energy, Footer particle energy, local cursor response. |
| Wheel or touch scroll | Lenis scroll event | Section progress, page progress, route reveals | Passage travel, Training shader drift, Footer closing particle drift, cloud preloader gesture before entry. |
| Scroll velocity | `scroll.velocity` | Scroll-depth typography and motion strength | Passage shift/zoom, Training `uScroll`, Footer closing text `uScroll`. |
| Scroll progress | `scroll.progress` | Section-local progress calculation | Route atmosphere and Passage range calculations. |
| Preloader gesture travel | `scroll.cloudProgress` | Loader state indirectly | Cloud camera position and cloud fade progress. |
| Browser visibility | `document.hidden` | None directly | Cloud, subpage atmosphere, and Footer wordmark pause. Shader package handles its own visibility. |
| OS reduced motion | `reducedMotion` | CSS disables non-essential motion and uses static fallbacks | Lenis is skipped; FluidPointer and Kage cloth are omitted; scene motion is reduced where explicitly handled. |

The homepage also calculates a local progress value for every `.kh2-section` and `.kh2-footer-zone`. This is independent of the global normalized document progress. It gives each section a normalized “how much of this section is passing through the viewport” value, allowing text and rows to move relative to their own section rather than all using one global scroll number.

## 16. Asset and loading model

The application uses a mixture of static imports, public-root assets, lazy route imports, and lazy lower-page effect imports. The official Kingshill logo is imported from the project assets. Large scene assets are served from public paths such as `/experience/models/c-transformed.glb`, `/material-lab/lens-transformed.glb`, `/experience/cloud.png`, `/experience/waternormals.jpg`, and the audio path.

The Hero GLB is preloaded by Drei with `useGLTF.preload`. The Passage lens GLB is likewise preloaded. The preloader separately fetches a weighted asset list so the user sees progress while the browser warms the asset cache. Lower-page WebGL modules are lazy-loaded through React Suspense. This means the Hero and preloader path are prioritized, while Training, Testimonials, Footer shader, Footer closing text, and Footer wordmark modules can arrive when the homepage composition needs them.

The About image uses native lazy loading and asynchronous decoding. The Passage image textures are loaded through Three’s `TextureLoader`. Footer particle scenes wait for browser fonts before generating their geometry, because their geometry is derived from a rasterized text mask.

## 17. Performance model and current quality tiers

`experienceState.quality` is inferred from `navigator.deviceMemory`, `navigator.hardwareConcurrency`, and viewport area. The tiers are `high`, `medium`, and `low`. The quality tier affects resolution and expensive buffer work; it is not a mobile reduced-motion switch.

| System | High | Medium | Low |
|---|---:|---:|---:|
| Hero R3F DPR ceiling | 1.5 | 1.25 | 1.1 |
| Hero transmission samples | 8 | 4 | 4 |
| Hero transmission resolution | 512 | 384 | 384 |
| Hero composer multisampling | 4 | 0 | 0 |
| Hero environment resolution | 256 | 128 | 128 |
| Passage canvas DPR ceiling | 1.5 | 1.25 | 1.1 |
| Passage FBO samples | 4 | 2 | 2 |
| Passage transmission samples | 10 | 6 | 4 |
| Passage transmission resolution | 768 | 512 | 384 |
| Passage environment resolution | 256 | 128 | 128 |
| Cloud DPR ceiling | 1.6 | 1.35 | 1.15 |
| Footer closing particle sample step | 4 | 5 | 7 |
| Footer wordmark particle sample step | 5 | 6 | 8 |

The optimization principle is to reduce the number of pixels, samples, and environment texels before removing motion. The physical simulation, pointer response, scroll coupling, and shader time evolution remain active on mobile unless the user has requested OS-level reduced motion.

Several render loops now pause completely when their canvas is out of view. The Lusion Hero changes the R3F frameloop to `never`. Training clears its frame handle when hidden and requests a new frame when it re-enters. Footer closing text does the same. The subpage atmosphere observes both viewport visibility and document visibility. The cloud uses Three’s animation loop with equivalent visibility and document checks. The `shaders/react` package owns its own IntersectionObserver and animation lifecycle.

The shared runtime pointer/Lenis loop remains global because it is the central source of state for all active scenes and DOM motion. The homepage-specific pointer RAF was removed so there is only one application-level state update loop rather than a second duplicate loop writing the same variables.

## 18. Mobile behavior

There is no ordinary `max-width` rule that hides the Lusion Hero, Passage, Training shader, Footer shader, fluid pointer, or shader cursor. Narrow screens change layout dimensions, text wrapping, scene height, content columns, and some decorative DOM details for legibility. They do not turn the homepage into a static version.

On touch devices, Lenis is configured with touch synchronization. Captured touch movement is used by the preloader before entry. After entry, pointer events update the shared state and the scenes respond to touch-derived coordinates and velocity. The pointer state records the input type as coarse/non-mouse, but that flag is not used as a reason to disable WebGL motion.

The current mobile strategy is therefore **full motion with adaptive workload**. The specialist should distinguish this from a true reduced-motion variant: mobile still gets animated cloud movement, Hero physics, Passage travel, Training shader time evolution, Footer particle motion, and interactive touch signals; only DPR, FBO samples, environment resolution, and similar GPU-heavy parameters are reduced on constrained tiers.

## 19. Accessibility behavior

The primary content is real DOM. Navigation uses actual links and buttons. The Hero canvas has an accessible role and label. Decorative canvases use `aria-hidden="true"`. The Footer particle text exposes an accessible canvas label and keeps a semantic fallback heading. The About photograph is a real image with alt text. The site has a skip link and a `main` landmark.

The only intentional motion reduction is tied to `prefers-reduced-motion: reduce`. In that mode, Lenis is skipped, the fluid cursor and Kage cloth are omitted, route reveals are shown immediately, reactive transforms are neutralized, and the cloud’s motion is constrained. This is separate from screen width and should remain separate unless the product direction explicitly changes.

## 20. Isolated Material Lab

`/material-lab` is a controlled R3F study route and should not be mistaken for the production Homepage scene. It compares pmndrs-derived material systems under shared camera and lighting controls. Its preset keys are `clear`, `frosted`, `resin`, `diamond`, and `bubbles`; its shape keys are `mineral`, `lens`, and `keystone`; its background modes are `ink` and `paper`; and its modes are `reference`, `morph`, and `world`.

The lab includes the glass flower GLB, Nike Air Zoom Pegasus GLB, D-flat diamond GLB, lens GLB, an aerodynamics HDR, and a blue studio HDR. It uses materials including `MeshTransmissionMaterial`, `MeshRefractionMaterial`, `MeshDistortMaterial`, caustics, cube-camera capture, accumulative shadows, bloom, vignette, contact shadows, and Drei controls. Its purpose is to test geometry/material combinations under controlled conditions before considering any production integration. The current production Hero remains the Lusion connector field; the lab does not replace it.

## 21. Current specialist review points

The architecture is now coherent enough for a WebGL specialist to review as a system, but there are several areas where expert feedback would be valuable.

First, the specialist should profile the Lusion R3F Hero with Rapier, MeshTransmissionMaterial, and N8AO together on representative modern phones. The current quality tiers reduce pixel and sample cost, but the combination of physics, transmission, shadows, environment lighting, and composer work remains the most likely Hero bottleneck.

Second, the specialist should profile the Passage lens at its actual on-device DPR. It performs an FBO render of three image planes followed by a transmission material. The transparent default framebuffer reset must be preserved. The important question is whether the lens needs to render at a lower internal scale than the main canvas while keeping its silhouette crisp.

Third, the specialist should verify the `shaders/react` canvas backing-size behavior on real hardware. In one Chromium runtime inspection, the package-owned canvas nodes reported browser-default intrinsic attributes of 300×150 while their CSS boxes expanded to section dimensions. The installed package owns its initialization and resize lifecycle, so the project deliberately did not mutate those attributes from outside. This should be checked with actual pixel output and GPU timing rather than inferred solely from DOM attributes.

Fourth, the LiquidButton loop can be converted from “skip draw while hidden but continue scheduling RAF” to a fully stopped/resumed loop. This is a small issue compared with the Hero and Passage but is an obvious consistency improvement.

Fifth, the raw Kage cloth simulation uses a 65×65 grid and performs a CPU simulation plus two dynamic buffer uploads per frame. Its visual result is valuable in About, but it should be profiled on a mid-range phone. The simulation has already been gated by IntersectionObserver and native image loading; the remaining question is whether the grid can be reduced by quality tier without visibly flattening the fabric response.

Sixth, the application still has large shared bundles containing Three/R3F dependencies. The lower-page effect modules are now split, but the next bundle improvement would be route- and dependency-level splitting of the common Three core. That is a delivery/startup concern rather than a reason to remove the visual effects.

## 22. File map for review

| File | What the specialist should inspect |
|---|---|
| [`src/App.tsx`](src/App.tsx) | Providers, router, lazy routes, and global runtime placement. |
| [`src/components/HomeExperience.tsx`](src/components/HomeExperience.tsx) | Homepage order, semantic content, lazy effect mounts, active programme state, local section progress. |
| [`src/components/HomeExperience.css`](src/components/HomeExperience.css) | Final homepage layout, compositing, section dimensions, typography motion, Training/Footer palette winners, and historical override cleanup opportunities. |
| [`src/experience/ExperienceRuntime.tsx`](src/experience/ExperienceRuntime.tsx) | Lenis, pointer normalization, shared RAF, CSS variables, cursor semantics, route decoration, and subpage atmosphere. |
| [`src/experience/state.ts`](src/experience/state.ts) | Shared pointer, scroll, quality, reduced-motion, and readiness state. |
| [`src/experience/ExperiencePreloader.tsx`](src/experience/ExperiencePreloader.tsx) | Asset progress, internal gesture accumulator, loader shader, audio, entry, and dissolve lifecycle. |
| [`src/experience/CloudPrelude.tsx`](src/experience/CloudPrelude.tsx) | Instanced cloud shader, Catmull–Rom camera path, cloud gesture progress, fog, dissolve, visibility, and disposal. |
| [`src/experience/FluidPointer.tsx`](src/experience/FluidPointer.tsx) | Global `shaders/react` cursor graph and reduced-motion condition. |
| [`src/components/effects/LusionHero.tsx`](src/components/effects/LusionHero.tsx) | Lusion connector geometry, Rapier bodies, pointer collider, transmission material, environment, N8AO, and Hero frameloop gating. |
| [`src/components/effects/KingshillPassage.tsx`](src/components/effects/KingshillPassage.tsx) | FBO portal scene, image shaders, lens keyframes, transmission, scroll coupling, and clear-state invariant. |
| [`src/components/effects/InteractiveImage.tsx`](src/components/effects/InteractiveImage.tsx) | Accessible image wrapper, lazy image, Kage cloth lifecycle. |
| [`src/components/effects/kageCloth.ts`](src/components/effects/kageCloth.ts) | WebGL2 fabric simulation, dynamic buffers, pointer imprint, and image surface shader. |
| [`src/components/effects/TrainingShaderBackground.tsx`](src/components/effects/TrainingShaderBackground.tsx) | Near-black Training shader, scroll energy, pointer field, DPR, and visibility pause/resume. |
| [`src/components/effects/TestimonialShaderBackground.tsx`](src/components/effects/TestimonialShaderBackground.tsx) | Light Godrays, FilmGrain, Tritone, and ZoomBlur stack. |
| [`src/components/effects/FooterShaderBackground.tsx`](src/components/effects/FooterShaderBackground.tsx) | Near-black Footer Godrays, FilmGrain, Tritone, and ZoomBlur stack. |
| [`src/components/effects/FooterClosingText.tsx`](src/components/effects/FooterClosingText.tsx) | Raster-to-particle text generation, cursor pressure, scroll drift, font readiness, and visibility-gated loop. |
| [`src/components/effects/FooterWordmarkScene.tsx`](src/components/effects/FooterWordmarkScene.tsx) | Particle wordmark generation, assembly, cursor interaction, and document/viewport gating. |
| [`src/components/effects/LiquidButton.tsx`](src/components/effects/LiquidButton.tsx) | Small raw WebGL CTA shader and remaining offscreen RAF opportunity. |
| [`src/components/effects/LusionHero.css`](src/components/effects/LusionHero.css) | Hero shell grid and structural separation of copy from connector field. |
| [`src/components/effects/KingshillPassage.css`](src/components/effects/KingshillPassage.css) | Fixed transparent Passage compositing contract. |
| [`src/experience/experience.css`](src/experience/experience.css) | Loader lock, cursor layers, cloud-only lifecycle, route atmosphere, and accessibility motion rules. |
| [`src/pages/MaterialLab.tsx`](src/pages/MaterialLab.tsx) | Isolated pmndrs material experiments, not production homepage composition. |

## 23. One-paragraph summary

Kingshill is a React/TypeScript editorial site whose semantic page is wrapped by a layered WebGL runtime. The user first encounters a raw Three.js loader shader while assets, fonts, runtime readiness, and the Lusion module prepare. After approximately 6.5 viewport-equivalents of captured wheel, touch, or keyboard gesture, the loader enters and dissolves; the cloud scene is disposed and never becomes homepage scroll content. The Hero then presents the original Lusion connector mechanism inside a React Three Fiber and Rapier world, with a kinematic pointer collider, physics-driven connector bodies, studio Lightformer environment, one refractive connector, and N8AO. Below it, a clean About section combines semantic editorial content with a Kage WebGL cloth image, while a fixed transparent Passage lens renders portal imagery into an FBO and travels from About through Training to Testimonials using real DOM bounds, scroll progress, pointer offset, and velocity energy. Training adds a dark raw shader field and an active pathway signal panel; Testimonials switches to a white shader field and client-focused DOM cards; Footer closes with a near-black Godrays field, semantic contact/programme/social directory, and two font-derived particle text scenes that respond to cursor pressure and scroll drift. A single global runtime normalizes pointer and scroll input, feeds CSS and WebGL consumers, handles route motion, and preserves full native WebGL motion on mobile by adapting resolution and sample cost rather than disabling the visual system.

## References

[1]: src/App.tsx "Application providers and route composition"
[2]: src/components/HomeExperience.tsx "Homepage composition"
[3]: src/experience/ExperienceRuntime.tsx "Global runtime orchestrator"
[4]: src/experience/state.ts "Shared experience state"
[5]: src/experience/ExperiencePreloader.tsx "Preloader state machine and loader shader"
[6]: src/experience/CloudPrelude.tsx "Preloader-only cloud passage"
[7]: src/components/effects/LusionHero.tsx "Lusion connector Hero scene"
[8]: src/components/effects/KingshillPassage.tsx "Traveling Passage lens"
[9]: src/components/effects/InteractiveImage.tsx "Interactive image wrapper"
[10]: src/components/effects/kageCloth.ts "Kage cloth WebGL simulation"
[11]: src/components/effects/TrainingShaderBackground.tsx "Training shader field"
[12]: src/components/effects/TestimonialShaderBackground.tsx "Testimonials shader field"
[13]: src/components/effects/FooterShaderBackground.tsx "Footer shader field"
[14]: src/components/effects/FooterClosingText.tsx "Footer closing particle typography"
[15]: src/components/effects/FooterWordmarkScene.tsx "Footer particle wordmark"
[16]: src/components/effects/LiquidButton.tsx "Liquid CTA shader"
[17]: src/experience/FluidPointer.tsx "Global shader cursor"
[18]: src/pages/MaterialLab.tsx "Isolated material laboratory"
