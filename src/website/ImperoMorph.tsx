import { interpolate, interpolateColors } from "remotion";
import { COLORS, fontFamily } from "../brand";
import { SITE_HERO } from "./content";

/**
 * The animated hero graphic from impero.no, rebuilt frame by frame.
 * progress 0 = three labelled rings ("Utvikling", "Drift", "Utstyr"),
 * progress 1 = the Impero icon (the site's CSS keyframes at 44%).
 * Geometry and dash values are the site's own (ImperoMorphGraphic.tsx, index.css).
 */
export const ImperoMorph: React.FC<{ progress: number; labelOpacity: number; width: number }> = ({
  progress: p,
  labelOpacity,
  width,
}) => {
  // Colours switch over the middle of the motion so the blend never lingers in muddy midtones.
  const colorMix = interpolate(p, [0.3, 0.65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outerColor = interpolateColors(colorMix, [0, 1], [COLORS.copper, COLORS.turquoise]);
  const dotColor = interpolateColors(colorMix, [0, 1], [COLORS.teal, COLORS.turquoise]);
  const outerGap = 12 * p;
  const innerGap = 66 * p;
  const { outer, inner, dot } = SITE_HERO.morphLabels;

  return (
    <svg viewBox="0 0 680 600" width={width} height={(width * 600) / 680} style={{ display: "block" }}>
      <g>
        <circle
          cx={340}
          cy={300}
          r={226}
          fill="none"
          stroke={outerColor}
          strokeWidth={48}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${100 - outerGap} ${outerGap}`}
          transform={`rotate(${369 * p} 340 300)`}
        />
        <circle
          cx={340}
          cy={300}
          r={118}
          fill="none"
          stroke={COLORS.turquoise}
          strokeWidth={48}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${100 - innerGap} ${innerGap}`}
          transform={`rotate(${569 * p} 340 300)`}
        />
        <circle cx={340} cy={300} r={36} fill={dotColor} />
      </g>
      <g opacity={labelOpacity} style={{ fontFamily, fontWeight: 900 }}>
        <text x={340} y={76} textAnchor="middle" dominantBaseline="central" fill={COLORS.teal} fontSize={20}>
          {outer}
        </text>
        <text x={340} y={182} textAnchor="middle" dominantBaseline="central" fill={COLORS.teal} fontSize={20}>
          {inner}
        </text>
        <text x={340} y={300} textAnchor="middle" dominantBaseline="central" fill={COLORS.white} fontSize={18}>
          {dot}
        </text>
      </g>
    </svg>
  );
};
