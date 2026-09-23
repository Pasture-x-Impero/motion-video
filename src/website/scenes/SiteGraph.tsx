import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, fontFamily } from "../../brand";
import { FadeUp, Heading, Stage, useLayout } from "../../components";
import { SITE_GRAPH } from "../content";
import { Pill, SITE, VARIANT } from "../ui";

/**
 * The rising service graph from impero.no (DigitalServicesGrid.tsx): axes with arrows,
 * a line climbing from the origin and one node per service along it.
 */
export const SiteGraph: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isWide } = useLayout();

  const width = 800;
  const height = 500;
  const padding = { top: 30, right: 40, bottom: 60, left: 30 };
  const graphW = width - padding.left - padding.right;
  const graphH = height - padding.top - padding.bottom;
  const nodes = SITE_GRAPH.nodes;
  const maxVal = nodes.length + 0.3;
  const pos = (i: number) => {
    const t = (i + 1) / maxVal;
    return { x: padding.left + t * graphW, y: padding.top + graphH - t * graphH };
  };
  const originX = padding.left;
  const originY = padding.top + graphH;
  const endX = padding.left + graphW;
  const endY = padding.top;
  const linePath = [`M ${originX} ${originY}`, ...nodes.map((_, i) => `L ${pos(i).x} ${pos(i).y}`), `L ${endX} ${endY}`].join(" ");

  const axesIn = interpolate(frame, [8, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineDrawStart = 30;
  const lineDrawEnd = 120;
  const lineProgress = interpolate(frame, [lineDrawStart, lineDrawEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const svgWidth = isWide ? 900 : 940;
  const nodeSize = 76;

  return (
    <Stage style={isWide ? { flexDirection: "row", alignItems: "center", gap: 48 } : { justifyContent: "center" }}>
      <div style={{ flex: isWide ? "0 0 40%" : undefined }}>
        <FadeUp delay={0}>
          <Pill color={COLORS.copper}>{SITE_GRAPH.label}</Pill>
        </FadeUp>
        <Heading size={isWide ? 48 : 50} delay={6} style={{ marginTop: 18 }}>
          {SITE_GRAPH.heading}
        </Heading>
        <FadeUp delay={16} style={{ marginTop: 18, maxWidth: 900 }}>
          <p style={{ fontFamily, fontSize: isWide ? 24 : 27, lineHeight: 1.4, color: COLORS.teal, margin: 0 }}>
            {SITE_GRAPH.text}
          </p>
        </FadeUp>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: isWide ? 0 : 30,
        }}
      >
        <div style={{ position: "relative", width: svgWidth, aspectRatio: `${width} / ${height}` }}>
          <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
            <g opacity={axesIn}>
              <line x1={padding.left} y1={padding.top - 10} x2={padding.left} y2={originY} stroke={COLORS.teal} strokeWidth={2} />
              <polygon
                points={`${padding.left},${padding.top - 16} ${padding.left - 5},${padding.top - 6} ${padding.left + 5},${padding.top - 6}`}
                fill={COLORS.teal}
              />
              <line x1={padding.left} y1={originY} x2={endX + 10} y2={originY} stroke={COLORS.teal} strokeWidth={2} />
              <polygon
                points={`${endX + 16},${originY} ${endX + 6},${originY - 5} ${endX + 6},${originY + 5}`}
                fill={COLORS.teal}
              />
            </g>
            <path
              d={linePath}
              fill="none"
              stroke={COLORS.turquoise}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - lineProgress}
            />
          </svg>

          {nodes.map((node, i) => {
            const { x, y } = pos(i);
            // The node appears when the line reaches it.
            const reachAt = lineDrawStart + ((i + 1) / (nodes.length + 1)) * (lineDrawEnd - lineDrawStart) * 0.9;
            const pop = spring({ frame: frame - reachAt, fps, config: { damping: 12, stiffness: 150, mass: 0.7 } });
            const active = i === nodes.length - 1;
            const size = active ? nodeSize * 1.35 : nodeSize;
            const v = VARIANT[node.variant];
            const IconComponent = node.icon;
            return (
              <div key={node.title}>
                <div
                  style={{
                    position: "absolute",
                    left: `calc(${(x / width) * 100}% - ${size / 2}px)`,
                    top: `calc(${(y / height) * 100}% - ${size / 2}px)`,
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    backgroundColor: v.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: SITE.cardShadow,
                    transform: `scale(${pop})`,
                  }}
                >
                  <IconComponent color={v.icon} size={active ? 40 : 30} strokeWidth={1.75} />
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: `${(x / width) * 100}%`,
                    top: `calc(${(y / height) * 100}% + ${size / 2 + 12}px)`,
                    transform: "translateX(-50%)",
                    whiteSpace: "nowrap",
                    fontFamily,
                    fontWeight: active ? 700 : 500,
                    fontSize: active ? 26 : 22,
                    color: active ? COLORS.teal : SITE.foreground70,
                    opacity: pop,
                  }}
                >
                  {node.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Stage>
  );
};
