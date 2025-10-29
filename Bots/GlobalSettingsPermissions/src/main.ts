import { rootServer, RootBotStartState } from "@rootsdk/server-bot";
import { initializeAutorole } from "./autorole";

async function onStarting(state: RootBotStartState) {
  initializeAutorole();

  const messagingGroup = state.globalSettings?.groups?.find((g: any) => g?.key === "messages");
  const numberItem = messagingGroup?.items?.find((i: any) => i?.key === "numberOfMessages");



}

(async () => {
  await rootServer.lifecycle.start(onStarting);
})();
