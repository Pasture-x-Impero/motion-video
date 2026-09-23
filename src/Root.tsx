import { Composition } from "remotion";
import { FPS, TOTAL_FRAMES } from "./brand";
import { ImperoVideo } from "./ImperoVideo";

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
    </>
  );
};
