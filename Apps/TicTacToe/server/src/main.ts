import { rootServer, RootAppStartState } from "@rootsdk/server-app";
import { gameService } from "./controllers/gameService";
import { matchmakingService } from "./controllers/matchmakingService";
import { spectatorService } from "./controllers/spectatorService";
import { leaderboardService } from "./controllers/leaderboardService";
import { initializeDatabase } from "./repositories/playerStatsRepository";

async function onStarting(state: RootAppStartState) {
  // Initialize database tables
  await initializeDatabase();

  // Register services
  rootServer.lifecycle.addService(gameService);
  rootServer.lifecycle.addService(matchmakingService);
  rootServer.lifecycle.addService(spectatorService);
  rootServer.lifecycle.addService(leaderboardService);

  console.log("TicTacToe server started");
}

(async () => {
  await rootServer.lifecycle.start(onStarting);
})();
