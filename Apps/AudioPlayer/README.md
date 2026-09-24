# AudioPlayer

Plays a music track and a sound effect that ship with the client.

## What it shows

- Where audio files live in the package: `client/public/audio`, copied into `client/dist` by the build and deployed by `root-manifest.json`
- Playing a track with an `<audio>` element, with play, pause, loop, volume and elapsed time
- Playing a short effect with a separate element each time, so overlapping presses stack
- Handling a rejected `play()`

Audio playback is entirely client side. The server exists to satisfy the manifest launch entry point.

## Formats

Use MP3 for music and WAV for effects. The mobile clients serve those two formats with the correct content type.

Audio counts towards the 100 MiB package limit. `theme.mp3` here is 24 seconds at 320 kbps, which is about 0.9 MiB.

See [Audio](https://docs.rootapp.com/docs/app-docs/develop/client/audio) in the developer documentation.

## Run it

```
npm install
npm run build
cd client && npm run dev
```

To run against a community, put your app id in `root-manifest.json` and a `DEV_TOKEN` in `server/.env`, then `cd server && npm run server`.

## Audio credits

`theme.mp3` is an excerpt of an original track by Adrian Stevens, included with permission for use in this sample. `click.wav` is a generated tone.
