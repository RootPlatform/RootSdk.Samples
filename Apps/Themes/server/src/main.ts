import { rootServer } from "@rootsdk/server-app";

(async () => {
  await rootServer.lifecycle.start();
})();