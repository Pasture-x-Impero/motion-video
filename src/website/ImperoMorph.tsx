import { COLORS, fontFamily } from "../brand";
import { SITE_HERO } from "./content";

/**
 * The animated hero graphic from impero.no, rebuilt frame by frame.
 * progress 0 = three labelled rings ("Utvikling", "Drift", "Utstyr"),
 * progress 1 = the Impero icon.
 *
 * The motion follows the site's CSS keyframes. The icon state is fitted to the
 * icon in the logo file (public/logo/impero_farge.png) so the intro can build
 * the logo out of this SVG with no visible seam:
 *   ring thickness 10.6 % of the outer diameter, outer gap 31.7 degrees centred
 *   12.4 degrees above the right, inner arc 144 degrees centred on top, dot
 *   radius 16.4 % of the outer radius.
 */
export const MORPH = {
  viewW: 680,
  viewH: 600,
  cx: 340,
  cy: 300,
  outerR: 226,
  innerR: 120.5,
  stroke: 53.4,
  dotR: 41,
  outerGap: 12.5, // percent of the path
  innerGap: 67,
  outerSpin: 370.25, // degrees at progress 1
  innerSpin: 570.9,
  /** Outer diameter of the icon in viewBox units, including the stroke. */
  iconDiameter: 2 * (226 + 53.4 / 2),
};

type Parts = { outer?: number; inner?: number; dot?: number };

export const ImperoMorph: React.FC<{
  progress: number;
  /** One opacity for all three labels, or one per label. */
  labelOpacity: number | Parts;
  width: number;
  /** Per element scale in (0 = hidden, 1 = shown). Used when the rings appear one by one. */
  parts?: Parts;
}> = ({ progress: p, labelOpacity, width, parts }) => {
  // Colours flip at the midpoint of the motion: a blend would pass through muddy midtones.
  const outerColor = p < 0.5 ? COLORS.copper : COLORS.turquoise;
  const dotColor = p < 0.5 ? COLORS.teal : COLORS.turquoise;
  const outerGap = MORPH.outerGap * p;
  const innerGap = MORPH.innerGap * p;
  const { outer, inner, dot } = SITE_HERO.morphLabels;
  const { cx, cy } = MORPH;
  const labels: Required<Parts> =
    typeof labelOpacity === "number"
      ? { outer: labelOpacity, inner: labelOpacity, dot: labelOpacity }
      : { outer: labelOpacity.outer ?? 1, inner: labelOpacity.inner ?? 1, dot: labelOpacity.dot ?? 1 };
  const show: Required<Parts> = { outer: parts?.outer ?? 1, inner: parts?.inner ?? 1, dot: parts?.dot ?? 1 };
  const grow = (k: number) => `translate(${cx} ${cy}) scale(${0.6 + 0.4 * k}) translate(${-cx} ${-cy})`;

  return (
    <svg
      viewBox={`0 0 ${MORPH.viewW} ${MORPH.viewH}`}
      width={width}
      height={(width * MORPH.viewH) / MORPH.viewW}
      style={{ display: "block" }}
    >
      <g transform={grow(show.outer)} opacity={show.outer}>
        <circle
          cx={cx}
          cy={cy}
          r={MORPH.outerR}
          fill="none"
          stroke={outerColor}
          strokeWidth={MORPH.stroke}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${100 - outerGap} ${outerGap}`}
          transform={`rotate(${MORPH.outerSpin * p} ${cx} ${cy})`}
        />
      </g>
      <g transform={grow(show.inner)} opacity={show.inner}>
        <circle
          cx={cx}
          cy={cy}
          r={MORPH.innerR}
          fill="none"
          stroke={COLORS.turquoise}
          strokeWidth={MORPH.stroke}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${100 - innerGap} ${innerGap}`}
          transform={`rotate(${MORPH.innerSpin * p} ${cx} ${cy})`}
        />
      </g>
      <g transform={grow(show.dot)} opacity={show.dot}>
        <circle cx={cx} cy={cy} r={MORPH.dotR} fill={dotColor} />
      </g>
      <g style={{ fontFamily, fontWeight: 900 }}>
        <text x={cx} y={cy - MORPH.outerR} textAnchor="middle" dominantBaseline="central" fill={COLORS.teal} fontSize={20} opacity={labels.outer}>
          {outer}
        </text>
        <text x={cx} y={cy - MORPH.innerR} textAnchor="middle" dominantBaseline="central" fill={COLORS.teal} fontSize={20} opacity={labels.inner}>
          {inner}
        </text>
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill={COLORS.white} fontSize={18} opacity={labels.dot}>
          {dot}
        </text>
      </g>
    </svg>
  );
};
