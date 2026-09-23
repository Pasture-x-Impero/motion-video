import { COLORS } from "../brand";
import { SERVICES, SERVICES_HEADING } from "../content";
import { Heading, ListRow, Stage, useLayout } from "../components";

export const Services: React.FC = () => {
  const { isWide } = useLayout();
  return (
    <Stage style={isWide ? { flexDirection: "row", alignItems: "center", gap: 60 } : undefined}>
      <div style={{ flex: isWide ? "0 0 40%" : undefined }}>
        <Heading>{SERVICES_HEADING}</Heading>
      </div>
      <div
        style={{
          marginTop: isWide ? 36 : 60,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: isWide ? 26 : 44,
        }}
      >
        {SERVICES.map((svc, i) => (
          <ListRow
            key={svc.title}
            icon={svc.icon}
            color={svc.color === COLORS.teal ? COLORS.teal : svc.color}
            title={svc.title}
            text={svc.text}
            delay={18 + i * 12}
          />
        ))}
      </div>
    </Stage>
  );
};
