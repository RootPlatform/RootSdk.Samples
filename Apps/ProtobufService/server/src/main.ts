import { rootServer, RootAppStartState } from "@rootsdk/server-app";
import { voteService } from "./voteService";

async function onStarting(state: RootAppStartState) {
  rootServer.lifecycle.addService(voteService);
}

(async () => {
  await rootServer.lifecycle.start(onStarting);
})();
