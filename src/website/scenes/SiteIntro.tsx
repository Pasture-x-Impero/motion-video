import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, LOGOS, fontFamily } from "../../brand";
import { useLayout } from "../../components";
import { ImperoMorph, MORPH } from "../ImperoMorph";

/**
 * Intro, about 25 seconds
 *  1. Three everyday IT questions typed in one after another, top to bottom,
 *     with the middle line on the centre of the screen: Utstyr, Drift, Utvikling.
 *  2. The stack glides down into the ring positions and each line becomes its
 *     ring label in place while the ring grows: the top line the dot, the
 *     middle line the inner ring, the bottom line the outer ring. The labels sit
 *     on the bottom of the rings so no line has to cross another.
 *  3. The rings spin into the Impero icon, the icon glides into the full logo,
 *     the logo leaves and "Din IT-avdeling" closes.
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

type Layer = { key: "dot" | "inner" | "outer"; text: string; label: string };

// In the order they are shown alone, and bottom to top in the stack
export const INTRO_HOOK: Layer[] = [
  { key: "dot", text: "Bruker PC-en fem minutter på å starte?", label: "Utstyr" },
  { key: "inner", text: "Vet noen om backupen faktisk virker?", label: "Drift" },
  { key: "outer", text: "Har regnearket blitt forretningssystemet?", label: "Utvikling" },
];

export const INTRO_TEXT = {
  title: "Din IT-avdeling",
};

export const INTRO_TIMING = {
  stackIn: [4, 36, 68], // dot, inner, outer: each line is typed in where it stays, top to bottom
  settle: { in: 110, out: 134 }, // the stack glides down into the ring positions
  rings: [124, 156, 188], // dot, inner, outer: the line becomes the label while the ring grows
  becomeFrames: 22,
  labelsOut: 246,
  morphStart: 256,
  morphEnd: 316,
  toLogoStart: 322,
  toLogoEnd: 362,
  wordmarkIn: 342,
  logoOut: 406,
  titleIn: 410,
  duration: 490,
};

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const ease = Easing.inOut(Easing.cubic);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/** Text typed in character by character, no caret. Untyped characters are laid out but hidden. */
const Typed: React.FC<{ text: string; start: number; charsPerFrame?: number; size: number; weight?: number; color?: string }> = ({
  text,
  start,
  charsPerFrame = 1.3,
  size,
  weight = 900,
  color = COLORS.teal,
}) => {
  const frame = useCurrentFrame();
  const shown = frame < start ? 0 : Math.min(text.length, Math.floor((frame - start) * charsPerFrame));
  return (
    <div style={{ fontFamily, fontWeight: weight, fontSize: size, lineHeight: 1.2, color, whiteSpace: "nowrap" }}>
      {Array.from(text).map((ch, i) => (
        <span key={i} style={{ visibility: i < shown ? "visible" : "hidden" }}>
          {ch}
        </span>
      ))}
    </div>
  );
};

/** One line of copy, typed in or static. Every line in the video shares the same size. */
const Line: React.FC<{ text: string; font: number; typedStart?: number; charsPerFrame?: number }> = ({ text, font, typedStart, charsPerFrame }) =>
  typedStart === undefined ? (
    <div style={{ fontFamily, fontWeight: 900, fontSize: font, lineHeight: 1.2, color: COLORS.teal, whiteSpace: "nowrap" }}>{text}</div>
  ) : (
    <Typed text={text} start={typedStart} charsPerFrame={charsPerFrame} size={font} />
  );

