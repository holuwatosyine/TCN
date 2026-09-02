# Kingshill WebGL Performance Audit

## Scope

This pass focused on the implementation-level performance of the homepage rather than adding another visual layer. The objective was to preserve the site’s WebGL-first ambition, keep the full native motion experience on modern phones, and remove avoidable work from render loops, post-processing, asset startup, and offscreen canvases.

## What changed

| Area | Implementation change | Result |
|---|---|---|
| Mobile motion | Removed the duplicate `HomeExperience` pointer RAF and moved its CSS pointer signals into the existing shared `ExperienceRuntime` frame. No ordinary viewport-width branch disables WebGL motion. | Mobile still receives pointer/touch-driven motion, scroll velocity, physics, shader movement, and cursor behavior. Only the user’s OS-level `prefers-reduced-motion` setting remains an accessibility override. |
| Hero R3F | Added IntersectionObserver-driven `frameloop="never"` while the Hero is offscreen. Kept the Lusion connector physics, click accent cycling, transmission material, lights, and environment. | The Hero does not continue simulating/rendering after it leaves the viewport. |
| Hero post-processing | Quality-tiered composer multisampling, transmission samples/resolution, environment resolution, and renderer DPR. | High quality retains the strongest treatment; medium/low quality reduce pixel and pass cost without switching off motion or the scene. |
| Traveling Passage | Quality-tiered FBO samples, transmission samples/resolution, environment resolution, and DPR. Kept the transparent FBO restoration invariant: the default framebuffer is explicitly reset with `gl.setClearColor("#000000", 0)`. | The lens remains scroll-linked and transparent while reducing expensive transmission/FBO work on constrained devices. |
| Training shader | Fixed its IntersectionObserver pause/resume lifecycle so an offscreen frame handle cannot block re-entry. | Training rendering stops offscreen and reliably resumes when visible. |
| Footer particle text | Reworked the RAF loop to stop completely when offscreen and restart on IntersectionObserver entry. | The footer closing text no longer schedules an idle frame every tick while it is not visible. |
| Subpage atmosphere | Added document-visibility and IntersectionObserver gating to the raw WebGL loop. | Background-tab and offscreen rendering now stop instead of consuming continuous CPU/GPU time. |
| Initial loading | Lazy-loaded the non-critical Training, Testimonials, Footer shader, Footer closing-text, and Footer wordmark modules behind Suspense. | The initial route can prioritize the preloader and Hero; lower-page shader modules are fetched when needed. |

## Runtime verification

The live homepage was inspected in Chromium rather than treating a successful build as visual proof. At a 1280×1100 viewport with DPR 1, the mounted loading state exposed 12 canvases, including the cloud/preloader, Hero, Passage, section shaders, and footer particle canvases. After the internal preloader gesture accumulator was allowed to reach readiness and seven viewport-length wheel gestures were dispatched, the loader was removed and the runtime exposed 11 canvases.

The cloud invariant was also checked after entry. The `.kh-cloud-prelude` element remained in the DOM only as a fixed, hidden preloader component with `display: none`, `position: fixed`, zero layout height, and `pointer-events: none`; the document scroll height remained 5263px rather than gaining a cloud corridor. This confirms that the cloud is not being added as normal homepage content.

The actual computed section values after entry were `rgb(1, 2, 7)` for Training and `rgb(5, 9, 13)` for the Footer, with the shader wrappers transparent above those bases. The Testimonial section computed to `rgb(255, 255, 255)`. These are runtime CSS values, not assumptions from source declarations.

The shader/react package owns its canvas lifecycle. Its DOM canvas nodes retained the browser’s default intrinsic attributes of 300×150 while their CSS boxes expanded to the section dimensions; I did not overwrite those attributes because the installed renderer manages its own initialization and visibility lifecycle. This should be rechecked with GPU timing or a pixel-density capture on the deployment target rather than “fixed” by an unsafe DOM mutation.

## Validation status

`npx tsc --noEmit` completed successfully. A clean production build also completed successfully in 22.24 seconds using a bounded Node heap to avoid the sandbox’s previous peak-memory termination. The homepage and the Lusion model asset served HTTP 200 from the preview server. Vite still reports two large shared application chunks, approximately 2.25 MB and 3.73 MB uncompressed after minification; the isolated Material Lab remains separately split at approximately 958 KB. The next bundle-level opportunity is route and dependency-level splitting of the shared Three/R3F core, not reducing the visual effects themselves.

## What was intentionally not changed

The mobile experience was not converted into a reduced-motion variant. There is no `max-width` rule that hides the Hero, Passage, Training shader, Footer shader, fluid pointer, or shader cursor. The Lusion connector mechanism was not replaced, the Passage was not made opaque, and the expensive visual identity was not flattened into static CSS.

## Remaining limitation

The browser screenshot transport was intermittent during this pass, so I am not claiming screenshot-level visual approval for the dark Training/Footer pixels. The runtime computed styles and canvas lifecycle were verified directly; a human visual pass on a stable browser session remains the correct final check for color, contrast, and perceived motion quality.

## Sequential-pass correction — 25 August 2026

The measured render-scale controller is now propagated to the preloader cloud, Hero/Passage/Training surfaces, package shader wrappers, Kage cloth, LiquidButton, Footer closing particles, Footer wordmark, and secondary-route atmosphere. Its input is a rolling frame-loop duration with hysteresis; it is not a GPU timer-query measurement and should not be represented as a thermal or GPU benchmark.

Pointer Events are now the primary touch path. Touch impulses are generated from `pointerType === "touch"`, and TouchEvent listeners remain only as a fallback for browsers without Pointer Events, removing the duplicate-input path identified in the earlier audit. The preloader uses the same explicit forward-only policy for wheel, touch drag, and keyboard entry.

The Kage cloth surface has an additional post-layout resynchronization because its image is lazy-loaded; a 300×150 value observed before the About image entered view is a lifecycle race signal, not an intentional mobile cap. The final check should observe it after the image is in view.

The testimonial CSS and shader wrapper now use an explicit pale mineral/light environment with dark readable type. Renderer consolidation remains intentionally staged: the package shader surfaces are wrapped consistently, but Footer closing text and wordmark remain separate raw renderers until a clean one-renderer composition can preserve their separate semantic fallback behavior.
