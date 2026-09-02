# Kingshill WebGL Unification Task List

## Goal

Turn the current collection of strong WebGL subsystems into one authored visual organism while preserving the WebGL-first ambition, real DOM typography, physical interaction, full mobile motion, the Lusion physics mechanism, the Passage lens, Kage cloth, shaders, and particle typography.

The central creative direction is:

> **One visual narrative. One protagonist. One chapter director. One colour language. Multiple transformations.**

The proposed narrative is **Discovery → Focus → Perspective → Transformation → Clarity**.

## Reconciliation of the second specialist review

The second review is accepted as a refinement of this plan, not a replacement for it. It adds immediate verification tasks: confirm the actual post-initialization drawing resolution of the `shaders/react` canvases; inventory real renderer and context ownership; add context-loss/restoration diagnostics; confirm the Rapier WASM/SIMD build; profile worst-case overlapping load; replace static quality assumptions with measured frame-time adaptation; normalize preloader input by device type; inspect particle supersampling and fill-rate; and remove stale CSS overrides.

The review’s broad recommendation to replace the entire Lusion vocabulary is intentionally narrowed. The agreed Hero change is **three lightly altered coaching-related bodies**. They should retain the same general length, scale, physical weight, and field rhythm. The Lusion physics mechanism and the rest of the scene remain intact. The three bodies should read as subtle Kingshill abstractions rather than literal people or a completely new object collection.

The review’s suggestion to remove the cursor shader on touch devices is not adopted as a default because full native WebGL motion on mobile is a core requirement. Touch choreography will be improved, but any unmounting decision must be justified by profiling and replaced with an equivalent touch-energy treatment. One renderer remains the target architecture, but consolidation will be measured and staged rather than performed as a blind rewrite.

## Non-negotiable preservation contract

The following must remain intact unless a later decision explicitly changes the product direction:

| System | Must preserve |
|---|---|
| Semantic layer | Real DOM text, links, navigation, accessibility labels, responsive reflow, and semantic fallbacks. |
| Hero interaction | Rapier physics, zero-gravity body behavior, dynamic damping, pointer collider, self-organizing movement, camera framing, and the central Lusion-style physical interaction. |
| Hero composition | Navigation/logo above the scene; text and CTAs outside the connector field; no typography or buttons inserted inside the connector canvas. |
| Passage | Fixed transparent layer, FBO image sampling, scroll travel from About through Training to Testimonials, pointer response, and explicit transparent default-framebuffer reset. |
| Mobile | Mobile-first full native WebGL motion and touch response. Mobile is the primary delivery target, not a constrained or reduced variant. No mobile-width static mode, hidden scene, reduced choreography, or mobile-only visual downgrade is permitted. Any internal resolution or sampling adaptation must be validated as a performance improvement on the target phone while preserving the complete visible experience. |
| About | Clean editorial character, real image fallback, and the Kage deformation as a tactile enhancement rather than a replacement for meaning. |
| Footer | Dark closing atmosphere, semantic programme/contact/social directory, closing statement, and particle typography. |
| Accessibility | `prefers-reduced-motion` remains the only intentional global motion reduction condition. |

## Ordered implementation plan

### P0 — Establish the creative director and chapter vocabulary

Create a central visual director in or beside `ExperienceRuntime`. It should expose chapter progress and transition values instead of forcing every component to infer meaning independently from raw document scroll.

The initial chapter model should be:

| Chapter | Approximate semantic role | Primary state |
|---|---|---|
| `ENTRY` | Loader and atmospheric approach | Cloud corridor, unresolved optical presence, progress/gesture state. |
| `HERO` | Discovery | Physical connector field and first appearance of the optical protagonist. |
| `DISCOVERY` | About / human perspective | Protagonist becomes a focusing/revealing lens; image surface responds. |
| `PATHWAYS` | Training | Protagonist separates into directional pathways and focus states. |
| `PROOF` | Testimonials | Distortion reduces; the system becomes clearer and more legible. |
| `EPILOGUE` | Footer | Optical energy becomes particle matter and assembles closing typography. |

Acceptance criteria: every major WebGL system can receive chapter progress, chapter blend, protagonist energy, and grade values from one source. DOM section bounds remain the anchors, but visual meaning is no longer owned separately by each component.

### P0 — Verify renderer health before visual migration

