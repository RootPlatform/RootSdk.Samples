const LANGUAGES = ["es", "pl"];
const EXTRA_PLURAL_FORMS = { pl: ["few", "many"] };

const placeholders = (text) => [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort().join(",");
const problems = [];

const { en } = await import("../src/i18n/en.ts");
const englishKeys = Object.keys(en);
const pluralBases = englishKeys.filter((key) => key.endsWith("_other")).map((key) => key.slice(0, -"_other".length));

for (const lang of LANGUAGES) {
  const table = (await import(`../src/i18n/${lang}.ts`))[lang];
  const forms = EXTRA_PLURAL_FORMS[lang] ?? [];
  const pluralKeys = pluralBases.flatMap((base) => forms.map((form) => `${base}_${form}`));
  const allowed = new Set([...englishKeys, ...pluralKeys]);

  for (const key of [...englishKeys, ...pluralKeys]) {
    if (!(key in table)) problems.push(`${lang}: missing ${key}`);
  }

  for (const [key, value] of Object.entries(table)) {
    if (!allowed.has(key)) {
      problems.push(`${lang}: unknown key ${key}`);
      continue;
    }
    const englishKey = key in en ? key : key.replace(/_[a-z]+$/, "_other");
    if (placeholders(value) !== placeholders(en[englishKey])) {
      problems.push(`${lang}: ${key} has {${placeholders(value)}}, English has {${placeholders(en[englishKey])}}`);
    }
  }
}

if (problems.length > 0) {
  console.error(`Translation check failed:\n  ${problems.join("\n  ")}`);
  process.exit(1);
}

console.log(`Translations OK: ${englishKeys.length} keys in ${LANGUAGES.length + 1} languages.`);
