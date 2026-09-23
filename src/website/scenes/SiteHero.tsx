import { Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, LOGOS, fontFamily } from "../../brand";
import { FadeUp, Stage, useLayout } from "../../components";
import { NAV, SITE_HERO } from "../content";
import { ImperoMorph } from "../ImperoMorph";
import { RichText, SITE, TealButton } from "../ui";

/** Slim version of the website header: logo, navigation, contact button. */
const SiteHeader: React.FC = () => {
  const frame = useCurrentFrame();
  const { pad, logoTop, isWide, width, maxContentWidth } = useLayout();
  const sidePad = Math.max(pad, (width - maxContentWidth) / 2);
  const opacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        top: logoTop,
        left: sidePad,
        right: sidePad,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        opacity,
      }}
    >
      <Img src={staticFile(LOGOS.imperoColor)} style={{ height: isWide ? 64 : 74 }} />
      {isWide ? (
        <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
          {NAV.map((item) => (
            <span key={item} style={{ fontFamily, fontWeight: 500, fontSize: 22, color: SITE.foreground80, whiteSpace: "nowrap" }}>
              {item}
            </span>
          ))}
          <TealButton variant="coral" style={{ fontSize: 20, padding: "12px 22px", whiteSpace: "nowrap" }}>
            {SITE_HERO.button}
          </TealButton>
        </div>
      ) : null}
    </div>
  );
};

export const SiteHero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isWide, width } = useLayout();

  // Rings settle in, hold with labels, then morph into the Impero icon and hold.
  const ringsIn = spring({ frame: frame - 4, fps, config: { damping: 22, stiffness: 80 } });
  const progress = interpolate(frame, [70, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const labelOpacity = interpolate(frame, [20, 34, 62, 84], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const graphicWidth = isWide ? 720 : Math.min(width - 200, 700);

  const textBlock = (
    <div style={{ maxWidth: isWide ? 640 : undefined }}>
      <FadeUp delay={10} distance={40}>
        <h1
          style={{
            fontFamily,
            fontWeight: 900,
            fontSize: isWide ? 84 : 92,
            letterSpacing: -2.5,
            lineHeight: 1.05,
            color: COLORS.teal,
            margin: 0,
            whiteSpace: "nowrap",
          }}
        >
          {SITE_HERO.title}
        </h1>
      </FadeUp>
      <FadeUp delay={24} distance={30} style={{ marginTop: 22 }}>
        <p
          style={{
            fontFamily,
            fontWeight: 400,
            fontSize: isWide ? 30 : 33,
            lineHeight: 1.35,
            color: SITE.foreground80,
            margin: 0,
          }}
        >
          <RichText text={SITE_HERO.text} />
        </p>
      </FadeUp>
      <FadeUp delay={40} distance={24} style={{ marginTop: 32 }}>
        <TealButton variant="coral">{SITE_HERO.button}</TealButton>
      </FadeUp>
    </div>
  );

  const graphic = (
    <div
      style={{
        transform: `scale(${0.85 + ringsIn * 0.15})`,
        opacity: ringsIn,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <ImperoMorph progress={progress} labelOpacity={labelOpacity} width={graphicWidth} />
    </div>
  );

  return (
    <Stage
      logos={false}
      overlay={<SiteHeader />}
      style={
        isWide
          ? { flexDirection: "row", alignItems: "center", gap: 40 }
          : { justifyContent: "center", gap: 36 }
      }
    >
      {isWide ? (
        <>
          <div style={{ flex: "0 0 44%" }}>{textBlock}</div>
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>{graphic}</div>
        </>
      ) : (
        <>
          {graphic}
          {textBlock}
        </>
      )}
    </Stage>
  );
};
