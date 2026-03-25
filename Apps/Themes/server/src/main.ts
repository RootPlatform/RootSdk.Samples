import { rootServer, RootAppStartState } from "@rootsdk/server-app";

async function onStarting(state: RootAppStartState) {
  // No server-side logic needed — this sample demonstrates client-side theming.
}

(async () => {
  await rootServer.lifecycle.start(onStarting);
})();