Before consolidating renderers or changing the Hero asset, measure the live system. Count actual WebGL/WebGL2 contexts and map each context to its canvas and owning component. Record canvas backing dimensions after initialization, not only CSS dimensions. Add `webglcontextlost` and `webglcontextrestored` diagnostics to project-owned canvases. For `shaders/react`, inspect its internal drawing buffer and actual pixels before changing the package integration; its DOM attributes alone are not conclusive because the installed package owns its WebGPU resize lifecycle.

Confirm the deployed Rapier WASM path and whether SIMD is active in the built application. Profile Hero physics, React/Lenis main-thread work, and GPU rendering together on representative iPhone and Android devices. Profile the worst overlap window, especially Passage + Training + FluidPointer, rather than profiling each scene only in isolation.

Acceptance criteria: context ownership, context-loss behavior, shader drawing resolution, Rapier build mode, main-thread contention, and worst-case frame time are recorded.

### P1 — Define the persistent optical protagonist

Use the current refractive lens idea as the recurring visual protagonist. It does not have to be one literal mesh instance across every rendering context on the first implementation, but it must share a recognizable silhouette, palette, lighting logic, and motion language.

Required states:

1. In the Hero, the optical core is embedded in or visually related to the connector field.
2. In About, it reveals or deforms imagery.
3. In Training, it splits into pathways, focus planes, or refracted directions.
4. In Testimonials, its distortion calms and the visual field becomes clearer.
5. In the Footer, its energy disperses into the particles that build “See further. Lead with purpose.” and the Kingshill wordmark.

Acceptance criteria: a reviewer can describe the transition as one object changing state, not as a new effect appearing at every section.

### P2 — Re-author the Hero while preserving the Lusion mechanism

Begin with a hybrid geometry pass, not a full replacement. Preserve the current Rapier body setup, pointer collider, damping, camera, Lightformer environment, transmission material slot, and external DOM composition. Alter only **three bodies** with small, controlled silhouette changes. They may retain the same general length, scale, and visual weight as the current connectors so the field still reads as one coherent physical system.

The three altered bodies should be subtle coaching-related abstractions: one paired/dialogue form, one focus/aperture form, and one progression/step form. Do not introduce detailed human figures throughout the field, extra props, or a new particle system. The coaching reference should come from silhouette and relationship rather than literal faces or figurines.

Remove or control the arbitrary inherited accent cycling. The Hero palette should use a restrained Kingshill mineral system: neutral charcoal/graphite, ivory, pale mineral, deep teal, and one controlled accent. Click interaction may remain, but it should change a meaningful chapter/material state rather than cycle unrelated blue, green, red, and yellow colours.

Acceptance criteria: the Hero still physically behaves like the current Lusion mechanism, but its visual identity is visibly Kingshill-specific.

### P3 — Choose the coaching-related geometry language

Do not begin with detailed literal human characters. Small realistic people can become generic, visually noisy, difficult to light, and awkward when repeatedly colliding in a zero-gravity connector field. The better first direction is human-centered abstract geometry that reads as coaching without becoming an illustration of a person.

Recommended geometry families:

| Geometry family | Meaning | Implementation suitability |
|---|---|---|
| Paired dialogue forms | Coach and participant, exchange, listening, relationship | Strong. Two interlocking or facing forms can use the existing connector scale and colliders. |
| Focus aperture / lens token | Attention, perspective, clarity | Strong. Fits the current refractive protagonist and can reuse transmission. |
| Rising stepped forms | Growth, progression, development | Strong. Low-poly or bevelled modular pieces are stable under physics. |
| Open-hand or gesture abstraction | Guidance, support, invitation | Possible, but must be simplified so the silhouette remains robust at Hero scale. |
| Human bust or full figure | People and transformation | Possible as one or two hero tokens, not recommended for every body. Detailed figures risk looking like stock assets and may not collide believably. |
| K/H-derived architectural joint | Kingshill mark, structure, connection | Strong. Useful as a small number of signature bodies while preserving the field. |

The best initial design is a **modular coaching instrument**: connector-like structural bodies remain the physical language, while a small number of custom bodies represent dialogue, focus, growth, and the optical core. This communicates coaching through relationships and transformation rather than placing random human models into the scene.

### P4 — Make the Passage lens the continuation of the Hero core

The Hero’s refractive component and the Passage lens should share a common visual specification. At minimum they should share approximate silhouette, IOR family, roughness, chromatic-aberration restraint, highlight direction, and mineral tint.

