import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, LOGOS, fontFamily } from "../../brand";
import { useLayout } from "../../components";
import { ImperoMorph, MORPH } from "../ImperoMorph";

/**
 * Intro
 *  1. Blank white. The three rings appear one by one: Utvikling, Drift, Utstyr.
 *  2. The rings spin into the Impero icon.
 *  3. The icon glides into place in the full logo and the wordmark appears.
 *  4. Two sentences are typed in below the logo, with a small flourish between them.
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

export const INTRO_TEXT = {
  first: "Er IT-avdelingen for små og mellomstore bedrifter.",
  second: "Vi hjelper deg å jobbe smartere med IT.",
};

export const INTRO_TIMING = {
  ringOuter: 15,
  ringInner: 45,
  ringDot: 75,
  labelsOut: 108,
  morphStart: 115,
  morphEnd: 185,
  toLogoStart: 200,
  toLogoEnd: 255,
  wordmarkIn: 228,
  liftStart: 262,
  liftEnd: 292,
  type1Start: 300,
  type1Out: 395,
  flourish: 400,
  type2Start: 430,
  duration: 560,
};

const CHARS_PER_FRAME = 1.15;

/** Text typed in character by character with a blinking caret. */
const Typewriter: React.FC<{ text: string; start: number; fadeOutAt?: number; size: number }> = ({
  text,
  start,
  fadeOutAt,
  size,
}) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;
  const shown = Math.min(text.length, Math.floor((frame - start) * CHARS_PER_FRAME));
  const done = shown >= text.length;
  const caretOn = !done || Math.floor(frame / 16) % 2 === 0;
  const opacity =
    fadeOutAt === undefined
      ? 1
      : interpolate(frame, [fadeOutAt, fadeOutAt + 14], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lift =
    fadeOutAt === undefined
      ? 0
      : interpolate(frame, [fadeOutAt, fadeOutAt + 14], [0, -24], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        fontFamily,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.3,
        color: COLORS.teal,
        textAlign: "center",
        opacity,
        transform: `translateY(${lift}px)`,
      }}
    >
      {text.slice(0, shown)}
      <span
        style={{
          display: "inline-block",
          width: Math.max(3, size * 0.07),
          height: size * 0.95,
          marginLeft: 4,
          verticalAlign: "-0.12em",
          backgroundColor: COLORS.turquoise,
          opacity: caretOn ? 1 : 0,
        }}
      />
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

  // 1. Rings appear one by one
  const ringIn = (at: number) => spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 110, mass: 0.8 } });
  const labelIn = (at: number) =>
    interpolate(frame, [at + 6, at + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const labelsOut = interpolate(frame, [t.labelsOut, t.labelsOut + 12], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const parts = { outer: ringIn(t.ringOuter), inner: ringIn(t.ringInner), dot: ringIn(t.ringDot) };
  const labels = {
    outer: labelIn(t.ringOuter) * labelsOut,
    inner: labelIn(t.ringInner) * labelsOut,
    dot: labelIn(t.ringDot) * labelsOut,
  };

  // 2. Rings spin into the icon (progress 0 -> 1)
  const progress = interpolate(frame, [t.morphStart, t.morphEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  // 3. Icon glides into the full logo: q = 1 means "rings stage", q = 0 means "logo at scale 1"
  const q = interpolate(frame, [t.toLogoStart, t.toLogoEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const z = 1 + (zoomFactor - 1) * q;
  const wordmarkIn = interpolate(frame, [t.wordmarkIn, t.wordmarkIn + 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // 4. Logo lifts to make room for the text
  const lift = interpolate(frame, [t.liftStart, t.liftEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const liftY = -(isWide ? height * 0.12 : height * 0.1);

  // Flourish between the two sentences: the icon does one full turn.
  const flourish = interpolate(frame, [t.flourish, t.flourish + 40], [0, 360], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const tx = -ox * q;
  const ty = -oy * q + liftY * lift;
  const textTop = height / 2 + liftY + logoH / 2 + (isWide ? 56 : 70);
  const textSize = isWide ? 40 : 39;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.white }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            position: "relative",
            width: logoW,
            height: logoH,
            transform: `translate(${tx}px, ${ty}px) scale(${z})`,
            transformOrigin: `${iconCx}px ${iconCy}px`,
          }}
        >
          {/* Wordmark and tagline, cropped from the logo file */}
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
          {/* Icon drawn by the morph SVG, centred on the icon position in the logo */}
          <div
            style={{
              position: "absolute",
              left: iconCx - iconSvgW / 2,
              top: iconCy - iconSvgH / 2,
              width: iconSvgW,
              height: iconSvgH,
              transform: `rotate(${flourish}deg)`,
            }}
          >
            <ImperoMorph progress={progress} labelOpacity={labels} width={iconSvgW} parts={parts} />
          </div>
        </div>
      </AbsoluteFill>

      {/* Typed sentences */}
      <div style={{ position: "absolute", left: pad, right: pad, top: textTop }}>
        <div style={{ maxWidth: isWide ? 900 : undefined, margin: "0 auto" }}>
          <Typewriter text={INTRO_TEXT.first} start={t.type1Start} fadeOutAt={t.type1Out} size={textSize} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 0 }}>
            <div style={{ maxWidth: isWide ? 900 : undefined, margin: "0 auto" }}>
              <Typewriter text={INTRO_TEXT.second} start={t.type2Start} size={textSize} />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
