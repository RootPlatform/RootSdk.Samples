import { rootServer, RootAppStartState } from "@rootsdk/server-app";

// Audio playback is entirely client side. The server exists to satisfy the
// manifest launch entry point and complete the lifecycle handshake.
async function onStarting(_state: RootAppStartState) {}

(async () => {
  await rootServer.lifecycle.start(onStarting);
  console.log("[AudioPlayer] Server started");
})();
