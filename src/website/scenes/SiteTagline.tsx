import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, LOGOS, fontFamily } from "../../brand";
import { useLayout } from "../../components";
import { Typed } from "./SiteIntro";

/**
 * Follow up to the intro, about 12 seconds
 *  1. The Impero logo on white.
 *  2. "IT-avdelingen for små og mellomstore bedrifter." typed in alone.
 *  3. "Vi hjelper deg å jobbe smartere med IT." typed in alone.
 *  4. The logo returns with impero.no underneath.
 * Same type size and pace as the intro, so the two cut together.
 */
export const TAGLINE_TEXT = {
  who: "IT-avdelingen for små og mellomstore bedrifter.",
  promise: "Vi hjelper deg å jobbe smartere med IT.",
  web: "impero.no",
};

export const TAGLINE_TIMING = {
  logoIn: 0,
  logoOut: 70,
  who: { in: 92, out: 166 },
  promise: { in: 180, out: 250 },
  logoBack: 262,
  webIn: 286,
  duration: 360,
};

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const ease = Easing.inOut(Easing.cubic);

/** Fade in and out with a small rise. */
const fadeIO = (frame: number, inAt: number, outAt: number) => ({
  opacity: interpolate(frame, [inAt, inAt + 8, outAt, outAt + 8], [0, 1, 1, 0], clamp),
  lift: interpolate(frame, [inAt, inAt + 10], [12, 0], clamp) + interpolate(frame, [outAt, outAt + 8], [0, -10], clamp),
});

export const SiteTagline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isWide, width, height } = useLayout();
  const t = TAGLINE_TIMING;
  const cy = height / 2;

  const textFont = isWide ? 52 : 44;
  // Narrow enough that each sentence breaks into two balanced lines in portrait
  const whoWidth = isWide ? 1300 : 720;
  const promiseWidth = isWide ? 1300 : 620;
  const logoW = isWide ? 820 : Math.min(width - 160, 760);

  // Opening logo: a soft scale in, then a quick fade out
  const logoIn = spring({ frame: frame - t.logoIn, fps, config: { damping: 20, stiffness: 90 } });
  const logoOpacity =
    interpolate(frame, [t.logoIn, t.logoIn + 12], [0, 1], clamp) * interpolate(frame, [t.logoOut, t.logoOut + 12], [1, 0], clamp);

  const who = fadeIO(frame, t.who.in, t.who.out);
  const promise = fadeIO(frame, t.promise.in, t.promise.out);

  // Closing logo with the web address underneath
  const back = spring({ frame: frame - t.logoBack, fps, config: { damping: 20, stiffness: 90 } });
  const backOpacity = interpolate(frame, [t.logoBack, t.logoBack + 14], [0, 1], clamp);
  const webOpacity = interpolate(frame, [t.webIn, t.webIn + 12], [0, 1], clamp);
  const webLift = interpolate(frame, [t.webIn, t.webIn + 14], [10, 0], { ...clamp, easing: ease });

  const centred: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    top: cy,
    display: "flex",
    justifyContent: "center",
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.white }}>
      {/* 1. Opening logo */}
      {frame <= t.logoOut + 12 ? (
        <div style={{ ...centred, transform: `translateY(-50%) scale(${0.96 + logoIn * 0.04})`, opacity: logoOpacity }}>
          <Img src={staticFile(LOGOS.imperoColor)} style={{ width: logoW }} />
        </div>
      ) : null}

      {/* 2. Who we are */}
      {frame >= t.who.in && frame <= t.who.out + 10 ? (
        <div style={{ ...centred, transform: `translateY(calc(-50% + ${who.lift}px))`, opacity: who.opacity }}>
          <Typed text={TAGLINE_TEXT.who} start={t.who.in} charsPerFrame={1.8} size={textFont} maxWidth={whoWidth} />
        </div>
      ) : null}

      {/* 3. The promise */}
      {frame >= t.promise.in && frame <= t.promise.out + 10 ? (
        <div style={{ ...centred, transform: `translateY(calc(-50% + ${promise.lift}px))`, opacity: promise.opacity }}>
          <Typed text={TAGLINE_TEXT.promise} start={t.promise.in} charsPerFrame={1.8} size={textFont} maxWidth={promiseWidth} />
        </div>
      ) : null}

      {/* 4. Logo and web address */}
      {frame >= t.logoBack ? (
        <div
          style={{
            ...centred,
            flexDirection: "column",
            alignItems: "center",
            gap: isWide ? 36 : 40,
            transform: `translateY(-50%) scale(${0.96 + back * 0.04})`,
            opacity: backOpacity,
          }}
        >
          <Img src={staticFile(LOGOS.imperoColor)} style={{ width: logoW }} />
          <div
            style={{
              fontFamily,
              fontWeight: 700,
              fontSize: isWide ? 36 : 34,
              color: COLORS.teal,
              opacity: webOpacity,
              transform: `translateY(${webLift}px)`,
            }}
          >
            {TAGLINE_TEXT.web}
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
