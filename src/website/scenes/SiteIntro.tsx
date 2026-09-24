import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, LOGOS, fontFamily } from "../../brand";
import { useLayout } from "../../components";
import { ImperoMorph, MORPH } from "../ImperoMorph";
import { SITE_HERO } from "../content";
import { SITE } from "../ui";

/**
 * Intro, about 22 seconds
 *  1. Hook: three everyday IT problems are typed in as bubbles. As soon as a
 *     bubble is done it flies onto its ring while the ring grows: Utstyr (dot),
 *     Drift (inner ring), Utvikling (outer ring).
 *  2. Turn: "Tenk om noen bare ordnet det." next to the finished rings.
 *  3. The rings spin into the Impero icon. The icon shrinks and sits above the
 *     copy as the sender while two sentences are typed in.
 *  4. The icon glides into the full logo, the logo leaves, "Din IT-avdeling" closes.
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
  first: "IT-avdelingen for små og mellomstore bedrifter.",
  second: "Vi hjelper deg å jobbe smartere med IT.",
  title: SITE_HERO.title,
};

export const INTRO_TIMING = {
  bubbles: [10, 44, 70], // when each bubble starts typing
  bubbleSpeed: [1.25, 1.35, 1.45], // characters per frame
  flyAfterTyped: 6, // frames between the last character and take off
  flyFrames: 22,
  turnIn: 128,
  turnOut: 176,
  labelsOut: 182,
  morphStart: 192,
  morphEnd: 252,
  toSenderStart: 256,
  toSenderEnd: 286,
  type1Start: 292,
  type1Out: 368,
  type2Start: 386,
  type2Out: 460,
  toLogoStart: 476,
  toLogoEnd: 516,
  wordmarkIn: 498,
  logoOut: 568,
  titleIn: 590,
  duration: 660,
};

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const ease = Easing.inOut(Easing.cubic);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/**
 * Text typed in character by character, no caret. The whole text is laid out
 * from the start with untyped characters hidden, so line breaks never jump.
 * The block is left aligned and centred as a whole.
 */
const Typed: React.FC<{
  text: string;
  start: number;
  charsPerFrame?: number;
  fadeOutAt?: number;
  size: number;
  weight?: number;
  color?: string;
  maxWidth?: number;
}> = ({ text, start, charsPerFrame = 1.3, fadeOutAt, size, weight = 700, color = COLORS.teal, maxWidth }) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;
  const shown = Math.min(text.length, Math.floor((frame - start) * charsPerFrame));
  const opacity = fadeOutAt === undefined ? 1 : interpolate(frame, [fadeOutAt, fadeOutAt + 12], [1, 0], clamp);
  const lift = fadeOutAt === undefined ? 0 : interpolate(frame, [fadeOutAt, fadeOutAt + 12], [0, -20], clamp);
  return (
    <div style={{ display: "flex", justifyContent: "center", opacity, transform: `translateY(${lift}px)` }}>
      <div style={{ fontFamily, fontWeight: weight, fontSize: size, lineHeight: 1.18, color, textAlign: "left", maxWidth }}>
        {Array.from(text).map((ch, i) => (
          <span key={i} style={{ visibility: i < shown ? "visible" : "hidden" }}>
            {ch}
          </span>
        ))}
      </div>
    </div>
  );
};

