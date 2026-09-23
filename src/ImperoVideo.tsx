import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { AbsoluteFill } from "remotion";
import { COLORS, SCENES, TRANSITION_FRAMES } from "./brand";
import { Circle365 } from "./scenes/Circle365";
import { Cta } from "./scenes/Cta";
import { Hero } from "./scenes/Hero";
import { Serit } from "./scenes/Serit";
import { Services } from "./scenes/Services";
import { WhyUs } from "./scenes/WhyUs";

const timing = linearTiming({ durationInFrames: TRANSITION_FRAMES });

export const ImperoVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.white }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENES.hero}>
          <Hero />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timing} />

        <TransitionSeries.Sequence durationInFrames={SCENES.circle}>
          <Circle365 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={timing} />

        <TransitionSeries.Sequence durationInFrames={SCENES.services}>
          <Services />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timing} />

        <TransitionSeries.Sequence durationInFrames={SCENES.why}>
          <WhyUs />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={timing} />

        <TransitionSeries.Sequence durationInFrames={SCENES.serit}>
          <Serit />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timing} />

        <TransitionSeries.Sequence durationInFrames={SCENES.cta}>
          <Cta />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
