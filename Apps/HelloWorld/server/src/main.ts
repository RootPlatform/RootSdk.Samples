import { rootServer, RootAppStartState } from "@rootsdk/server-app";
import { echoService } from "./echoService";

async function onStarting(state: RootAppStartState) {
  rootServer.lifecycle.addService(echoService);
}

(async () => {
  await rootServer.lifecycle.start(onStarting);
})();