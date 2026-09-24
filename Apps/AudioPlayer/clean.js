const fs = require("fs");

const pathsToDelete = [
  "./node_modules",
  "./package-lock.json",

  "./client/dist",
  "./client/node_modules",

  "./networking/gen",
  "./networking/node_modules",
  "./networking/package-lock.json",

  "./server/dist",
  "./server/node_modules",
  "./server/tsconfig.tsbuildinfo",
];

function clean() {
  for (const path of pathsToDelete) {
    try {
      console.log(`Clean: deleting ${path}`);
      fs.rmSync(path, { recursive: true, force: true });
    } catch (error) {
      console.error(`Clean: failed to delete ${path}:`, error);
    }
  }
}

clean();
