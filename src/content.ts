import type { LucideIcon } from "lucide-react";
import {
  Blocks,
  Globe,
  Headset,
  LaptopMinimal,
  Lightbulb,
  Mail,
  MapPin,
  Network,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { COLORS } from "./brand";

export type ServiceItem = {
  icon: LucideIcon;
  color: string;
  iconColor: string;
  title: string;
  text: string;
  angle: number; // degrees, 90 = top, counter clockwise
  labelSide: "top" | "left" | "right";
};

export const HERO = {
  title: "Din IT\u2011avdeling",
  subtitle:
    "Impero IT er IT-avdelingen for små og mellomstore bedrifter. Vi starter med utfordringene dine og hjelper deg å jobbe smartere med IT.",
};

export const CIRCLE = {
  heading: "Alt samlet i Impero 365",
  subtitle: "Drift, support og sikkerhet i én forutsigbar månedspris.",
  center: "Impero 365",
};

export const SERVICES: ServiceItem[] = [
  {
    icon: LaptopMinimal,
    color: COLORS.teal,
    iconColor: COLORS.white,
    title: "Klientdrift",
    text: "Hele livssyklusen: innkjøp, drift, oppdatering og utfasing",
    angle: 90,
    labelSide: "top",
  },
  {
    icon: Blocks,
    color: COLORS.turquoise,
    iconColor: COLORS.teal,
    title: "Microsoft 365",
    text: "Lisenser, brukeradministrasjon og oppsett som virker",
    angle: 18,
    labelSide: "right",
  },
  {
    icon: ShieldCheck,
    color: COLORS.copper,
    iconColor: COLORS.white,
    title: "Sikkerhet",
    text: "Endepunkt, tilgangsstyring, overvåkning og backup",
    angle: -54,
    labelSide: "right",
  },
  {
    icon: Headset,
    color: COLORS.teal,
    iconColor: COLORS.white,
    title: "Support",
    text: "Rask hjelp via telefon og fjernhjelp",
    angle: -126,
    labelSide: "left",
  },
  {
    icon: Lightbulb,
    color: COLORS.turquoise,
    iconColor: COLORS.teal,
    title: "Rådgivning",
    text: "En løpende sparringspartner for smartere IT-bruk",
    angle: 162,
    labelSide: "left",
  },
];

export const SERVICES_HEADING = "Hva gjør vi som din IT\u2011avdeling?";

export const WHY_HEADING = "Hvorfor velge oss?";

export const WHY: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: MapPin,
    title: "Folk som kjenner bedriften din",
    text: "Et fast team, ikke en ny person hver gang du ringer",
  },
  {
    icon: ShieldCheck,
    title: "Fast månedspris",
    text: "Drift, support og sikkerhet samlet i én forutsigbar pris",
  },
  {
    icon: Network,
    title: "Serit\u2011gruppen i ryggen",
    text: "Spesialkompetanse fra en av Norges største IT-aktører",
  },
  {
    icon: Sparkles,
    title: "Vi kan mer enn å drifte",
    text: "Vi hjelper deg videre med AI og nye løsninger",
  },
];

export const SERIT = {
  heading: "En del av Serit\u2011gruppen",
  text: "Som en del av Serit-gruppen, en av Norges største selvstendige IT-grupper, er vi en lokal partner med et stort fagmiljø i ryggen.",
  stats: [
    { value: 200, suffix: "+", label: "ansatte totalt" },
    { value: 27, suffix: "", label: "kontorer nasjonalt" },
    { value: 11, suffix: "", label: "medlemmer i gruppen" },
  ],
};

export const CTA = {
  heading: "Klar for å ta neste steg?",
  text: "Vi er alltid klar for en hyggelig og uforpliktende prat.",
  contacts: [
    { icon: Phone, text: "+47 476 24 000" },
    { icon: Mail, text: "post@impero.no" },
    { icon: Globe, text: "impero.no" },
  ],
};
