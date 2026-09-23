import { COLORS } from "../../brand";
import { FadeUp, Heading, Stage, useLayout } from "../../components";
import { SITE_SERVICES } from "../content";
import { IconCard, Pill, TealButton } from "../ui";

export const SiteServices: React.FC = () => {
  const { isWide } = useLayout();
  return (
    <Stage style={{ justifyContent: "center" }}>
      <FadeUp delay={0}>
        <Pill color={COLORS.copper}>{SITE_SERVICES.label}</Pill>
      </FadeUp>
      <Heading size={isWide ? 54 : 56} delay={6} style={{ marginTop: 18 }}>
        {SITE_SERVICES.heading}
      </Heading>
      <div
        style={{
          marginTop: isWide ? 32 : 40,
          display: "grid",
          gridTemplateColumns: isWide ? "1fr 1fr 1fr" : "1fr",
          gap: isWide ? 22 : 18,
        }}
      >
        {SITE_SERVICES.items.map((item, i) => (
          <FadeUp key={item.title} delay={20 + i * 10} from={isWide ? "up" : "left"} distance={40}>
            <IconCard icon={item.icon} iconColor={item.color} title={item.title} text={item.text} compact />
          </FadeUp>
        ))}
        {isWide ? (
          <FadeUp delay={72} style={{ display: "flex", alignItems: "center", paddingLeft: 12 }}>
            <TealButton>{SITE_SERVICES.button}</TealButton>
          </FadeUp>
        ) : null}
      </div>
      {isWide ? null : (
        <FadeUp delay={76} style={{ marginTop: 34 }}>
          <TealButton>{SITE_SERVICES.button}</TealButton>
        </FadeUp>
      )}
    </Stage>
  );
};
