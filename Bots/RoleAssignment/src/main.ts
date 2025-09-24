import { rootServer, RootBotStartState } from "@rootsdk/server-bot";
import { initializeAutorole } from "./autorole";

async function onStarting(state: RootBotStartState) {
  initializeAutorole();
}

(async () => {
  await rootServer.lifecycle.start(onStarting);
})();
