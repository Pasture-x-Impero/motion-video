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

## Website video

A second video, `ImperoWebsite*`, walks through impero.no section by section: the hero
with the site's ring animation (Utvikling, Drift, Utstyr morphing into the Impero icon),
the Serit box, "Hvorfor velge oss", the service cards, the rising service graph, the
coral contact form and a footer style outro. Copy and colours are taken from the site's
source (Lovable project "impero.no"). Its scenes live in `src/website/`.

Four compositions share the same building blocks:

| Composition           | Size        | Use                              |
|-----------------------|-------------|----------------------------------|
| `ImperoSocial`        | 1080 × 1350 | LinkedIn, Facebook, Instagram    |
| `ImperoWide`          | 1920 × 1080 | Website, YouTube, presentations  |
| `ImperoWebsiteSocial` | 1080 × 1350 | Website walkthrough, portrait    |
| `ImperoWebsiteWide`   | 1920 × 1080 | Website walkthrough, wide        |

## Getting started

```bash
npm install
npm run dev          # opens Remotion Studio for live preview
npm run render       # renders out/impero-social.mp4
npm run render:wide  # renders out/impero-wide.mp4
npm run render:site       # renders out/impero-website-social.mp4
npm run render:site:wide  # renders out/impero-website-wide.mp4
npm run still        # renders a poster frame to out/poster.png
```

Remotion downloads its own headless Chrome on the first render. To use an
existing browser instead, set `REMOTION_BROWSER_EXECUTABLE` to its path.

## Editing

- All copy lives in `src/content.ts` (brand video) and `src/website/content.ts`
  (website video). Change the text there and re render.
- Colours, scene lengths and the transition length live in `src/brand.ts`.
- Each scene is a file under `src/scenes/`. Shared building blocks (logos,
  headings, list rows, fade in helpers) are in `src/components/index.tsx`.
- Logos and the Inter font files are in `public/` and bundled into the render,
  so rendering needs no network access.

Headings use a non breaking hyphen (U+2011) in words like "IT‑avdeling" so they
never split across lines.
