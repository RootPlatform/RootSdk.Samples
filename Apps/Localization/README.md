# Localization

A shared like counter whose screens follow the member's Root language. It ships in every language Root supports: English, Spanish, French, Portuguese, German, Italian, Polish and Turkish.

## Read the code in this order

1. **`client/src/translations/en.ts`** has every piece of text the App shows, in English. Each line is a key and its text.
2. **`client/src/translations/es.ts`** has the same keys in Spanish. The other languages follow the same pattern.
3. **`client/src/translations/translate.ts`** chooses the language and has the functions the screen uses:
   - `chooseLanguage()` reads `navigator.language`, keeps the part before the hyphen (`es-419` becomes `es`) and falls back to English.
   - `translate(key, values)` returns the text for a key and fills in placeholders such as `{time}`.
   - `translatePlural(key, count)` picks the right form for a count, such as "1 person" or "2 people".
   - `formatTimeAgo(timestamp, currentTime)` returns text such as "3 minutes ago" in the member's language.
4. **`client/src/App.tsx`** is the screen. Every piece of text goes through `translate()` or `translatePlural()`.

## Optional extras

You don't need these to translate your screens.

- **Translated server errors.** `server/src/likesService.ts` throws a `RootServerException` with an error code from `networking/src/likes.proto` when there is nothing to clear. `translateError()` in `App.tsx` turns the code into text in the member's language. The server never sends translated text, because it doesn't know the member's language.
- **The translation check.** `client/scripts/check-translations.mjs` runs before every build. It fails the build when a language is missing a key, has a key English doesn't have, or uses different `{placeholders}` from English.

## Plurals

Most languages need two forms of a counted phrase: `likes.count_one` and `likes.count_other`. Polish needs four: `_one` (1), `_few` (2 to 4, 22 to 24, ...), `_many` (5 to 21, ...) and `_other`. Look at `pl.ts` to see them.

## Run it

```
npm install
npm run build
cd client && npm run client
```

Add `?lang=` with a language code (`es`, `fr`, `pt`, `de`, `it`, `pl` or `tr`) to the address to see another language.

To run against a community, put your app id in `root-manifest.json` and a `DEV_TOKEN` in `server/.env`, then `cd server && npm run server`.

## Add a language

1. Copy `client/src/translations/es.ts` to a new file named with the language code, for example `nl.ts`, and translate the text.
2. In `translate.ts`, import it and add it to `translations`.
3. In `check-translations.mjs`, add the code to `LANGUAGES`. If the language needs plural forms other than `_one` and `_other`, add them to `EXTRA_PLURAL_FORMS`.
4. Run `npm run build`.

See [Localization](https://docs.rootapp.com/docs/app-docs/develop/client/localization) in the developer documentation.
