import { rootServer, RootBotStartState } from "@rootsdk/server-bot";
import { initializeRole } from "./role";

async function onStarting(state: RootBotStartState) {
  initializeRole();
}

(async () => {
  await rootServer.lifecycle.start(onStarting);
})();
