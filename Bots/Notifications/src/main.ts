import { rootServer, RootBotStartState } from "@rootsdk/server-bot";
import { initializeNotify } from "./notify";

async function onStarting(state: RootBotStartState) {
  initializeNotify();
}

(async () => {
  await rootServer.lifecycle.start(onStarting);
})();
