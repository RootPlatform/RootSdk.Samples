import { rootServer, RootAppStartState } from "@rootsdk/server-app";
import { voteService } from "./voteService";
import { suggestionService } from "./suggestionService";
import { initializeDatabase } from "./suggestionRepository";

async function onStarting(state: RootAppStartState) {
  rootServer.lifecycle.addService(voteService);
  rootServer.lifecycle.addService(suggestionService);
  await initializeDatabase();
}

(async () => {
  await rootServer.lifecycle.start(onStarting);
})();
