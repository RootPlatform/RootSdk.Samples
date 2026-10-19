import { de } from "./de";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { it } from "./it";
import { pl } from "./pl";
import { pt } from "./pt";
import { tr } from "./tr";
import type { MessageKey, Messages } from "./types";

export const LANGUAGES = ["en", "es", "fr", "pt", "de", "it", "pl", "tr"] as const;
export type Language = (typeof LANGUAGES)[number];

type PluralBase<Key> = Key extends `${infer Base}_other` ? Base : never;
type PluralKey = PluralBase<MessageKey>;
type Values = Record<string, string | number>;

const TABLES: Record<Language, Messages> = { en, es, fr, pt, de, it, pl, tr };

function toLanguage(value: string | null | undefined): Language | null {
  const base = (value ?? "").trim().toLowerCase().split(/[-_]/)[0];
  return (LANGUAGES as readonly string[]).includes(base) ? (base as Language) : null;
}

function detectLanguage(): Language {
  const override = toLanguage(new URLSearchParams(window.location.search).get("lang"));
  if (override) return override;
  for (const candidate of [...navigator.languages, navigator.language]) {
    const match = toLanguage(candidate);
    if (match) return match;
  }
  return "en";
}

export const language: Language = detectLanguage();
document.documentElement.lang = language;

function fill(template: string, values?: Values): string {
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in values ? String(values[name]) : match
  );
}

export function t(key: MessageKey, values?: Values): string {
  return fill(TABLES[language][key] ?? en[key], values);
}

const pluralRules = new Intl.PluralRules(language);

export function tn(key: PluralKey, count: number, values?: Values): string {
  const table = TABLES[language];
  const form = table[`${key}_${pluralRules.select(count)}`] ?? table[`${key}_other`];
  return fill(form, { count: formatNumber(count), ...values });
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat(language).format(value);
}

export function formatRelativeTime(timestamp: number, now = Date.now()): string {
  const seconds = Math.round((timestamp - now) / 1000);
  const relative = new Intl.RelativeTimeFormat(language, { numeric: "auto" });
  if (Math.abs(seconds) < 60) return relative.format(seconds, "second");
  const minutes = Math.round(seconds / 60);
  if (Math.abs(minutes) < 60) return relative.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return relative.format(hours, "hour");
  return relative.format(Math.round(hours / 24), "day");
}

export function languageName(): string {
  return new Intl.DisplayNames([language], { type: "language" }).of(language) ?? language;
}
