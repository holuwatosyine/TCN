# Cleanup manifest

Delete these files when the Ascent branch is committed because they describe or implement superseded generations and are not imported by the new build:

## Stale documentation

- `FINAL-VISUAL-AUDIT-NOTES.md`
- `KINGSHILL-WEBGL-SPECIALIST-HANDOFF.md`
- `KINGSHILL-WEBGL-UNIFICATION-TASKLIST.md`
- `PIXEL-VALIDATION-NOTES.md`
- `REFERENCE-RESTORE-VALIDATION.md`
- `WEBGL-PERFORMANCE-AUDIT.md`

## Dead components after Ascent migration

- `src/components/AboutSection.tsx`
- `src/components/CTASection.tsx`
- `src/components/TestimonialsSection.tsx`
- `src/components/HeroMaterialField.tsx`
- `src/components/FooterSignal.tsx`
- `src/App.css`

`HeroMaterialField` and `FooterSignal` were active in the lite build but are intentionally retired because their GPU/animation roles are now owned by the persistent `AscentWorld`.
