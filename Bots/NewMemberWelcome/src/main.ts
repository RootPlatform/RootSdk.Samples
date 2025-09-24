import { rootServer, RootBotStartState } from "@rootsdk/server-bot";
import { initializeWelcome } from "./welcome";

async function onStarting(state: RootBotStartState) {
  initializeWelcome();
}

(async () => {
  await rootServer.lifecycle.start(onStarting);
})();
