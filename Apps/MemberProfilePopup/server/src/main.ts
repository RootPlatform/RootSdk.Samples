import { rootServer, RootAppStartState } from "@rootsdk/server-app";
import { breakoutRoomsService } from "./breakoutRoomsService";

async function onStarting(state: RootAppStartState) {
  rootServer.lifecycle.addService(breakoutRoomsService);
}

(async () => {
  await rootServer.lifecycle.start(onStarting);
})();