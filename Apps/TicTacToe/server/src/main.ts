import { rootServer, RootAppStartState } from "@rootsdk/server-app";
import { gameService } from "./controllers/gameService";
import { matchmakingService } from "./controllers/matchmakingService";
import { spectatorService } from "./controllers/spectatorService";
import { leaderboardService } from "./controllers/leaderboardService";
import { initializeDatabase } from "./repositories/playerStatsRepository";
import { matchmakingQueue } from "./lib/matchmaking";

async function onStarting(state: RootAppStartState) {
  await initializeDatabase();

  rootServer.lifecycle.addService(gameService);
  rootServer.lifecycle.addService(matchmakingService);
  rootServer.lifecycle.addService(spectatorService);
  rootServer.lifecycle.addService(leaderboardService);
}

async function onStopping() {
  matchmakingQueue.stop();
}

(async () => {
  await rootServer.lifecycle.start(onStarting, onStopping);
})();
