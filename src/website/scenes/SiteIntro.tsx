import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, LOGOS, fontFamily } from "../../brand";
import { useLayout } from "../../components";
import { ImperoMorph, MORPH } from "../ImperoMorph";
import { SITE_HERO } from "../content";
import { SITE } from "../ui";

/**
 * Intro
 *  1. Hook: three everyday IT problems are typed in as bubbles (Utstyr, Drift, Utvikling).
 *  2. Turn: "Tenk om noen bare ordnet det."
 *  3. The rings build from the inside out and each bubble flies onto its ring
 *     and becomes the ring's label.
 *  4. The rings spin into the Impero icon, the icon glides into the full logo.
 *  5. The logo leaves, two sentences are typed in large, the logo returns,
 *     leaves again, and "Din IT-avdeling" closes.
 *
 * The logo is composed of the morph SVG (icon state) plus the wordmark cropped
 * from the logo PNG, so there is no image swap. Measurements of the PNG
 * (1322 x 313): icon centre (149, 150.5), icon outer diameter 293.5, wordmark
 * starts at x = 383.
 */
const LOGO_W = 1322;
const LOGO_H = 313;
const ICON_CX = 149;
const ICON_CY = 150.5;
const ICON_D = 293.5;
const WORDMARK_CROP_X = 340;

export const INTRO_HOOK = [
  { key: "dot" as const, text: "PC-en bruker fem minutter på å starte.", label: "Utstyr", color: COLORS.teal },
  { key: "inner" as const, text: "Den ene som kan IT har ferie.", label: "Drift", color: COLORS.turquoise },
  { key: "outer" as const, text: "Alt ligger fortsatt i et regneark.", label: "Utvikling", color: COLORS.copper },
];

export const INTRO_TEXT = {
  turn: "Tenk om noen bare ordnet det.",
  first: "Er IT-avdelingen for små og mellomstore bedrifter.",
  second: "Vi hjelper deg å jobbe smartere med IT.",
  title: SITE_HERO.title,
};

export const INTRO_TIMING = {
  bubbles: [12, 58, 100], // when each bubble starts typing
  bubbleSpeed: [1.1, 1.3, 1.5], // characters per frame, a little faster each time
  turnIn: 150,
  turnOut: 212,
  rings: [222, 258, 294], // dot, inner ring, outer ring
  flyFrames: 26,
  labelsOut: 340,
  morphStart: 350,
  morphEnd: 420,
  toLogoStart: 432,
  toLogoEnd: 487,
  wordmarkIn: 460,
  logoOut: 532,
  type1Start: 556,
  type1Out: 652,
  type2Start: 674,
  type2Out: 764,
  logoBackIn: 786,
  logoBackOut: 852,
  titleIn: 878,
  duration: 960,
};

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

/**
 * Text typed in character by character, no caret. The whole text is laid out
 * from the start with untyped characters hidden, so line breaks never jump.
 */
const Typed: React.FC<{
  text: string;
  start: number;
  charsPerFrame?: number;
  fadeOutAt?: number;
  size: number;
  weight?: number;
  color?: string;
  align?: "left" | "center";
  maxWidth?: number;
}> = ({ text, start, charsPerFrame = 1.2, fadeOutAt, size, weight = 700, color = COLORS.teal, align = "center", maxWidth }) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;
  const shown = Math.min(text.length, Math.floor((frame - start) * charsPerFrame));
  const opacity = fadeOutAt === undefined ? 1 : interpolate(frame, [fadeOutAt, fadeOutAt + 14], [1, 0], clamp);
  const lift = fadeOutAt === undefined ? 0 : interpolate(frame, [fadeOutAt, fadeOutAt + 14], [0, -24], clamp);
  return (
    <div
      style={{
        fontFamily,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.2,
        color,
        textAlign: align,
        opacity,
        transform: `translateY(${lift}px)`,
        maxWidth,
        margin: align === "center" ? "0 auto" : undefined,
      }}
    >
      {Array.from(text).map((ch, i) => (
        <span key={i} style={{ visibility: i < shown ? "visible" : "hidden" }}>
          {ch}
        </span>
      ))}
    </div>
  );
};

