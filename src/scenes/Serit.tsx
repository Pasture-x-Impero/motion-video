import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, fontFamily } from "../brand";
import { SERIT } from "../content";
import { Body, FadeUp, Heading, Stage, useLayout } from "../components";

const Counter: React.FC<{ value: number; suffix: string; label: string; delay: number }> = ({
  value,
  suffix,
  label,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isWide } = useLayout();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 30, stiffness: 40, mass: 1.2 },
  });
  const shown = Math.round(progress * value);
  return (
    <FadeUp delay={delay} from="left" distance={40}>
      <div style={{ display: "flex", alignItems: "baseline", gap: isWide ? 22 : 30 }}>
        <div
          style={{
            fontFamily,
            fontWeight: 900,
            fontSize: isWide ? 76 : 92,
            color: COLORS.teal,
            letterSpacing: -2,
            minWidth: isWide ? 190 : 240,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {shown}
          {suffix}
        </div>
        <div style={{ fontFamily, fontWeight: 400, fontSize: isWide ? 28 : 34, color: COLORS.teal }}>
          {label}
        </div>
      </div>
    </FadeUp>
  );
};

export const Serit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isWide } = useLayout();
  const boxIn = spring({ frame, fps, config: { damping: 22, stiffness: 90 } });

  return (
    <Stage>
      <div
        style={{
          flex: 1,
          backgroundColor: COLORS.mint,
          borderRadius: 36,
          padding: isWide ? "48px 64px" : "64px 60px",
          display: "flex",
          flexDirection: isWide ? "row" : "column",
          gap: isWide ? 60 : 0,
          transform: `scale(${0.94 + boxIn * 0.06})`,
          opacity: boxIn,
          transformOrigin: "center",
        }}
      >
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Heading delay={8}>{SERIT.heading}</Heading>
          <FadeUp delay={18} style={{ marginTop: 28 }}>
            <Body size={isWide ? 28 : 32} color={COLORS.teal}>
              {SERIT.text}
            </Body>
          </FadeUp>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: isWide ? "center" : "flex-end",
            gap: isWide ? 28 : 36,
            marginTop: isWide ? 0 : 40,
          }}
        >
          {SERIT.stats.map((stat, i) => (
            <Counter key={stat.label} {...stat} delay={30 + i * 12} />
          ))}
        </div>
      </div>
    </Stage>
  );
};
