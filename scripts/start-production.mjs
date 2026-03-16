import { spawn } from "node:child_process";
import path from "node:path";
import { loadEnvFile, resolveEnvFilePath } from "./env-utils.mjs";

try {
  const envFilePath = loadEnvFile();
  const nextBinPath = path.resolve(
    process.cwd(),
    "node_modules",
    "next",
    "dist",
    "bin",
    "next"
  );

  console.log(`Starting production app with env file: ${envFilePath}`);

  const child = spawn(process.execPath, [nextBinPath, "start"], {
    stdio: "inherit",
    env: process.env,
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });
} catch (error) {
  console.error("Unable to start production app.");
  console.error(error instanceof Error ? error.message : error);
  console.error(`Checked path: ${resolveEnvFilePath()}`);
  process.exit(1);
}
