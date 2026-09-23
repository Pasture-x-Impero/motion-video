import { Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, LOGOS, fontFamily } from "../../brand";
import { FadeUp, Stage, useLayout } from "../../components";
import { SITE_SERIT } from "../content";
import { SITE } from "../ui";

const Stat: React.FC<{ value: number; suffix: string; label: string; delay: number }> = ({
  value,
  suffix,
  label,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isWide } = useLayout();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 30, stiffness: 40, mass: 1.2 } });
  return (
    <FadeUp delay={delay} from="left" distance={30}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: isWide ? 52 : 58,
            color: COLORS.teal,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: -1,
          }}
        >
          {Math.round(progress * value)}
          {suffix}
        </span>
        <span
          style={{
            fontFamily,
            fontWeight: 400,
            fontSize: isWide ? 20 : 22,
            lineHeight: 1.15,
            color: SITE.foreground70,
            whiteSpace: "pre-line",
          }}
        >
          {label}
        </span>
      </div>
    </FadeUp>
  );
};

export const SiteSerit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isWide } = useLayout();
  const boxIn = spring({ frame, fps, config: { damping: 22, stiffness: 90 } });

  return (
    <Stage style={{ justifyContent: "center" }}>
      <div
        style={{
          backgroundColor: SITE.mint40,
          borderRadius: 24,
          padding: isWide ? "56px 64px" : "64px 56px",
          opacity: boxIn,
          transform: `translateY(${(1 - boxIn) * 30}px)`,
          display: "flex",
          flexDirection: isWide ? "row" : "column",
          gap: isWide ? 64 : 48,
          alignItems: isWide ? "center" : "stretch",
        }}
      >
        <div style={{ flex: 1 }}>
          <FadeUp delay={8}>
            <Img src={staticFile(LOGOS.seritColor)} style={{ height: isWide ? 60 : 68, marginBottom: 30 }} />
          </FadeUp>
          <FadeUp delay={16}>
            <p
              style={{
                fontFamily,
                fontWeight: 400,
                fontSize: isWide ? 28 : 31,
                lineHeight: 1.45,
                color: SITE.foreground70,
                margin: 0,
              }}
            >
              {SITE_SERIT.text}
            </p>
          </FadeUp>
        </div>
        <div
          style={{
            flex: isWide ? "0 0 38%" : undefined,
            display: "flex",
            flexDirection: "column",
            gap: isWide ? 26 : 30,
          }}
        >
          {SITE_SERIT.stats.map((stat, i) => (
            <Stat key={stat.label} {...stat} delay={30 + i * 12} />
          ))}
        </div>
      </div>
    </Stage>
  );
};
