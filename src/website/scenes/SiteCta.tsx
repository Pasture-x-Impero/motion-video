import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, fontFamily } from "../../brand";
import { FadeUp, Heading, Stage, useLayout } from "../../components";
import { SITE_CTA } from "../content";
import { TealButton } from "../ui";

const Field: React.FC<{ label: string; placeholder: string; delay: number }> = ({ label, placeholder, delay }) => {
  const { isWide } = useLayout();
  return (
    <FadeUp delay={delay} distance={24}>
      <div style={{ fontFamily, fontWeight: 500, fontSize: isWide ? 20 : 22, color: COLORS.teal, marginBottom: 8 }}>
        {label}
      </div>
      <div
        style={{
          height: isWide ? 60 : 66,
          borderRadius: 12,
          backgroundColor: COLORS.white,
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          fontFamily,
          fontSize: isWide ? 21 : 23,
          color: "rgba(17, 54, 62, 0.45)",
        }}
      >
        {placeholder}
      </div>
    </FadeUp>
  );
};

export const SiteCta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isWide } = useLayout();
  const boxIn = spring({ frame, fps, config: { damping: 22, stiffness: 90 } });
  const [first, last, email] = SITE_CTA.fields;

  return (
    <Stage style={{ justifyContent: "center" }}>
      <div
        style={{
          backgroundColor: COLORS.copper,
          borderRadius: 24,
          padding: isWide ? "56px 64px" : "60px 56px",
          opacity: boxIn,
          transform: `translateY(${(1 - boxIn) * 30}px)`,
          display: "flex",
          flexDirection: isWide ? "row" : "column",
          gap: isWide ? 64 : 40,
          alignItems: isWide ? "center" : "stretch",
        }}
      >
        <div style={{ flex: 1 }}>
          <Heading size={isWide ? 58 : 60} delay={8}>
            {SITE_CTA.heading}
          </Heading>
          <FadeUp delay={18} style={{ marginTop: 22 }}>
            <p
              style={{
                fontFamily,
                fontSize: isWide ? 27 : 30,
                lineHeight: 1.4,
                color: "rgba(17, 54, 62, 0.8)",
                margin: 0,
              }}
            >
              {SITE_CTA.text}
            </p>
          </FadeUp>
        </div>
        <div style={{ flex: isWide ? "0 0 46%" : undefined, display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <Field {...first} delay={30} />
            <Field {...last} delay={36} />
          </div>
          <Field {...email} delay={42} />
          <FadeUp delay={54} style={{ marginTop: 6 }}>
            <TealButton arrow={false}>{SITE_CTA.button}</TealButton>
          </FadeUp>
        </div>
      </div>
    </Stage>
  );
};
