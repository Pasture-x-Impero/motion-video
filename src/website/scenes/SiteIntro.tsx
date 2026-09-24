import { Check } from "lucide-react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, LOGOS, fontFamily } from "../../brand";
import { useLayout } from "../../components";
import { ImperoMorph, MORPH } from "../ImperoMorph";
import { SITE } from "../ui";

/**
 * Intro
 *  1. Hook: three everyday IT problems are typed in as notification bubbles.
 *  2. Turn: "Tenk om noen bare ordnet det."
 *  3. The rings appear one by one and each bubble flies onto its ring and
 *     becomes the ring's label: Utvikling, Drift, Utstyr.
 *  4. The rings spin into the Impero icon, the icon glides into the full logo.
 *  5. Two sentences are typed in below the logo, with a small flourish between.
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
  { key: "outer" as const, text: "Alt ligger fortsatt i et regneark.", label: "Utvikling", color: COLORS.copper },
  { key: "inner" as const, text: "Den ene som kan IT har ferie.", label: "Drift", color: COLORS.turquoise },
  { key: "dot" as const, text: "PC-en bruker fem minutter på å starte.", label: "Utstyr", color: COLORS.teal },
];

export const INTRO_TEXT = {
  turn: "Tenk om noen bare ordnet det.",
  first: "Er IT-avdelingen for små og mellomstore bedrifter.",
  second: "Vi hjelper deg å jobbe smartere med IT.",
};

export const INTRO_TIMING = {
  bubbles: [12, 58, 100], // when each bubble starts typing
  bubbleSpeed: [1.1, 1.3, 1.5], // characters per frame, a little faster each time
  turnIn: 150,
  turnOut: 212,
  rings: [222, 258, 294], // when each ring appears and its bubble flies to it
  flyFrames: 26,
  labelsOut: 340,
  morphStart: 350,
  morphEnd: 420,
  toLogoStart: 432,
  toLogoEnd: 487,
  wordmarkIn: 460,
  liftStart: 494,
  liftEnd: 524,
  type1Start: 530,
  type1Out: 612,
  flourish: 616,
  type2Start: 644,
  duration: 760,
};

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

/** Text typed in character by character with a blinking caret. */
const Typewriter: React.FC<{
  text: string;
  start: number;
  charsPerFrame?: number;
  fadeOutAt?: number;
  size: number;
  align?: "left" | "center";
  caretColor?: string;
}> = ({ text, start, charsPerFrame = 1.15, fadeOutAt, size, align = "center", caretColor = COLORS.turquoise }) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;
  const shown = Math.min(text.length, Math.floor((frame - start) * charsPerFrame));
  const done = shown >= text.length;
  const caretOn = !done || Math.floor(frame / 16) % 2 === 0;
  const opacity = fadeOutAt === undefined ? 1 : interpolate(frame, [fadeOutAt, fadeOutAt + 14], [1, 0], clamp);
  const lift = fadeOutAt === undefined ? 0 : interpolate(frame, [fadeOutAt, fadeOutAt + 14], [0, -24], clamp);
  return (
    <div
      style={{
        fontFamily,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.3,
        color: COLORS.teal,
        textAlign: align,
        opacity,
        transform: `translateY(${lift}px)`,
        whiteSpace: "nowrap",
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
          backgroundColor: caretColor,
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

  // ---- 3. Rings appear, bubbles fly onto them and become labels ----
  const ringIn = (at: number) => spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 110, mass: 0.8 } });
  const labelsOut = interpolate(frame, [t.labelsOut, t.labelsOut + 12], [1, 0], clamp);
  const parts = { outer: ringIn(t.rings[0]), inner: ringIn(t.rings[1]), dot: ringIn(t.rings[2]) };
  // Label positions in pixels relative to the frame centre (the SVG is centred there in the ring stage)
  const labelOffsetY = { outer: -MORPH.outerR * k, inner: -MORPH.innerR * k, dot: 0 };

  // ---- 4. Rings spin into the icon, icon glides into the logo ----
  const progress = interpolate(frame, [t.morphStart, t.morphEnd], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const q = interpolate(frame, [t.toLogoStart, t.toLogoEnd], [1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const z = 1 + (zoomFactor - 1) * q;
  const wordmarkIn = interpolate(frame, [t.wordmarkIn, t.wordmarkIn + 26], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  // ---- 5. Logo lifts, sentences are typed ----
  const lift = interpolate(frame, [t.liftStart, t.liftEnd], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const liftY = -(isWide ? height * 0.12 : height * 0.1);
  const flourish = interpolate(frame, [t.flourish, t.flourish + 40], [0, 360], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const graphicVisible = frame >= t.rings[0];

  const tx = -ox * q;
  const ty = -oy * q + liftY * lift;
  const textTop = height / 2 + liftY + logoH / 2 + (isWide ? 56 : 70);
  const textSize = isWide ? 40 : 39;

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
              transform: `translate(${tx}px, ${ty}px) scale(${z})`,
              transformOrigin: `${iconCx}px ${iconCy}px`,
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
                transform: `rotate(${flourish}deg)`,
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
        if (frame < typeStart) return null;
        const flyStart = t.rings[i];
        const fly = interpolate(frame, [flyStart, flyStart + t.flyFrames], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
        const popIn = spring({ frame: frame - typeStart, fps, config: { damping: 16, stiffness: 140, mass: 0.7 } });
        const targetY = height / 2 + labelOffsetY[item.key];
        const y = interpolate(fly, [0, 1], [bubbleY(i) + bubbleH / 2, targetY]);
        const bubbleOpacity = interpolate(fly, [0.9, 1], [1, 0], clamp) * (frame < typeStart + 4 ? popIn : 1);
        const bubbleScale = interpolate(fly, [0, 1], [1, 0.62]) * (0.9 + popIn * 0.1);
        const pillIn = interpolate(fly, [0.88, 1], [0, 1], clamp);
        const pillFont = isWide ? 25 : 27;
        return (
          <div key={item.key}>
            {/* Notification bubble */}
            <div
              style={{
                position: "absolute",
                left: "50%",
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
              }}
            >
              <span style={{ width: bubbleFont * 0.5, height: bubbleFont * 0.5, borderRadius: "50%", backgroundColor: item.color, flexShrink: 0 }} />
              <Typewriter text={item.text} start={typeStart} charsPerFrame={t.bubbleSpeed[i]} size={bubbleFont} align="left" caretColor={item.color} />
            </div>
            {/* Label pill on the ring */}
            {pillIn > 0 ? (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: targetY,
                  transform: `translate(-50%, -50%) scale(${0.7 + pillIn * 0.3})`,
                  opacity: pillIn * labelsOut,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  backgroundColor: COLORS.white,
                  boxShadow: SITE.cardShadow,
                  borderRadius: 999,
                  padding: `${pillFont * 0.28}px ${pillFont * 0.7}px ${pillFont * 0.28}px ${pillFont * 0.5}px`,
                  fontFamily,
                  fontWeight: 900,
                  fontSize: pillFont,
                  color: COLORS.teal,
                  whiteSpace: "nowrap",
                }}
              >
                <Check size={pillFont * 0.95} strokeWidth={3} color={item.color} />
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

      {/* Typed sentences under the logo */}
      <div style={{ position: "absolute", left: pad, right: pad, top: textTop }}>
        <Typewriter text={INTRO_TEXT.first} start={t.type1Start} fadeOutAt={t.type1Out} size={textSize} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 0 }}>
          <Typewriter text={INTRO_TEXT.second} start={t.type2Start} size={textSize} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
