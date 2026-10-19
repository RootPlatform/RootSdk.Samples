import { rootServer, RootAppStartState } from "@rootsdk/server-app";
import { likesService } from "./likesService";

async function onStarting(state: RootAppStartState) {
  rootServer.lifecycle.addService(likesService);
}

(async () => {
  await rootServer.lifecycle.start(onStarting);
})();
