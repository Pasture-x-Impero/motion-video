# Impero IT motion video

A short (about 30 seconds) branded motion graphics video for Impero IT, built with
[Remotion](https://www.remotion.dev). The video is code: every scene is a React
component, so text, colours and timing are edited in source and re rendered.

## Story

1. **Hero** "Din IT‑avdeling" with the intro sentence.
2. **Impero 365** the service circle with the five nodes popping in.
3. **Hva gjør vi som din IT‑avdeling?** the five services.
4. **Hvorfor velge oss?** four reasons.
5. **En del av Serit‑gruppen** mint box with counting numbers.
6. **Klar for å ta neste steg?** copper box with contact details.

Two compositions share the same scenes:

| Composition    | Size        | Use                              |
|----------------|-------------|----------------------------------|
| `ImperoSocial` | 1080 × 1350 | LinkedIn, Facebook, Instagram    |
| `ImperoWide`   | 1920 × 1080 | Website, YouTube, presentations  |

## Getting started

```bash
npm install
npm run dev          # opens Remotion Studio for live preview
npm run render       # renders out/impero-social.mp4
npm run render:wide  # renders out/impero-wide.mp4
npm run still        # renders a poster frame to out/poster.png
```

Remotion downloads its own headless Chrome on the first render. To use an
existing browser instead, set `REMOTION_BROWSER_EXECUTABLE` to its path.

## Editing

- All copy lives in `src/content.ts`. Change the text there and re render.
- Colours, scene lengths and the transition length live in `src/brand.ts`.
- Each scene is a file under `src/scenes/`. Shared building blocks (logos,
  headings, list rows, fade in helpers) are in `src/components/index.tsx`.
- Logos and the Inter font files are in `public/` and bundled into the render,
  so rendering needs no network access.

Headings use a non breaking hyphen (U+2011) in words like "IT‑avdeling" so they
never split across lines.
