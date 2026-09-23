import { Composition } from "remotion";
import { FPS, TOTAL_FRAMES } from "./brand";
import { ImperoVideo } from "./ImperoVideo";
import { ImperoWebsiteVideo, SITE_TOTAL_FRAMES } from "./website/ImperoWebsiteVideo";
import { INTRO_TIMING, SiteIntro } from "./website/scenes/SiteIntro";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 4:5 portrait for LinkedIn, Facebook and Instagram feed */}
      <Composition
        id="ImperoSocial"
        component={ImperoVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1350}
      />
      {/* 16:9 for website, YouTube and presentations */}
      <Composition
        id="ImperoWide"
        component={ImperoVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
      {/* Video built from the sections of impero.no */}
      <Composition
        id="ImperoWebsiteSocial"
        component={ImperoWebsiteVideo}
        durationInFrames={SITE_TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1350}
      />
      <Composition
        id="ImperoWebsiteWide"
        component={ImperoWebsiteVideo}
        durationInFrames={SITE_TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
      {/* Intro: white, logo, zoom into the icon, icon spins out into the rings */}
      <Composition
        id="ImperoIntroSocial"
        component={SiteIntro}
        durationInFrames={INTRO_TIMING.duration}
        fps={FPS}
        width={1080}
        height={1350}
      />
      <Composition
        id="ImperoIntroWide"
        component={SiteIntro}
        durationInFrames={INTRO_TIMING.duration}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
