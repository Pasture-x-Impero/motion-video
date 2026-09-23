import type { CSSProperties, PropsWithChildren } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { COLORS, fontFamily } from "../brand";
import { useLayout } from "../components";

/** Colours that only exist on the website, derived from its CSS tokens. */
export const SITE = {
  // bg-secondary/40 on white
  mint40: "#C5E9EA",
  // hsl(16 15% 80%) at 30% opacity on white
  cardBorder: "rgba(209, 197, 192, 0.3)",
  cardShadow: "0 10px 15px -3px rgba(17, 54, 62, 0.10), 0 4px 6px -4px rgba(17, 54, 62, 0.10)",
  foreground80: "rgba(17, 54, 62, 0.8)",
  foreground70: "rgba(17, 54, 62, 0.7)",
};

export const VARIANT: Record<"primary" | "secondary" | "coral", { bg: string; icon: string }> = {
  primary: { bg: COLORS.teal, icon: COLORS.turquoise },
  secondary: { bg: COLORS.turquoise, icon: COLORS.teal },
  coral: { bg: COLORS.copper, icon: COLORS.white },
};

/** The site's section label: uppercase pill with a thin border. */
export const Pill: React.FC<PropsWithChildren<{ color?: string; style?: CSSProperties }>> = ({
  children,
  color = COLORS.turquoise,
  style,
}) => {
  const { isWide } = useLayout();
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily,
        fontWeight: 500,
        fontSize: isWide ? 20 : 22,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color,
        border: `2px solid ${color}`,
        borderRadius: 999,
        padding: "6px 18px",
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/** White card with the site's radius, border and shadow. */
export const Card: React.FC<PropsWithChildren<{ style?: CSSProperties; background?: string }>> = ({
  children,
  style,
  background = COLORS.white,
}) => (
  <div
    style={{
      backgroundColor: background,
      borderRadius: 24,
      border: `1px solid ${SITE.cardBorder}`,
      boxShadow: SITE.cardShadow,
      padding: 32,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Card content used for services and values on the site: icon, title, description. */
export const IconCard: React.FC<{
  icon: LucideIcon;
  iconColor: string;
  title: string;
  text: string;
  compact?: boolean;
}> = ({ icon: IconComponent, iconColor, title, text, compact = false }) => {
  const { isWide } = useLayout();
  const titleSize = compact ? 28 : isWide ? 30 : 34;
  const textSize = compact ? 22 : isWide ? 23 : 26;
  return (
    <Card style={{ padding: compact ? "22px 28px" : isWide ? "26px 32px" : "30px 34px", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: compact ? 8 : 12 }}>
        <IconComponent color={iconColor} size={compact ? 34 : 40} strokeWidth={1.75} />
        <div style={{ fontFamily, fontWeight: 900, fontSize: titleSize, color: COLORS.teal, lineHeight: 1.15 }}>
          {title}
        </div>
      </div>
      <div style={{ fontFamily, fontWeight: 400, fontSize: textSize, color: SITE.foreground80, lineHeight: 1.4 }}>
        {text}
      </div>
    </Card>
  );
};

/** The site's "teal" button variant. */
export const TealButton: React.FC<
  PropsWithChildren<{ arrow?: boolean; style?: CSSProperties; variant?: "teal" | "coral" }>
> = ({ children, arrow = true, style, variant = "teal" }) => {
  const { isWide } = useLayout();
  const coral = variant === "coral";
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        backgroundColor: coral ? COLORS.copper : COLORS.turquoise,
        color: coral ? COLORS.white : COLORS.teal,
        boxShadow: coral ? SITE.cardShadow : undefined,
        fontFamily,
        fontWeight: 600,
        fontSize: isWide ? 24 : 27,
        borderRadius: 14,
        padding: isWide ? "16px 30px" : "18px 34px",
        ...style,
      }}
    >
      {children}
      {arrow ? <ArrowRight size={isWide ? 22 : 24} strokeWidth={2.2} /> : null}
    </div>
  );
};

/** Renders "text with **bold** parts" the way the site does. */
export const RichText: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split("**").map((part, i) =>
      i % 2 === 1 ? (
        <strong key={i} style={{ fontWeight: 700 }}>
          {part}
        </strong>
      ) : (
        <span key={i}>{part}</span>
      ),
    )}
  </>
);