export const SiteIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isWide, width, height, pad } = useLayout();
  const t = INTRO_TIMING;

  // Size of the ring graphic while the rings are on screen.
  const svgWidth = isWide ? 720 : Math.min(width - 200, 700);
  const k = svgWidth / MORPH.viewW; // viewBox units to pixels

  // Logo geometry when the logo is centred at scale 1.
  const logoW = isWide ? 820 : Math.min(width - 160, 760);
  const s = logoW / LOGO_W;
  const logoH = LOGO_H * s;
  const iconCx = ICON_CX * s;
  const iconCy = ICON_CY * s;
  const iconSvgW = (ICON_D * s * MORPH.viewW) / MORPH.iconDiameter;
  const iconSvgH = (iconSvgW * MORPH.viewH) / MORPH.viewW;
  const zoomFactor = svgWidth / iconSvgW;
  const ox = iconCx - logoW / 2;
  const oy = iconCy - logoH / 2;

  // ---- 1 + 2. Hook bubbles and the turn ----
  const bubbleFont = isWide ? 34 : 36;
  const bubbleH = bubbleFont * 2.35;
  const bubbleGap = 24;
  const stackTop = height / 2 - 40 - (3 * bubbleH + 2 * bubbleGap) / 2;
  const bubbleY = (i: number) => stackTop + i * (bubbleH + bubbleGap);
  const turnOpacity = interpolate(frame, [t.turnIn, t.turnIn + 18, t.turnOut, t.turnOut + 12], [0, 1, 1, 0], clamp);
  const turnLift = interpolate(frame, [t.turnIn, t.turnIn + 18], [20, 0], clamp);

  // ---- 3. Rings build from the inside out, bubbles fly onto them and become labels ----
  // After the turn the bubbles park outside the ring area (below it in portrait, left of it in
  // wide) so the rings have the centre to themselves, and each bubble flies in from there.
  const park = interpolate(frame, [t.turnOut, t.turnOut + 22], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const waitScale = isWide ? 0.72 : 0.8;
  const waitStep = bubbleH * waitScale + 18;
  const ringOuterEdge = (MORPH.outerR + MORPH.stroke / 2) * k;
  const waitX = isWide ? width * 0.19 : width / 2;
  const waitY = (i: number) =>
    isWide ? height / 2 + (i - 1) * waitStep : height / 2 + ringOuterEdge + 70 + i * waitStep;
  const ringIn = (at: number) => spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 110, mass: 0.8 } });
  const labelsOut = interpolate(frame, [t.labelsOut, t.labelsOut + 12], [1, 0], clamp);
  const parts = { dot: ringIn(t.rings[0]), inner: ringIn(t.rings[1]), outer: ringIn(t.rings[2]) };
  const labelOffsetY = { outer: -MORPH.outerR * k, inner: -MORPH.innerR * k, dot: 0 };

  // ---- 4. Rings spin into the icon, icon glides into the logo ----
  const progress = interpolate(frame, [t.morphStart, t.morphEnd], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const q = interpolate(frame, [t.toLogoStart, t.toLogoEnd], [1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const z = 1 + (zoomFactor - 1) * q;
  const wordmarkIn = interpolate(frame, [t.wordmarkIn, t.wordmarkIn + 26], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  // ---- 5. Logo leaves, comes back, leaves again ----
  const logoOpacity = interpolate(
    frame,
    [t.logoOut, t.logoOut + 16, t.logoBackIn, t.logoBackIn + 18, t.logoBackOut, t.logoBackOut + 16],
    [1, 0, 0, 1, 1, 0],
    clamp,
  );
  const logoBackScale = interpolate(frame, [t.logoBackIn, t.logoBackIn + 18], [0.96, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const graphicVisible = frame >= t.rings[0] && logoOpacity > 0;

  const titleIn = spring({ frame: frame - t.titleIn, fps, config: { damping: 20, stiffness: 90 } });
  const titleOpacity = interpolate(frame, [t.titleIn, t.titleIn + 16], [0, 1], clamp);

  const sentenceSize = isWide ? 66 : 62;
  const sentenceMax = isWide ? 1300 : undefined;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.white }}>
      {/* Logo composite: wordmark crop plus the morph SVG on the icon position */}
      {graphicVisible ? (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              position: "relative",
              width: logoW,
              height: logoH,
              opacity: logoOpacity,
              transform: `translate(${-ox * q}px, ${-oy * q}px) scale(${z * (frame >= t.logoBackIn ? logoBackScale : 1)})`,
              transformOrigin: frame >= t.logoBackIn ? "center" : `${iconCx}px ${iconCy}px`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: WORDMARK_CROP_X * s,
                top: 0,
                width: logoW - WORDMARK_CROP_X * s,
                height: logoH,
                overflow: "hidden",
                opacity: wordmarkIn,
                transform: `translateX(${(1 - wordmarkIn) * -28}px)`,
              }}
            >
              <Img
                src={staticFile(LOGOS.imperoColor)}
                style={{ position: "absolute", left: -WORDMARK_CROP_X * s, top: 0, width: logoW, height: logoH }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                left: iconCx - iconSvgW / 2,
                top: iconCy - iconSvgH / 2,
                width: iconSvgW,
                height: iconSvgH,
              }}
            >
              <ImperoMorph progress={progress} labelOpacity={0} width={iconSvgW} parts={parts} />
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* Hook bubbles, each flying onto its ring and turning into the label */}
      {INTRO_HOOK.map((item, i) => {
        const typeStart = t.bubbles[i];
        if (frame < typeStart || frame > t.labelsOut + 14) return null;
        const flyStart = t.rings[i];
        const fly = interpolate(frame, [flyStart, flyStart + t.flyFrames], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
        const popIn = spring({ frame: frame - typeStart, fps, config: { damping: 16, stiffness: 140, mass: 0.7 } });
        const targetY = height / 2 + labelOffsetY[item.key];
        // Home position: the stack, then the parking spot after the turn
        const homeX = interpolate(park, [0, 1], [width / 2, waitX]);
        const homeY = interpolate(park, [0, 1], [bubbleY(i) + bubbleH / 2, waitY(i)]);
        const homeScale = interpolate(park, [0, 1], [1, waitScale]);
        const x = interpolate(fly, [0, 1], [homeX, width / 2]);
        const y = interpolate(fly, [0, 1], [homeY, targetY]);
        const bubbleOpacity = interpolate(fly, [0.9, 1], [1, 0], clamp) * (frame < typeStart + 4 ? popIn : 1);
        const bubbleScale = interpolate(fly, [0, 1], [homeScale, 0.62]) * (0.9 + popIn * 0.1);
        const labelIn = interpolate(fly, [0.88, 1], [0, 1], clamp);
        const onDot = item.key === "dot";
        return (
          <div key={item.key}>
            <div
              style={{
                position: "absolute",
                left: x,
                top: y,
                transform: `translate(-50%, -50%) scale(${bubbleScale})`,
                opacity: bubbleOpacity,
                display: "flex",
                alignItems: "center",
                gap: 16,
                backgroundColor: COLORS.white,
                border: `1px solid ${SITE.cardBorder}`,
                boxShadow: SITE.cardShadow,
                borderRadius: 999,
                padding: `${bubbleFont * 0.55}px ${bubbleFont * 0.95}px`,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ width: bubbleFont * 0.5, height: bubbleFont * 0.5, borderRadius: "50%", backgroundColor: item.color, flexShrink: 0 }} />
              <Typed text={item.text} start={typeStart} charsPerFrame={t.bubbleSpeed[i]} size={bubbleFont} align="left" />
            </div>
            {labelIn > 0 ? (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: targetY,
                  transform: `translate(-50%, -50%) scale(${0.8 + labelIn * 0.2})`,
                  opacity: labelIn * labelsOut,
                  fontFamily,
                  fontWeight: 900,
                  fontSize: onDot ? 22 * k : 26 * k,
                  color: onDot ? COLORS.white : COLORS.teal,
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </div>
            ) : null}
          </div>
        );
      })}

      {/* The turn */}
      <div
        style={{
          position: "absolute",
          left: pad,
          right: pad,
          top: bubbleY(3) + 26,
          textAlign: "center",
          fontFamily,
          fontWeight: 700,
          fontSize: isWide ? 40 : 42,
          color: COLORS.teal,
          opacity: turnOpacity,
          transform: `translateY(${turnLift}px)`,
        }}
      >
        {INTRO_TEXT.turn}
      </div>

      {/* Sentences, centred on an otherwise empty frame */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: `0 ${pad}px` }}>
        <div style={{ width: "100%" }}>
          <Typed text={INTRO_TEXT.first} start={t.type1Start} fadeOutAt={t.type1Out} size={sentenceSize} weight={900} maxWidth={sentenceMax} />
        </div>
        <div style={{ position: "absolute", left: pad, right: pad }}>
          <Typed text={INTRO_TEXT.second} start={t.type2Start} fadeOutAt={t.type2Out} size={sentenceSize} weight={900} maxWidth={sentenceMax} />
        </div>
      </AbsoluteFill>

      {/* Closing title */}
      {frame >= t.titleIn ? (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              fontFamily,
              fontWeight: 900,
              fontSize: isWide ? 128 : 108,
              letterSpacing: -3,
              color: COLORS.teal,
              opacity: titleOpacity,
              transform: `translateY(${(1 - titleIn) * 30}px)`,
              whiteSpace: "nowrap",
            }}
          >
            {INTRO_TEXT.title}
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
