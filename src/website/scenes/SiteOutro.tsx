import { Globe, Mail, MapPin, Phone } from "lucide-react";
import { Img, staticFile } from "remotion";
import { COLORS, LOGOS, fontFamily } from "../../brand";
import { FadeUp, Stage, useLayout } from "../../components";
import { SITE_OUTRO } from "../content";

const ContactLine: React.FC<{ icon: typeof Phone; text: string; delay: number }> = ({ icon: IconComponent, text, delay }) => {
  const { isWide } = useLayout();
  return (
    <FadeUp delay={delay} from="left" distance={30}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          backgroundColor: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 16,
          padding: isWide ? "14px 22px" : "16px 24px",
          fontFamily,
          fontSize: isWide ? 24 : 27,
          color: "rgba(255,255,255,0.9)",
        }}
      >
        <IconComponent size={isWide ? 24 : 26} color="rgba(255,255,255,0.7)" strokeWidth={1.75} />
        {text}
      </div>
    </FadeUp>
  );
};

export const SiteOutro: React.FC = () => {
  const { isWide } = useLayout();
  return (
    <Stage background={COLORS.teal} logos={false} style={{ justifyContent: "center", top: 0 }}>
      <div
        style={{
          display: "flex",
          flexDirection: isWide ? "row" : "column",
          gap: isWide ? 80 : 56,
          alignItems: isWide ? "center" : "flex-start",
        }}
      >
        <div style={{ flex: 1 }}>
          <FadeUp delay={4}>
            <Img src={staticFile(LOGOS.imperoWhite)} style={{ height: isWide ? 96 : 110 }} />
          </FadeUp>
          <FadeUp delay={16} style={{ marginTop: 40 }}>
            <div
              style={{
                fontFamily,
                fontWeight: 900,
                fontSize: isWide ? 72 : 80,
                letterSpacing: -2,
                lineHeight: 1.05,
                color: COLORS.white,
              }}
            >
              {SITE_OUTRO.tagline}
            </div>
          </FadeUp>
          <FadeUp delay={26} style={{ marginTop: 22, maxWidth: 760 }}>
            <p
              style={{
                fontFamily,
                fontSize: isWide ? 28 : 31,
                lineHeight: 1.4,
                color: "rgba(255,255,255,0.8)",
                margin: 0,
              }}
            >
              {SITE_OUTRO.mission}
            </p>
          </FadeUp>
        </div>
        <div style={{ flex: isWide ? "0 0 42%" : undefined, display: "flex", flexDirection: "column", gap: 16, width: isWide ? undefined : "100%" }}>
          <ContactLine icon={Phone} text={SITE_OUTRO.phone} delay={36} />
          <ContactLine icon={Mail} text={SITE_OUTRO.email} delay={44} />
          <ContactLine icon={MapPin} text={SITE_OUTRO.address} delay={52} />
          <ContactLine icon={Globe} text={SITE_OUTRO.web} delay={60} />
          <FadeUp delay={72} style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 20 }}>
            <Img src={staticFile(LOGOS.seritWhite)} style={{ height: isWide ? 44 : 50 }} />
            <span style={{ fontFamily, fontSize: isWide ? 22 : 24, color: COLORS.turquoise }}>{SITE_OUTRO.serit}</span>
          </FadeUp>
        </div>
      </div>
    </Stage>
  );
};