export const SiteIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isWide, width, height } = useLayout();
  const t = INTRO_TIMING;
  const cx = width / 2;
  const cy = height / 2;

  // ---- Geometry ----
  const svgWidth = isWide ? 700 : Math.min(width - 200, 700);
  const k = svgWidth / MORPH.viewW;
  const logoW = isWide ? 820 : Math.min(width - 160, 760);
  const s = logoW / LOGO_W;
  const logoH = LOGO_H * s;
  const iconCx = ICON_CX * s;
  const iconCy = ICON_CY * s;
  const iconSvgW = (ICON_D * s * MORPH.viewW) / MORPH.iconDiameter;
  const iconSvgH = (iconSvgW * MORPH.viewH) / MORPH.viewW;
  const ox = iconCx - logoW / 2;
  const oy = iconCy - logoH / 2;
  const ringScale = svgWidth / iconSvgW;

  // Icon centre: frame centre during the rings, then the icon's place in the centred logo
  const p2 = interpolate(frame, [t.toLogoStart, t.toLogoEnd], [0, 1], { ...clamp, easing: ease });
  const iconX = lerp(cx, cx + ox, p2);
  const iconY = lerp(cy, cy + oy, p2);
  const scale = lerp(ringScale, 1, p2);
  const tx = iconX - cx - ox;
  const ty = iconY - cy - oy;

  // ---- One text size for everything except the closing title ----
  const textFont = isWide ? 52 : 44;

  // ---- Stack in the centre, each line sitting where its ring label will be ----
  const lineGap = textFont * 2.6;
  const lineY = { dot: cy - lineGap, inner: cy, outer: cy + lineGap };
  // Labels on the bottom of the rings: every line then only moves down, none cross
  const labelY = { dot: cy, inner: cy + MORPH.innerR * k, outer: cy + MORPH.outerR * k };
  const settle = interpolate(frame, [t.settle.in, t.settle.out], [0, 1], { ...clamp, easing: ease });
  const ringIn = (at: number) => spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 110, mass: 0.8 } });
  // The ring starts a beat after its line begins to fade, so the two never sit on top of each other
  const parts = { dot: ringIn(t.rings[0] + 6), inner: ringIn(t.rings[1] + 6), outer: ringIn(t.rings[2] + 6) };
  const labelsOut = interpolate(frame, [t.labelsOut, t.labelsOut + 12], [1, 0], clamp);

  // ---- Morph, logo, title ----
  const progress = interpolate(frame, [t.morphStart, t.morphEnd], [0, 1], { ...clamp, easing: ease });
  const wordmarkIn = interpolate(frame, [t.wordmarkIn, t.wordmarkIn + 24], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const logoOpacity = interpolate(frame, [t.logoOut, t.logoOut + 16], [1, 0], clamp);
  const graphicVisible = frame >= t.rings[0] && logoOpacity > 0;
  const titleIn = spring({ frame: frame - t.titleIn, fps, config: { damping: 18, stiffness: 130 } });
  const titleOpacity = interpolate(frame, [t.titleIn, t.titleIn + 10], [0, 1], clamp);

  const centred: React.CSSProperties = { position: "absolute", left: 0, right: 0, display: "flex", justifyContent: "center" };

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

      {/* 1. The stack: lines typed in one by one, top to bottom, each becoming its ring label while the ring grows */}
      {INTRO_HOOK.map((item, i) => {
        if (frame < t.stackIn[i] || frame > t.labelsOut + 14) return null;
        const become = interpolate(frame, [t.rings[i], t.rings[i] + t.becomeFrames], [0, 1], { ...clamp, easing: ease });
        const y = lerp(lineY[item.key], labelY[item.key], settle);
        const lineOpacity = interpolate(become, [0, 0.45], [1, 0], clamp);
        const lineScale = lerp(1, 0.85, Math.min(1, become * 2));
        const labelIn = interpolate(become, [0.7, 1], [0, 1], clamp);
        const onDot = item.key === "dot";
        return (
          <div key={item.key}>
            {lineOpacity > 0 ? (
              <div
                style={{
                  position: "absolute",
                  left: cx,
                  top: y,
                  transform: `translate(-50%, -50%) scale(${lineScale})`,
                  opacity: lineOpacity,
                }}
              >
                <Line text={item.text} font={textFont} typedStart={t.stackIn[i]} charsPerFrame={1.8} />
              </div>
            ) : null}
            {labelIn > 0 ? (
              <div
                style={{
                  position: "absolute",
                  left: cx,
                  top: y,
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

      {/* 2. Closing title */}
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
              transform: `translateY(${(1 - titleIn) * 22}px)`,
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