export const SiteIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isWide, width, height, pad } = useLayout();
  const t = INTRO_TIMING;
  const cx = width / 2;
  const cy = height / 2;

  // ---- Geometry ----
  const svgWidth = isWide ? 700 : Math.min(width - 200, 700); // ring graphic width
  const k = svgWidth / MORPH.viewW;
  const ringOuterEdge = (MORPH.outerR + MORPH.stroke / 2) * k;

  const logoW = isWide ? 820 : Math.min(width - 160, 760);
  const s = logoW / LOGO_W;
  const logoH = LOGO_H * s;
  const iconCx = ICON_CX * s;
  const iconCy = ICON_CY * s;
  const iconSvgW = (ICON_D * s * MORPH.viewW) / MORPH.iconDiameter;
  const iconSvgH = (iconSvgW * MORPH.viewH) / MORPH.viewW;
  const ox = iconCx - logoW / 2;
  const oy = iconCy - logoH / 2;

  // Where the icon centre sits in each phase, and the composite scale in that phase
  const ringPos = isWide ? { x: width * 0.62, y: cy } : { x: cx, y: height * 0.4 };
  const ringScale = svgWidth / iconSvgW;
  const senderIconD = isWide ? 120 : 132;
  const senderPos = { x: cx, y: isWide ? height * 0.33 : height * 0.34 };
  const senderScale = senderIconD / ((iconSvgW * MORPH.iconDiameter) / MORPH.viewW);
  const logoPos = { x: cx + ox, y: cy + oy };

  const p1 = interpolate(frame, [t.toSenderStart, t.toSenderEnd], [0, 1], { ...clamp, easing: ease });
  const p2 = interpolate(frame, [t.toLogoStart, t.toLogoEnd], [0, 1], { ...clamp, easing: ease });
  const iconX = lerp(lerp(ringPos.x, senderPos.x, p1), logoPos.x, p2);
  const iconY = lerp(lerp(ringPos.y, senderPos.y, p1), logoPos.y, p2);
  const scale = lerp(lerp(ringScale, senderScale, p1), 1, p2);
  const tx = iconX - cx - ox;
  const ty = iconY - cy - oy;

  // ---- Hook bubbles ----
  const bubbleFont = isWide ? 34 : 36;
  const bubbleH = bubbleFont * 2.35;
  const stackStep = bubbleH + 22;
  const stackX = isWide ? width * 0.25 : cx;
  const stackY = (i: number) =>
    isWide ? cy + (i - 1) * stackStep : ringPos.y + ringOuterEdge + 76 + i * stackStep;
  const typedDone = (i: number) => t.bubbles[i] + Math.ceil(INTRO_HOOK[i].text.length / t.bubbleSpeed[i]);
  const flyStart = (i: number) => typedDone(i) + t.flyAfterTyped;
  const ringIn = (at: number) => spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 110, mass: 0.8 } });
  const parts = { dot: ringIn(flyStart(0)), inner: ringIn(flyStart(1)), outer: ringIn(flyStart(2)) };
  const labelOffsetY = { outer: -MORPH.outerR * k, inner: -MORPH.innerR * k, dot: 0 };
  const labelsOut = interpolate(frame, [t.labelsOut, t.labelsOut + 12], [1, 0], clamp);

  // ---- Turn ----
  const turnOpacity = interpolate(frame, [t.turnIn, t.turnIn + 16, t.turnOut, t.turnOut + 12], [0, 1, 1, 0], clamp);
  const turnLift = interpolate(frame, [t.turnIn, t.turnIn + 16], [18, 0], clamp);

  // ---- Morph, logo, title ----
  const progress = interpolate(frame, [t.morphStart, t.morphEnd], [0, 1], { ...clamp, easing: ease });
  const wordmarkIn = interpolate(frame, [t.wordmarkIn, t.wordmarkIn + 24], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const logoOpacity = interpolate(frame, [t.logoOut, t.logoOut + 16], [1, 0], clamp);
  const graphicVisible = frame >= flyStart(0) && logoOpacity > 0;
  const titleIn = spring({ frame: frame - t.titleIn, fps, config: { damping: 20, stiffness: 90 } });
  const titleOpacity = interpolate(frame, [t.titleIn, t.titleIn + 16], [0, 1], clamp);

  const sentenceSize = isWide ? 64 : 60;
  const sentenceMax = isWide ? 1200 : width - pad * 2;
  const sentenceTop = isWide ? height * 0.44 : height * 0.45;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.white }}>
      {/* Icon / logo composite */}
      {graphicVisible ? (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              position: "relative",
              width: logoW,
              height: logoH,
              opacity: logoOpacity,
              transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
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
              }}
            >
              <ImperoMorph progress={progress} labelOpacity={0} width={iconSvgW} parts={parts} />
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* Hook bubbles: typed in the stack, then flying onto their ring */}
      {INTRO_HOOK.map((item, i) => {
        const typeStart = t.bubbles[i];
        if (frame < typeStart || frame > t.labelsOut + 14) return null;
        const fly = interpolate(frame, [flyStart(i), flyStart(i) + t.flyFrames], [0, 1], { ...clamp, easing: ease });
        const popIn = spring({ frame: frame - typeStart, fps, config: { damping: 16, stiffness: 140, mass: 0.7 } });
        const targetX = ringPos.x;
        const targetY = ringPos.y + labelOffsetY[item.key];
        const x = lerp(stackX, targetX, fly);
        const y = lerp(stackY(i), targetY, fly);
        const bubbleOpacity = interpolate(fly, [0.9, 1], [1, 0], clamp) * (frame < typeStart + 4 ? popIn : 1);
        const bubbleScale = lerp(1, 0.62, fly) * (0.9 + popIn * 0.1);
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
              <Typed text={item.text} start={typeStart} charsPerFrame={t.bubbleSpeed[i]} size={bubbleFont} />
            </div>
            {labelIn > 0 ? (
              <div
                style={{
                  position: "absolute",
                  left: targetX,
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

      {/* The turn, where the bubbles were */}
      <div
        style={{
          position: "absolute",
          left: isWide ? pad : pad,
          width: isWide ? width * 0.42 : width - pad * 2,
          top: isWide ? cy : stackY(1),
          transform: `translateY(calc(-50% + ${turnLift}px))`,
          textAlign: "center",
          fontFamily,
          fontWeight: 700,
          fontSize: isWide ? 42 : 42,
          lineHeight: 1.2,
          color: COLORS.teal,
          opacity: turnOpacity,
        }}
      >
        {INTRO_TEXT.turn}
      </div>

      {/* Sentences under the sender icon */}
      <div style={{ position: "absolute", left: pad, right: pad, top: sentenceTop }}>
        <Typed text={INTRO_TEXT.first} start={t.type1Start} fadeOutAt={t.type1Out} size={sentenceSize} weight={900} maxWidth={sentenceMax} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 0 }}>
          <Typed text={INTRO_TEXT.second} start={t.type2Start} fadeOutAt={t.type2Out} size={sentenceSize} weight={900} maxWidth={sentenceMax} />
        </div>
      </div>

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
