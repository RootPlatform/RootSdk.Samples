import { de } from "./de";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { it } from "./it";
import { pl } from "./pl";
import { pt } from "./pt";
import { tr } from "./tr";

const translations: Record<string, Record<string, string>> = { en, es, fr, pt, de, it, pl, tr };

function chooseLanguage(): string {
  const languageFromAddress = new URLSearchParams(window.location.search).get("lang");
  const requestedLanguage = languageFromAddress ?? navigator.language;
  const languageCode = requestedLanguage.split("-")[0].toLowerCase();
  return languageCode in translations ? languageCode : "en";
}

export const currentLanguage = chooseLanguage();
export const currentLanguageName = new Intl.DisplayNames([currentLanguage], { type: "language" }).of(currentLanguage) ?? currentLanguage;

document.documentElement.lang = currentLanguage;

export function translate(key: string, values: Record<string, string | number> = {}): string {
  let text = translations[currentLanguage][key] ?? en[key] ?? key;
  for (const [name, value] of Object.entries(values)) {
    text = text.replace(`{${name}}`, String(value));
  }
  return text;
}

const pluralRules = new Intl.PluralRules(currentLanguage);

export function translatePlural(key: string, count: number): string {
  const pluralForm = pluralRules.select(count);
  const pluralKey = `${key}_${pluralForm}` in translations[currentLanguage] ? `${key}_${pluralForm}` : `${key}_other`;
  return translate(pluralKey, { count: new Intl.NumberFormat(currentLanguage).format(count) });
}

export function formatTimeAgo(timestamp: number, currentTime: number): string {
  const timeFormat = new Intl.RelativeTimeFormat(currentLanguage, { numeric: "auto" });
  const minutesAgo = Math.floor((currentTime - timestamp) / 60000);
  if (minutesAgo < 1) return timeFormat.format(0, "second");
  if (minutesAgo < 60) return timeFormat.format(-minutesAgo, "minute");
  const hoursAgo = Math.round(minutesAgo / 60);
  if (hoursAgo < 24) return timeFormat.format(-hoursAgo, "hour");
  return timeFormat.format(-Math.round(hoursAgo / 24), "day");
}
