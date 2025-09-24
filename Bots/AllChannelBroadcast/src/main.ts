import { rootServer, RootBotStartState } from "@rootsdk/server-bot";
import { initializeAnnounce } from "./announce";

async function onStarting(state: RootBotStartState) {
  initializeAnnounce();
}

(async () => {
  await rootServer.lifecycle.start(onStarting);
})();
