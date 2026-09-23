import type { CSSProperties, PropsWithChildren } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, LOGOS, fontFamily } from "../brand";

/** Layout metrics shared by all scenes, derived from the composition size. */
export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const isWide = width > height;
  const pad = Math.round(width * 0.056); // 60px at 1080 wide
  return {
    width,
    height,
    isWide,
    pad,
    logoTop: Math.round(height * 0.044),
    logoHeight: isWide ? 64 : 74,
    contentTop: isWide ? 170 : 240,
    maxContentWidth: isWide ? 1400 : width - pad * 2,
  };
};

/** Full frame background with padding and the brand font applied. */
export const Stage: React.FC<
  PropsWithChildren<{ background?: string; style?: CSSProperties; darkLogos?: boolean }>
> = ({ children, background = COLORS.white, style, darkLogos = false }) => {
  const { pad, contentTop, maxContentWidth } = useLayout();
  return (
    <AbsoluteFill style={{ backgroundColor: background, fontFamily }}>
      <Logos dark={darkLogos} />
      <div
        style={{
          position: "absolute",
          left: pad,
          right: pad,
          top: contentTop,
          bottom: pad,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          maxWidth: maxContentWidth,
          margin: "0 auto",
          ...style,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

/** Impero (left) and Serit (right) logos at the top, fading in. */
export const Logos: React.FC<{ dark?: boolean; delay?: number }> = ({
  dark = false,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { pad, logoTop, logoHeight, width, maxContentWidth } = useLayout();
  const opacity = interpolate(frame - delay, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const impero = staticFile(dark ? LOGOS.imperoWhite : LOGOS.imperoColor);
  const serit = staticFile(dark ? LOGOS.seritWhite : LOGOS.seritColor);
  const sidePad = Math.max(pad, (width - maxContentWidth) / 2);
  return (
    <div
      style={{
        position: "absolute",
        top: logoTop,
        left: sidePad,
        right: sidePad,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        opacity,
        transform: `translateY(${(1 - y) * -12}px)`,
      }}
    >
      <Img src={impero} style={{ height: logoHeight }} />
      <Img src={serit} style={{ height: logoHeight * 0.92 }} />
    </div>
  );
};

/** Wraps children in a spring driven fade and rise. */
export const FadeUp: React.FC<
  PropsWithChildren<{
    delay?: number;
    distance?: number;
    style?: CSSProperties;
    from?: "up" | "left" | "right";
  }>
> = ({ children, delay = 0, distance = 40, style, from = "up" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 120, mass: 0.8 },
  });
  const opacity = interpolate(frame - delay, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const offset = (1 - progress) * distance;
  const transform =
    from === "up"
      ? `translateY(${offset}px)`
      : from === "left"
        ? `translateX(${-offset}px)`
        : `translateX(${offset}px)`;
  return <div style={{ opacity, transform, ...style }}>{children}</div>;
};

/** Section heading in Inter Black, teal by default. */
export const Heading: React.FC<
  PropsWithChildren<{ size?: number; color?: string; delay?: number; style?: CSSProperties }>
> = ({ children, size, color = COLORS.teal, delay = 0, style }) => {
  const { isWide } = useLayout();
  return (
    <FadeUp delay={delay}>
      <h1
        style={{
          fontFamily,
          fontWeight: 900,
          fontSize: size ?? (isWide ? 64 : 62),
          lineHeight: 1.1,
          letterSpacing: -1,
          color,
          margin: 0,
          ...style,
        }}
      >
        {children}
      </h1>
    </FadeUp>
  );
};

/** Body copy in Inter Regular. */
export const Body: React.FC<
  PropsWithChildren<{ size?: number; color?: string; style?: CSSProperties }>
> = ({ children, size = 30, color = COLORS.dark, style }) => (
  <p
    style={{
      fontFamily,
      fontWeight: 400,
      fontSize: size,
      lineHeight: 1.4,
      color,
      margin: 0,
      ...style,
    }}
  >
    {children}
  </p>
);

/** Lucide icon with brand stroke settings. */
export const Icon: React.FC<{ icon: LucideIcon; color: string; size?: number }> = ({
  icon: LucideIconComponent,
  color,
  size = 72,
}) => <LucideIconComponent color={color} size={size} strokeWidth={1.6} />;

/** Icon plus title plus text row, sliding in from the left. */
export const ListRow: React.FC<{
  icon: LucideIcon;
  color: string;
  title: string;
  text: string;
  delay: number;
  titleColor?: string;
  textColor?: string;
}> = ({ icon, color, title, text, delay, titleColor = COLORS.teal, textColor = COLORS.dark }) => {
  const { isWide } = useLayout();
  const iconSize = isWide ? 60 : 72;
  return (
    <FadeUp delay={delay} from="left" distance={60}>
      <div style={{ display: "flex", alignItems: "center", gap: isWide ? 28 : 36 }}>
        <div style={{ width: iconSize, height: iconSize, flexShrink: 0, display: "flex" }}>
          <Icon icon={icon} color={color} size={iconSize} />
        </div>
        <div>
          <div
            style={{
              fontFamily,
              fontWeight: 900,
              fontSize: isWide ? 34 : 38,
              color: titleColor,
              lineHeight: 1.15,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontFamily,
              fontWeight: 400,
              fontSize: isWide ? 24 : 28,
              color: textColor,
              lineHeight: 1.3,
              marginTop: 4,
            }}
          >
            {text}
          </div>
        </div>
      </div>
    </FadeUp>
  );
};