The current Passage FBO architecture should remain initially. Its four keyframes and DOM-bound travel are useful. The work is to make the Hero’s refractive core appear to be the object that leaves the connector field and becomes the Passage lens, not merely another transmission material.

Acceptance criteria: the transition from Hero to About establishes a clear visual handoff, even if the first version uses two renderer contexts.

### P5 — Create the shared colour and exposure policy

Document and enforce one colour policy across raw Three.js, R3F, raw WebGL/WebGL2, the Passage FBO, and `shaders/react`.

The policy should explicitly define texture encoding, linear lighting, output conversion, tone mapping, exposure, alpha compositing, and the chapter grade. The first implementation should stabilize the pipeline before adding a LUT. The grade should be able to move from Hero light/mineral through Training near-black, Testimonials white, and Footer dark mineral without unexpected blue/gray washes.

Acceptance criteria: the specialist can inspect every renderer and identify how a texture or shader value becomes a final screen pixel.

### P6 — Introduce adaptive runtime quality

Treat mobile hardware as the primary performance target. Keep the current hardware heuristic only as an initial diagnostic, then add rolling frame-time observation on representative phones. The controller may adjust internal DPR, transmission samples, FBO scale, AO quality, environment resolution, shadow quality, and particle density only when measured frame time requires it, and every adjustment must preserve the complete visual choreography and interaction model.

The controller must have hysteresis so it does not oscillate quality every few frames. It should also avoid degrading quality during short scroll spikes unless the slow frame condition persists.

Acceptance criteria: the mobile target receives the full visual system and full motion; any internal workload adaptation is driven by measured sustained frame time rather than screen width; quality can recover when thermal/GPU load improves; and the watchdog is tested against combined Hero/Passage/Training/FluidPointer load, not only isolated scenes.

### P7 — Consolidate renderer ownership selectively

Treat one primary production renderer as the target architecture, but migrate in measured stages rather than rewriting blindly.

Recommended order:

1. Measure actual WebGL context ownership, GPU timing, memory pressure, and context-loss behavior.
2. Consolidate the two Footer particle scenes into one particle renderer.
3. Replace the separate fullscreen Training, Testimonials, and Footer shader backgrounds with one chapter-driven environment renderer if the visual result remains strong.
4. Investigate moving the Passage scene into the primary R3F renderer while preserving its FBO portal render.
5. Decide whether Kage cloth should remain a separate WebGL2 surface based on profiling.
6. Keep a disposable pre-entry renderer for the loader/cloud only if sharing it with the production renderer would make lifecycle behavior less reliable.

Acceptance criteria: renderer count is intentional and documented; visual quality is preserved; context limits are not being approached accidentally.

### P8 — Author mobile touch choreography

Build and test the homepage mobile-first. Keep every WebGL scene, material state, physical response, and motion system active on phones. Make touch input semantically different from desktop hover by adding transient touch impulses, swipe velocity, inertial energy, tap focus, and scroll-direction response. Avoid presenting a permanent cursor metaphor on a phone where no cursor exists, but do not remove the underlying visual system or reduce scene ambition.

Acceptance criteria: a phone user receives the same visual ambition but the interaction feels designed for touch rather than like a desktop pointer being simulated. The global cursor shader is not removed solely because the pointer is coarse; any change must be justified by a measured mobile cost and must preserve a touch-energy equivalent.

### P9 — Normalize and re-author the preloader entry

Keep the distinctive cloud journey, but normalize progress by input device. Mouse wheel, trackpad, and touch drag produce different delta distributions, so the gesture accumulator should not use one unexamined scale for all inputs. Define backward-scroll behavior explicitly. If weighted loading reaches 100% before runtime gates are complete, change the UI state to `Finalizing` rather than leaving an apparently stuck percentage.

Acceptance criteria: input pacing is consistent across mouse, trackpad, and touch, backward input is defined, and the UI never appears stuck at 99–100%.

### P10 — Rework the preloader into meaningful beats

Test a shorter or more authored entry journey. The preferred direction is three visual cloud beats rather than six and a half raw viewport-equivalents. The cloud can still use the existing camera curve, instanced clusters, fog, sparks, and dissolve, but gesture progress should trigger meaningful compositional changes.

Acceptance criteria: the preloader still feels like a deliberate passage, but it does not feel like an access barrier. The cloud remains preloader-only and never adds homepage layout height.

