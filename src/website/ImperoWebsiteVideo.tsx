import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { AbsoluteFill } from "remotion";
import { COLORS, TRANSITION_FRAMES } from "../brand";
import { SiteCta } from "./scenes/SiteCta";
import { SiteGraph } from "./scenes/SiteGraph";
import { SiteHero } from "./scenes/SiteHero";
import { SiteOutro } from "./scenes/SiteOutro";
import { SiteSerit } from "./scenes/SiteSerit";
import { SiteServices } from "./scenes/SiteServices";
import { SiteWhy } from "./scenes/SiteWhy";

// Scene lengths in frames at 30 fps, following the order of sections on impero.no
export const SITE_SCENES = {
  hero: 210,
  serit: 150,
  why: 180,
  services: 210,
  graph: 180,
  cta: 150,
  outro: 130,
} as const;

export const SITE_TOTAL_FRAMES =
  Object.values(SITE_SCENES).reduce((a, b) => a + b, 0) -
  TRANSITION_FRAMES * (Object.keys(SITE_SCENES).length - 1);

const timing = linearTiming({ durationInFrames: TRANSITION_FRAMES });

export const ImperoWebsiteVideo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.white }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={SITE_SCENES.hero}>
        <SiteHero />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={timing} />

      <TransitionSeries.Sequence durationInFrames={SITE_SCENES.serit}>
        <SiteSerit />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />

      <TransitionSeries.Sequence durationInFrames={SITE_SCENES.why}>
        <SiteWhy />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={timing} />

      <TransitionSeries.Sequence durationInFrames={SITE_SCENES.services}>
        <SiteServices />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />

      <TransitionSeries.Sequence durationInFrames={SITE_SCENES.graph}>
        <SiteGraph />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={timing} />

      <TransitionSeries.Sequence durationInFrames={SITE_SCENES.cta}>
        <SiteCta />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />

      <TransitionSeries.Sequence durationInFrames={SITE_SCENES.outro}>
        <SiteOutro />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
