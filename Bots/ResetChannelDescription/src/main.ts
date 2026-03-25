import { rootServer, RootBotStartState } from "@rootsdk/server-bot";
import { initializeReset } from "./reset";

async function onStarting(state: RootBotStartState) {
  initializeReset();
}

(async () => {
  await rootServer.lifecycle.start(onStarting);
})();
