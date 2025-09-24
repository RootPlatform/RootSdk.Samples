import { rootServer, RootAppStartState } from "@rootsdk/server-app";
import { taskService } from "./taskService";

// This App has three options for server-side storage: in-memory, knex + SQLite, and prisma + SQLite.
// The in-memory option doesn't need any initialization, but the others do.
// For knex or prisma, uncomment the lines below that match the option you want to use.

//import { initializeKnex } from "./knexTaskRepository";
//import { initializePrisma } from "./prismaTaskRepository";

async function onStarting(state: RootAppStartState) {
  //  await initializeKnex();
  //  await initializePrisma();

  rootServer.lifecycle.addService(taskService);
}

(async () => {
  await rootServer.lifecycle.start(onStarting);
})();
