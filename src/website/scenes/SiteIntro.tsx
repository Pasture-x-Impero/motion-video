import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, LOGOS } from "../../brand";
import { useLayout } from "../../components";
import { ImperoMorph } from "../ImperoMorph";

/**
 * Intro: blank white, the logo appears in the centre, the camera zooms into the
 * icon, and the icon spins out into the three rings (Utvikling, Drift, Utstyr).
 *
 * Geometry of the logo PNG (1322 x 313): the icon sits in a 293 x 294 box with
 * its centre at (149, 150.5). The morph SVG (viewBox 680 x 600) draws the icon
 * with an outer diameter of 500 units around (340, 300).
 */
const LOGO_W = 1322;
const LOGO_H = 313;
const ICON_CX = 149;
const ICON_CY = 150.5;
const ICON_D = 293.5;
const SVG_ICON_D = 500;
const SVG_W = 680;
const SVG_H = 600;

export const INTRO_TIMING = {
  logoIn: 20,
  zoomStart: 80,
  zoomEnd: 140,
  morphStart: 150,
  morphEnd: 220,
  labelsIn: 205,
  duration: 260,
};

export const SiteIntro: React.FC<{ graphicWidth?: number }> = ({ graphicWidth }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isWide, width } = useLayout();
  const t = INTRO_TIMING;

  // Final size of the ring graphic, same as in the hero scene.
  const svgWidth = graphicWidth ?? (isWide ? 720 : Math.min(width - 200, 700));
  const finalIconD = (svgWidth * SVG_ICON_D) / SVG_W;

  // Logo as first shown, centred.
  const logoW = isWide ? 820 : Math.min(width - 160, 760);
  const s = logoW / LOGO_W;
  const logoH = LOGO_H * s;
  const iconDisplayD = ICON_D * s;
  // Offset of the icon centre from the logo centre, in display pixels.
  const ox = ICON_CX * s - logoW / 2;
  const oy = ICON_CY * s - logoH / 2;
  const zoomFactor = finalIconD / iconDisplayD;

  // 1. Logo appears
  const logoIn = spring({ frame: frame - t.logoIn, fps, config: { damping: 24, stiffness: 70 } });
  const logoOpacity = interpolate(frame, [t.logoIn, t.logoIn + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 2. Zoom into the icon
  const q = interpolate(frame, [t.zoomStart, t.zoomEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const z = 1 + (zoomFactor - 1) * q;
  const tx = -ox * z * q;
  const ty = -oy * z * q;

  // Cross fade from the PNG icon to the SVG icon at the end of the zoom
  const svgOpacity = interpolate(frame, [t.zoomEnd - 14, t.zoomEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pngOpacity = 1 - svgOpacity;

  // 3. Icon spins out into the rings (morph progress 1 -> 0)
  const progress = interpolate(frame, [t.morphStart, t.morphEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const labelOpacity = interpolate(frame, [t.labelsIn, t.labelsIn + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const svgHeight = (svgWidth * SVG_H) / SVG_W;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.white }}>
      {/* Logo PNG, zoomed towards the icon */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            width: logoW,
            height: logoH,
            opacity: logoOpacity * pngOpacity,
            transform: `translate(${tx}px, ${ty}px) scale(${z * (0.9 + logoIn * 0.1)})`,
            transformOrigin: "center",
          }}
        >
          <Img src={staticFile(LOGOS.imperoColor)} style={{ width: logoW, height: logoH, display: "block" }} />
        </div>
      </AbsoluteFill>

      {/* SVG icon that takes over and spins out into the rings */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: svgWidth, height: svgHeight, opacity: svgOpacity }}>
          <ImperoMorph progress={progress} labelOpacity={labelOpacity} width={svgWidth} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
