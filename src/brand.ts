import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Inter is bundled locally (SIL OFL, see public/fonts/LICENSE-Inter.txt) so
// renders never depend on network access. 400 = body, 700 = labels,
// 900 = headings ("Inter Black").
export const fontFamily = "Inter";

const FONT_FILES: { weight: "400" | "700" | "900"; subset: "latin" | "latin-ext" }[] = [
  { weight: "400", subset: "latin" },
  { weight: "700", subset: "latin" },
  { weight: "900", subset: "latin" },
  { weight: "400", subset: "latin-ext" },
  { weight: "700", subset: "latin-ext" },
  { weight: "900", subset: "latin-ext" },
];

export const fontsReady = Promise.all(
  FONT_FILES.map(({ weight, subset }) =>
    loadFont({
      family: fontFamily,
      url: staticFile(`fonts/inter-${subset}-${weight}-normal.woff2`),
      weight,
      format: "woff2",
    }),
  ),
);

export const COLORS = {
  teal: "#11363E",
  turquoise: "#6DC7CB",
  mint: "#D1EDEE",
  copper: "#D57F59",
  white: "#FFFFFF",
  dark: "#1A2E33",
} as const;

export const FPS = 30;

// Scene lengths in frames (30 fps)
export const SCENES = {
  hero: 120,
  circle: 180,
  services: 210,
  why: 180,
  serit: 150,
  cta: 150,
} as const;

export const TRANSITION_FRAMES = 20;

export const TOTAL_FRAMES =
  Object.values(SCENES).reduce((a, b) => a + b, 0) -
  TRANSITION_FRAMES * (Object.keys(SCENES).length - 1);

export const LOGOS = {
  imperoColor: "logo/impero_farge.png",
  imperoWhite: "logo/impero_hvit.png",
  imperoIcon: "logo/impero_ikon.png",
  seritColor: "logo/serit_farge.png",
  seritWhite: "logo/serit_hvit.png",
} as const;
