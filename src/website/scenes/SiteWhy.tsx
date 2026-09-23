import { COLORS } from "../../brand";
import { FadeUp, Heading, Stage, useLayout } from "../../components";
import { SITE_WHY } from "../content";
import { IconCard, TealButton } from "../ui";

export const SiteWhy: React.FC = () => {
  const { isWide } = useLayout();
  return (
    <Stage style={{ justifyContent: "center" }}>
      <Heading size={isWide ? 54 : 56}>{SITE_WHY.heading}</Heading>
      <div
        style={{
          marginTop: isWide ? 36 : 44,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: isWide ? 24 : 26,
        }}
      >
        {SITE_WHY.items.map((item, i) => (
          <FadeUp key={item.title} delay={18 + i * 12} distance={40}>
            <IconCard icon={item.icon} iconColor={COLORS.turquoise} title={item.title} text={item.text} compact={!isWide} />
          </FadeUp>
        ))}
      </div>
      <FadeUp delay={78} style={{ marginTop: isWide ? 36 : 44 }}>
        <TealButton>{SITE_WHY.button}</TealButton>
      </FadeUp>
    </Stage>
  );
};
