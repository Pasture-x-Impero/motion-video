// Copy taken from impero.no (the Lovable project "impero.no", src/hooks/useCompanyInfo.ts,
// src/components/*.tsx). The service and value lists live in the site's database and are
// mirrored here from the verified Impero IT brand material.
import type { LucideIcon } from "lucide-react";
import {
  Blocks,
  Code,
  Headset,
  LaptopMinimal,
  Lightbulb,
  MapPin,
  Network,
  Server,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { COLORS } from "../brand";

export const NAV = ["Tjenester", "Aktuelt", "Om oss", "Referanser", "Ansatte", "Kontakt"];

export const SITE_HERO = {
  title: "Din IT‑avdeling",
  // ** marks bold segments, exactly like the site does it
  text: "Impero IT er IT-avdelingen for **små og mellomstore bedrifter**. Vi hjelper deg å **jobbe smartere med IT**.",
  button: "Kontakt oss",
  morphLabels: { outer: "Utvikling", inner: "Drift", dot: "Utstyr" },
};

export const SITE_SERIT = {
  text: "Som en del av Serit-gruppen, en av Norges største selvstendige IT-grupper, er vi en lokal partner med et stort fagmiljø i ryggen.",
  stats: [
    { value: 200, suffix: "+", label: "ansatte\ntotalt" },
    { value: 27, suffix: "", label: "kontorer\nnasjonalt" },
    { value: 11, suffix: "", label: "medlemmer\ni gruppen" },
  ],
};

export const SITE_WHY = {
  heading: "Hvorfor velge oss som din IT‑avdeling?",
  button: "Les mer om oss",
  items: [
    { icon: MapPin, title: "Folk som kjenner bedriften din", text: "Et fast team, ikke en ny person hver gang du ringer" },
    { icon: ShieldCheck, title: "Fast månedspris", text: "Drift, support og sikkerhet samlet i én forutsigbar pris" },
    { icon: Network, title: "Serit‑gruppen i ryggen", text: "Spesialkompetanse fra en av Norges største IT-aktører" },
    { icon: Sparkles, title: "Vi kan mer enn å drifte", text: "Vi hjelper deg videre med AI og nye løsninger" },
  ] as { icon: LucideIcon; title: string; text: string }[],
};

export const SITE_SERVICES = {
  label: "Tjenester",
  heading: "Hva gjør vi som din IT‑avdeling?",
  button: "Se flere tjenester",
  items: [
    { icon: LaptopMinimal, color: COLORS.teal, title: "Klientdrift", text: "Hele livssyklusen: innkjøp, drift, oppdatering og utfasing" },
    { icon: Blocks, color: COLORS.turquoise, title: "Microsoft 365", text: "Lisenser, brukeradministrasjon og oppsett som virker" },
    { icon: ShieldCheck, color: COLORS.copper, title: "Sikkerhet", text: "Endepunkt, tilgangsstyring, overvåkning og backup" },
    { icon: Headset, color: COLORS.teal, title: "Support", text: "Rask hjelp via telefon og fjernhjelp" },
    { icon: Lightbulb, color: COLORS.turquoise, title: "Rådgivning", text: "En løpende sparringspartner for smartere IT-bruk" },
  ] as { icon: LucideIcon; color: string; title: string; text: string }[],
};

export const SITE_GRAPH = {
  label: "Digital utvikling",
  heading: "IT skal være et konkurransefortrinn, ikke en operativ utfordring.",
  text: "Vi hjelper din bedrift med å ta steget videre digitalt, fra innsikt i egne data til smartere arbeidsprosesser og nye løsninger som skaper verdi i hverdagen.",
  nodes: [
    { icon: Server, title: "IT‑drift", variant: "primary" },
    { icon: ShieldCheck, title: "Datasikkerhet", variant: "coral" },
    { icon: Code, title: "Systemutvikling", variant: "secondary" },
    { icon: Sparkles, title: "AI", variant: "primary" },
  ] as { icon: LucideIcon; title: string; variant: "primary" | "secondary" | "coral" }[],
};

export const SITE_CTA = {
  heading: "Klar for å ta neste steg?",
  text: "La oss ta en uforpliktende prat om hvordan du kan bruke teknologi smartere i hverdagen.",
  fields: [
    { label: "Fornavn", placeholder: "Fornavn" },
    { label: "Etternavn", placeholder: "Etternavn" },
    { label: "E-post", placeholder: "din@epost.no" },
  ],
  button: "Kontakt meg",
};

export const SITE_OUTRO = {
  tagline: "IT. Enkelt og greit.",
  mission: "Vi gjør IT enkelt og greit for bedrifter i Oslo og Akershus.",
  phone: "+47 476 24 000",
  email: "post@impero.no",
  address: "Tollbugata 8B, 0152 Oslo",
  web: "impero.no",
  serit: "En del av Serit‑gruppen",
};