### P11 — Profile, validate, and visually review

Profile representative hardware rather than relying only on desktop Chromium. Test the Hero, Passage, Kage cloth, shader package, Footer particles, and combined page state. Record frame time, GPU time where available, canvas backing resolution, active contexts, texture memory, and behavior after extended use.

Then perform the visual review on a stable browser session. Runtime CSS values and successful builds are not substitutes for screenshot or human confirmation of colour, contrast, transitions, and perceived continuity.

## Connector geometry feasibility

### What can be kept exactly

The current connector GLB is a single Draco-compressed glTF asset generated by glTF-Transform. Its JSON metadata contains one node named `connector`, one mesh named `connector`, one triangle primitive, one base material, position/normal/UV attributes, and a WebP base-color texture. The loaded geometry is reused by every standard connector model through `nodes.connector.geometry`.

The following can remain exactly as they are while the visible geometry changes:

- the `Canvas` and R3F scene structure;
- the Rapier `Physics` world and zero-gravity setting;
- the kinematic pointer body and ball collider;
- dynamic `RigidBody` instances;
- per-body impulse toward the origin;
- linear and angular damping;
- the three perpendicular cuboid colliders;
- the camera and Hero layout contract;
- the spotlight, ambient light, Lightformer environment, and exposure direction;
- the `MeshStandardMaterial` and `MeshTransmissionMaterial` roles;
- the N8AO post-processing pass;
- the shared pointer state and Hero visibility gating;
- DOM text and CTA placement outside the field.

### What cannot remain literally unchanged

If the silhouette changes substantially, the current hard-coded cuboid colliders may no longer fit the object. The physics mechanism can remain unchanged, but collider dimensions and positions may need to be tuned per geometry family. A detailed human figure would require a different collider approximation or a capsule/compound collider set to avoid unnatural collisions.

The original single-node GLB can also be replaced only if the loader contract is updated. The easiest safe contract is to export every replacement model with a mesh/node named `connector`, with position, normal, and UV attributes. If a replacement asset has different node names or multiple materials, `GLTFResult` and the material assignment code must be updated accordingly.

The current connector is approximately 8,364 vertices and 36,756 index values according to its glTF accessors, and it is Draco-compressed. Replacement bodies should stay within a similar or deliberately budgeted range. A collection of detailed human models in every body would increase vertex, material, texture, and collision cost unnecessarily.

### Safest implementation options

| Option | What changes | What remains | Risk |
|---|---|---|---|
| A. Hybrid tokens | Keep most connector bodies; replace two or three with coaching-specific dialogue/focus/growth forms. | Almost all current scene mechanics and visual rhythm. | Lowest. Recommended first experiment. |
| B. Same mesh contract | Replace `c-transformed.glb` with a Kingshill-specific asset that exports a node named `connector`. | Scene code, physics, material roles, and interaction. | Medium. Collider fit and silhouette quality must be validated. |
| C. Multiple mesh families | Add a `model` or `geometry` selection to `Connector` and load several custom tokens. | Physics architecture, pointer behavior, environment, camera, post stack. | Medium-high. More assets and material coordination. |
| D. Full custom field | Replace all visible connector geometry with a new coaching instrument. | Physics concept, pointer collider, camera, lights, and post-processing. | Highest. This no longer keeps every visual element and should follow visual approval of A or C. |

### Recommended first geometry pass

Start with Option A. Keep the field’s recognizable physical rhythm, retain most original connector pieces, and add three custom Kingshill tokens: a paired dialogue form, a refractive focus aperture, and a rising progression form. Place the refractive focus aperture in the role currently occupied by the differentiated transmission connector. Use the same `Connector` component and Rapier body for each token so the physics, pointer response, and damping remain identical.

The new tokens should be simple, low-to-mid-poly, UV-mapped, and physically readable at the Hero camera distance. They should not carry tiny facial features, text fragments, decorative particles, or extra linework. The coaching meaning should come from silhouette, relationship, movement, and transition into the Passage lens.

### P10 — Clean CSS and verify particle output

Remove obsolete duplicate override blocks in `experience.css` and consolidate the effective cloud lifecycle rules before further specialist edits. Inspect actual Footer particle point counts, the relationship between the hidden raster source and displayed particle canvas, supersampling quality, and alpha-blended fill-rate at the lowest tier. Keep the semantic Footer fallback available if the particle renderer is unavailable.

