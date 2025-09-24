import { rootServer, RootAppStartState } from "@rootsdk/server-app";
import { communityLogService } from "./communityLogService";

async function onStarting(state: RootAppStartState) {
  rootServer.lifecycle.addService(communityLogService);
}

(async () => {
  await rootServer.lifecycle.start(onStarting);
})();
