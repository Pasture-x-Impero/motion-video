import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, fontFamily } from "../brand";
import { HERO } from "../content";
import { Body, FadeUp, Stage, useLayout } from "../components";

export const Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { width, height, isWide } = useLayout();

  // Decorative mint circle growing in from the bottom right corner.
  const circleScale = spring({ frame, fps, config: { damping: 30, stiffness: 60 } });
  const circleSize = isWide ? height * 0.95 : width * 0.85;

  const words = HERO.title.split(" ");

  return (
    <Stage>
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            right: -circleSize * 0.35,
            bottom: -circleSize * 0.3,
            width: circleSize,
            height: circleSize,
            borderRadius: "50%",
            backgroundColor: COLORS.mint,
            transform: `scale(${circleScale})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -circleSize * 0.35 - 14,
            bottom: -circleSize * 0.3 - 14,
            width: circleSize + 28,
            height: circleSize + 28,
            borderRadius: "50%",
            border: `3px solid ${COLORS.teal}`,
            opacity: interpolate(frame, [10, 40], [0, 1], { extrapolateRight: "clamp" }),
            transform: `scale(${circleScale})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: isWide ? width * 0.3 : width * 0.12,
            bottom: isWide ? height * 0.16 : height * 0.22,
            width: isWide ? 36 : 44,
            height: isWide ? 36 : 44,
            borderRadius: "50%",
            backgroundColor: COLORS.copper,
            transform: `scale(${spring({ frame: frame - 25, fps, config: { damping: 12 } })})`,
          }}
        />
      </AbsoluteFill>
      <div style={{ marginTop: isWide ? 40 : 90, maxWidth: isWide ? 900 : undefined }}>
        <h1
          style={{
            fontFamily,
            fontWeight: 900,
            fontSize: isWide ? 120 : 112,
            lineHeight: 1.02,
            letterSpacing: -3,
            color: COLORS.teal,
            margin: 0,
            display: "flex",
            flexWrap: "wrap",
            gap: "0 0.28em",
          }}
        >
          {words.map((word, i) => (
            <FadeUp key={word} delay={8 + i * 7} distance={60}>
              <span>{word}</span>
            </FadeUp>
          ))}
        </h1>
        <FadeUp delay={30} style={{ marginTop: isWide ? 28 : 40, maxWidth: isWide ? 820 : 880 }}>
          <Body size={isWide ? 30 : 34}>{HERO.subtitle}</Body>
        </FadeUp>
      </div>
    </Stage>
  );
};
