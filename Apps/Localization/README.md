# Localization

A shared like counter whose screens follow the member's Root language. It ships in every language Root supports: English, Spanish, French, Portuguese, German, Italian, Polish and Turkish.

## What it shows

- Choosing the language from `navigator.language`, with English as the fallback and `?lang=` as a test override
- One translation table per language in `client/src/i18n/`, with English in `en.ts` as the list of keys
- `t()` for plain text and `tn()` for text that depends on a count, using `Intl.PluralRules`
- Polish plurals, which need `_few` and `_many` forms as well as `_one` and `_other`
- Numbers and relative times from `Intl.NumberFormat` and `Intl.RelativeTimeFormat`, with no date library
- A server error sent as a `RootServerException` code that the client turns into translated text
- `scripts/check-i18n.mjs`, which runs before every build and fails on missing keys, unknown keys and placeholder mismatches

See [Localization](https://docs.rootapp.com/docs/app-docs/develop/client/localization) in the developer documentation.

## Run it

```
npm install
npm run build
cd client && npm run client
```

Add `?lang=` with a language code (`es`, `fr`, `pt`, `de`, `it`, `pl` or `tr`) to the address to see another language.

To run against a community, put your app id in `root-manifest.json` and a `DEV_TOKEN` in `server/.env`, then `cd server && npm run server`.

## Add a language

1. Copy `client/src/i18n/es.ts` to a new file named with the language code, for example `nl.ts`, and translate the values. If the language needs plural forms other than `_one` and `_other`, add them to `EXTRA_PLURAL_FORMS` in `client/scripts/check-i18n.mjs`.
2. Import it in `client/src/i18n/index.ts` and add the code to `LANGUAGES` and `TABLES`.
3. Add the code to `LANGUAGES` in `client/scripts/check-i18n.mjs`.
4. Run `npm run build`.