Acceptance criteria: the cloud has one obvious CSS lifecycle source of truth, particle text remains crisp at rest, and the lowest tier carries no unnecessary point density.

## Definition of success

The task is complete when the specialist can scroll through the homepage and describe one continuous system: the atmosphere opens toward a physical optical core; the core is discovered inside the connector field; it becomes a lens that reveals human context; it separates into training pathways; it becomes clearer through client proof; and finally its energy becomes the particle typography of the closing Footer. The page must remain semantic, accessible, responsive, and fully animated on mobile.

## Implementation status after the sequential pass — 25 August 2026

| Gate | Current status | Evidence or limitation |
|---|---|---|
| Chapter director and protagonist continuity | Implemented as an initial shared chapter state consumed by Passage, Training, Footer particles, and the homepage runtime. | This is a shared-state foundation; it is not yet one unified render graph. |
| Lusion Hero preservation and three altered bodies | Implemented. | `dialogue`, `focus`, and `progression` remain normal Rapier Connector bodies with the original zero-gravity field, pointer collider, damping, camera, lighting, post-processing, and external DOM copy contract. |
| Passage travel and copy safety | Implemented with DOM-bound travel, transparent compositing, FBO sampling, and content-aware safe placement/occlusion. | A mobile testimonial midpoint was inspected in actual pixels; the earlier lens-over-quote defect was isolated to the Passage canvas. Physical-device review remains required. |
| Testimonials environment | Corrected to an explicit pale mineral/light surface with dark readable type and matching shader wrapper. | Final browser screenshot review should still be repeated on a stable physical target. |
| Preloader | Implemented three authored cloud beats, six-and-a-half viewport-equivalents of internal forward travel, `Finalizing` status, and explicit forward-only backward behavior. | The cloud remains preloader-only and does not add homepage layout height. |
| Touch choreography | Implemented pointer-primary touch impulses with TouchEvent fallback only when Pointer Events are unavailable. | No duplicate PointerEvent + TouchEvent energy path remains in the runtime source. |
| Measured quality adaptation | Implemented a basic rolling frame-time controller with hysteresis and render-scale propagation to active surfaces. | The measurement is main-thread/frame-loop work, not GPU timer-query time; physical GPU/thermal profiling is still a launch gate. |
| Particle audit | Source raster is 1600×440 with quality sampling steps 4/5/7; a local raster audit produced approximately 11,279 / 7,065 / 3,591 candidate points. | Counts are font-dependent and the browser’s loaded Syne raster remains the final visual authority. |
| Renderer consolidation | Deliberately staged, not falsely marked complete. | ShaderSurface consolidation and lifecycle gates are in place; Footer particle scenes remain separate renderers because a blind rewrite risks accessibility and visual regressions. |
| Rapier SIMD | Not claimed. | The recovered application uses standard `@dimforge/rapier3d-compat` WASM; no verified SIMD-specific build was found. |
| Physical mobile profiling | Open. | Headless Chromium mobile emulation validates mounting and responsive composition only; iPhone/Android GPU, context pressure, thermal behavior, and human visual approval remain required. |

The remaining launch-critical review is therefore physical-device profiling and stable-browser human approval, not another unverified renderer rewrite.

## User-directed visual rollback — 25 August 2026

The user has rejected the unified visual treatment for Training, Testimonials, and Footer and requested restoration to the earlier accepted composition. The current implementation therefore keeps the shared runtime, touch, preloader, Passage, Hero, Kage, and measured-quality improvements, but restores the earlier section presentation: clean dark Training with the selected-pathway copy treatment, light editorial client stories, and the simpler dark Footer/contact treatment. The temporary Training shader, Testimonial shader presentation, and Footer shader/masthead presentation are no longer mounted on the homepage. The decorative Training signal core/orbit are also hidden so Passage remains the optical object rather than introducing a second competing protagonist.

The second specialist’s review did **not** instruct the project to make those visual changes. Its relevant recommendations were technical: verify shader drawing resolution, inventory renderer/context ownership, add context-loss diagnostics, confirm Rapier WASM/SIMD mode, profile the worst overlap window, replace static quality assumptions with measured frame-time adaptation, inspect particle supersampling/fill-rate, and remove stale CSS overrides. The rejected visual treatment came from the implementation team’s interpretation of the broader unification direction and earlier creative requests for chapter-driven shader environments, not from a direct specialist mandate.
