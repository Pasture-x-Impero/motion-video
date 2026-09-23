import { COLORS } from "../brand";
import { WHY, WHY_HEADING } from "../content";
import { Heading, ListRow, Stage, useLayout } from "../components";

export const WhyUs: React.FC = () => {
  const { isWide } = useLayout();
  return (
    <Stage style={isWide ? { flexDirection: "row", alignItems: "center", gap: 60 } : undefined}>
      <div style={{ flex: isWide ? "0 0 40%" : undefined }}>
        <Heading>{WHY_HEADING}</Heading>
      </div>
      <div
        style={{
          marginTop: isWide ? 40 : 80,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: isWide ? 32 : 68,
        }}
      >
        {WHY.map((item, i) => (
          <ListRow
            key={item.title}
            icon={item.icon}
            color={COLORS.turquoise}
            title={item.title}
            text={item.text}
            delay={18 + i * 14}
          />
        ))}
      </div>
    </Stage>
  );
};
