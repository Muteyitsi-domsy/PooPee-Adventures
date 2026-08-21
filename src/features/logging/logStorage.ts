import { list, set } from "@/lib/storage";
import type { PottyLogEntry } from "./types";

const LOG_PREFIX = "log:";

export async function saveLog(entry: PottyLogEntry) {
  await set(`${LOG_PREFIX}${entry.id}`, entry);
}

export async function getLogs() {
  const rows = await list<PottyLogEntry>(LOG_PREFIX);

  return rows
    .map(([, entry]) => entry)
    .sort(
      (left, right) =>
        new Date(right.happenedAt).getTime() - new Date(left.happenedAt).getTime(),
    );
}
