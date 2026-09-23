import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, LOGOS } from "../../brand";
import { useLayout } from "../../components";
import { ImperoMorph, MORPH } from "../ImperoMorph";
import { HeroCopy } from "./SiteHero";

/**
 * Intro: blank white, the logo appears in the centre, the camera zooms into the
 * icon, the icon spins out into the three rings (Utvikling, Drift, Utstyr), and
 * the rings make room for "Din IT-avdeling".
 *
 * The logo is composed of the morph SVG (icon state) plus the wordmark cropped
 * from the logo PNG, so there is no image swap during the zoom. Measurements of
 * the PNG (1322 x 313): icon centre (149, 150.5), icon outer diameter 293.5,
 * wordmark starts at x = 383.
 */
const LOGO_W = 1322;
const LOGO_H = 313;
const ICON_CX = 149;
const ICON_CY = 150.5;
const ICON_D = 293.5;
const WORDMARK_CROP_X = 340;

export const INTRO_TIMING = {
  logoIn: 20,
  zoomStart: 85,
  zoomEnd: 150,
  morphStart: 160,
  morphEnd: 230,
  labelsIn: 215,
  shiftStart: 265,
  shiftEnd: 305,
  copyIn: 285,
  duration: 400,
};

export const SiteIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isWide, width, height, pad, maxContentWidth } = useLayout();
  const t = INTRO_TIMING;

  // Size of the ring graphic once the zoom is done (same as the hero scene).
  const svgWidth = isWide ? 720 : Math.min(width - 200, 700);

  // Logo as first shown, centred in the frame.
  const logoW = isWide ? 820 : Math.min(width - 160, 760);
  const s = logoW / LOGO_W;
  const logoH = LOGO_H * s;
  const iconCx = ICON_CX * s;
  const iconCy = ICON_CY * s;
  // Width of the morph SVG so that its icon has the same diameter as the icon in the logo.
  const iconSvgW = (ICON_D * s * MORPH.viewW) / MORPH.iconDiameter;
  const iconSvgH = (iconSvgW * MORPH.viewH) / MORPH.viewW;
  const zoomFactor = svgWidth / iconSvgW;
  // Offset of the icon centre from the frame centre while the logo is centred.
  const ox = iconCx - logoW / 2;
  const oy = iconCy - logoH / 2;

  // 1. Logo appears
  const logoIn = spring({ frame: frame - t.logoIn, fps, config: { damping: 24, stiffness: 70 } });
  const logoOpacity = interpolate(frame, [t.logoIn, t.logoIn + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 2. Zoom into the icon (scale about the icon centre, move it to the frame centre)
  const q = interpolate(frame, [t.zoomStart, t.zoomEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const z = 1 + (zoomFactor - 1) * q;
  const wordmarkOpacity = interpolate(q, [0.55, 0.9], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 3. Icon spins out into the rings (progress 1 -> 0)
  const progress = interpolate(frame, [t.morphStart, t.morphEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const labelOpacity = interpolate(frame, [t.labelsIn, t.labelsIn + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 4. Rings move aside and "Din IT-avdeling" comes in
  const shift = interpolate(frame, [t.shiftStart, t.shiftEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const sidePad = Math.max(pad, (width - maxContentWidth) / 2);
  const endScale = isWide ? 0.95 : 0.82;
  const dx = isWide ? width * 0.2 : 0;
  const dy = isWide ? 0 : -height * 0.175;

  const tx = -ox * q + dx * shift;
  const ty = -oy * q + dy * shift;
  const scale = z * (0.9 + logoIn * 0.1) * (1 - (1 - endScale) * shift);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.white }}>
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
          {/* Wordmark and tagline, cropped from the logo file */}
          <div
            style={{
              position: "absolute",
              left: WORDMARK_CROP_X * s,
              top: 0,
              width: logoW - WORDMARK_CROP_X * s,
              height: logoH,
              overflow: "hidden",
              opacity: wordmarkOpacity,
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
            }}
          >
            <ImperoMorph progress={progress} labelOpacity={labelOpacity} width={iconSvgW} />
          </div>
        </div>
      </AbsoluteFill>

      {/* Hero copy */}
      <div
        style={{
          position: "absolute",
          left: sidePad,
          ...(isWide
            ? { top: "50%", transform: "translateY(-50%)", width: width * 0.42 }
            : { top: height * 0.6, right: sidePad }),
        }}
      >
        {frame >= t.copyIn ? <HeroCopy delay={t.copyIn} /> : null}
      </div>
    </AbsoluteFill>
  );
};
