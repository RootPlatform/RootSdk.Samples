const LANGUAGES = ["es", "fr", "pt", "de", "it", "pl", "tr"];
const EXTRA_PLURAL_FORMS = { pl: ["few", "many"] };

function placeholdersIn(text) {
  return [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort().join(", ");
}

const { en } = await import("../src/translations/en.ts");
const problems = [];

for (const language of LANGUAGES) {
  const translation = (await import(`../src/translations/${language}.ts`))[language];

  const expectedKeys = Object.keys(en);
  for (const pluralKey of Object.keys(en).filter((key) => key.endsWith("_other"))) {
    for (const pluralForm of EXTRA_PLURAL_FORMS[language] ?? []) {
      expectedKeys.push(pluralKey.replace("_other", `_${pluralForm}`));
    }
  }

  for (const key of expectedKeys) {
    if (!(key in translation)) {
      problems.push(`${language}: missing ${key}`);
    }
  }

  for (const [key, text] of Object.entries(translation)) {
    if (!expectedKeys.includes(key)) {
      problems.push(`${language}: unknown key ${key}`);
      continue;
    }

    const englishText = en[key] ?? en[key.replace(/_(few|many)$/, "_other")];
    if (placeholdersIn(text) !== placeholdersIn(englishText)) {
      problems.push(`${language}: ${key} uses {${placeholdersIn(text)}}, English uses {${placeholdersIn(englishText)}}`);
    }
  }
}

if (problems.length > 0) {
  console.error(`Translation check failed:\n  ${problems.join("\n  ")}`);
  process.exit(1);
}

console.log(`Translations OK: ${Object.keys(en).length} keys in ${LANGUAGES.length + 1} languages.`);
