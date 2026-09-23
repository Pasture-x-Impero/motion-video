import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, fontFamily } from "../brand";
import { CIRCLE, SERVICES } from "../content";
import { Body, FadeUp, Heading, Icon, Stage, useLayout } from "../components";

export const Circle365: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isWide } = useLayout();

  const s = isWide ? 0.72 : 1; // overall scale of the diagram
  const R = 250 * s; // node orbit radius
  const outer = 620 * s; // mint disc diameter
  const inner = 430 * s; // white disc diameter
  const node = 150 * s;
  const labelGap = 18 * s;

  const ringIn = spring({ frame: frame - 6, fps, config: { damping: 20, stiffness: 90 } });
  const labelIn = spring({ frame: frame - 28, fps, config: { damping: 200 } });
  const box = 2 * R + node + 200 * s; // reserved space incl. labels

  return (
    <Stage style={isWide ? { flexDirection: "row", alignItems: "center", gap: 40 } : undefined}>
      <div style={{ flex: isWide ? "0 0 46%" : undefined }}>
        <Heading>{CIRCLE.heading}</Heading>
        <FadeUp delay={10} style={{ marginTop: 20, maxWidth: 880 }}>
          <Body size={isWide ? 28 : 32}>{CIRCLE.subtitle}</Body>
        </FadeUp>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: isWide ? undefined : box,
        }}
      >
        <div
          style={{
            position: "relative",
            width: box,
            height: box,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Mint disc, white inner disc and thin teal outline */}
          <div
            style={{
              position: "absolute",
              width: outer,
              height: outer,
              borderRadius: "50%",
              backgroundColor: COLORS.mint,
              transform: `scale(${ringIn})`,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: outer + 16 * s,
              height: outer + 16 * s,
              borderRadius: "50%",
              border: `${2.5 * s}px solid ${COLORS.teal}`,
              transform: `scale(${ringIn})`,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: inner,
              height: inner,
              borderRadius: "50%",
              backgroundColor: COLORS.white,
              transform: `scale(${spring({ frame: frame - 14, fps, config: { damping: 20, stiffness: 90 } })})`,
            }}
          />
          <div
            style={{
              position: "absolute",
              fontFamily,
              fontWeight: 900,
              fontSize: 60 * s,
              color: COLORS.teal,
              letterSpacing: -1,
              opacity: labelIn,
              transform: `scale(${0.8 + labelIn * 0.2})`,
            }}
          >
            {CIRCLE.center}
          </div>

          {SERVICES.map((svc, i) => {
            const rad = (svc.angle * Math.PI) / 180;
            const x = R * Math.cos(rad);
            const y = -R * Math.sin(rad);
            const pop = spring({
              frame: frame - (40 + i * 12),
              fps,
              config: { damping: 11, stiffness: 140, mass: 0.7 },
            });
            const labelStyle: React.CSSProperties = {
              position: "absolute",
              fontFamily,
              fontWeight: 700,
              fontSize: 28 * s,
              color: COLORS.teal,
              whiteSpace: "nowrap",
              opacity: pop,
            };
            if (svc.labelSide === "top") {
              Object.assign(labelStyle, {
                bottom: `calc(100% + ${labelGap}px)`,
                left: "50%",
                transform: "translateX(-50%)",
              });
            } else if (svc.labelSide === "right") {
              Object.assign(labelStyle, { left: `calc(100% + ${labelGap}px)`, top: "50%", transform: "translateY(-50%)" });
            } else {
              Object.assign(labelStyle, { right: `calc(100% + ${labelGap}px)`, top: "50%", transform: "translateY(-50%)" });
            }
            return (
              <div
                key={svc.title}
                style={{
                  position: "absolute",
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  width: 0,
                  height: 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: -node / 2,
                    top: -node / 2,
                    width: node,
                    height: node,
                    borderRadius: "50%",
                    backgroundColor: svc.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `scale(${pop})`,
                  }}
                >
                  <Icon icon={svc.icon} color={svc.iconColor} size={64 * s} />
                  <div style={labelStyle}>{svc.title}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Stage>
  );
};
