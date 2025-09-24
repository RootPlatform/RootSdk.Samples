import { rootServer, RootBotStartState } from "@rootsdk/server-bot";
import { initializeEcho } from "./echo";

async function onStarting(state: RootBotStartState) {
  initializeEcho();
}

(async () => {
  await rootServer.lifecycle.start(onStarting);
})();
