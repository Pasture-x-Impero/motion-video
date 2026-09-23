import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, fontFamily } from "../brand";
import { CTA } from "../content";
import { Body, FadeUp, Heading, Icon, Stage, useLayout } from "../components";

export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isWide } = useLayout();
  const boxIn = spring({ frame, fps, config: { damping: 22, stiffness: 90 } });

  return (
    <Stage>
      <div
        style={{
          flex: 1,
          backgroundColor: COLORS.copper,
          borderRadius: 36,
          padding: isWide ? "48px 64px" : "64px 60px",
          display: "flex",
          flexDirection: isWide ? "row" : "column",
          gap: isWide ? 60 : 0,
          transform: `scale(${0.94 + boxIn * 0.06})`,
          opacity: boxIn,
          transformOrigin: "center",
        }}
      >
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Heading delay={8}>{CTA.heading}</Heading>
          <FadeUp delay={18} style={{ marginTop: 28, maxWidth: 820 }}>
            <Body size={isWide ? 30 : 36} color={COLORS.white}>
              {CTA.text}
            </Body>
          </FadeUp>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: isWide ? "center" : "flex-end",
            gap: isWide ? 30 : 40,
            marginTop: isWide ? 0 : 40,
          }}
        >
          {CTA.contacts.map((c, i) => (
            <FadeUp key={c.text} delay={34 + i * 12} from="left" distance={50}>
              <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                <Icon icon={c.icon} color={COLORS.teal} size={isWide ? 52 : 60} />
                <div
                  style={{
                    fontFamily,
                    fontWeight: 700,
                    fontSize: isWide ? 38 : 44,
                    color: COLORS.teal,
                  }}
                >
                  {c.text}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </Stage>
  );
};
