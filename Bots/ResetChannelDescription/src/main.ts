import { rootServer, RootBotStartState } from "@rootsdk/server-bot";
import { initialize } from "./reset";

async function onStarting(state: RootBotStartState) {
  initialize();
}

(async () => {
  await rootServer.lifecycle.start(onStarting);
})();
