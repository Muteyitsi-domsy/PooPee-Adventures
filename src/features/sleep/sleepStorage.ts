import { get, list, remove, set } from "@/lib/storage";
import type { ActiveSleepSession, CompletedSleepSession } from "./types";

const ACTIVE_SLEEP_KEY = "sleep:active";
const SLEEP_SESSION_PREFIX = "sleep:session:";

export async function getActiveSleepSession() {
  return get<ActiveSleepSession>(ACTIVE_SLEEP_KEY);
}

export async function saveActiveSleepSession(session: ActiveSleepSession) {
  await set(ACTIVE_SLEEP_KEY, session);
}

export async function clearActiveSleepSession() {
  await remove(ACTIVE_SLEEP_KEY);
}

export async function saveCompletedSleepSession(session: CompletedSleepSession) {
  await set(`${SLEEP_SESSION_PREFIX}${session.id}`, session);
}

export async function getCompletedSleepSessions() {
  const rows = await list<CompletedSleepSession>(SLEEP_SESSION_PREFIX);

  return rows
    .map(([, session]) => session)
    .sort(
      (left, right) =>
        new Date(right.endedAt).getTime() - new Date(left.endedAt).getTime(),
    );
}
