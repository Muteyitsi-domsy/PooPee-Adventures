"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "@/app/page.module.css";
import { computeSleepStats } from "./stats";
import {
  clearActiveSleepSession,
  getActiveSleepSession,
  getCompletedSleepSessions,
  saveActiveSleepSession,
  saveCompletedSleepSession,
} from "./sleepStorage";
import type {
  ActiveSleepSession,
  CompletedSleepSession,
  SleepDryness,
  SleepSessionType,
} from "./types";

export function SleepSessionPanel() {
  const [activeSession, setActiveSession] =
    useState<ActiveSleepSession | null>(null);
  const [completedSessions, setCompletedSessions] = useState<
    CompletedSleepSession[]
  >([]);
  const [sleepType, setSleepType] = useState<SleepSessionType>("nap");
  const [liquidMinutesBefore, setLiquidMinutesBefore] = useState("60");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let isMounted = true;

    Promise.all([getActiveSleepSession(), getCompletedSleepSessions()]).then(
      ([savedActiveSession, savedCompletedSessions]) => {
        if (isMounted) {
          setActiveSession(savedActiveSession ?? null);
          setCompletedSessions(savedCompletedSessions);
        }
      },
    );

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const timerId = window.setInterval(() => setNow(new Date()), 30_000);

    return () => window.clearInterval(timerId);
  }, []);

  const stats = useMemo(
    () => computeSleepStats(completedSessions),
    [completedSessions],
  );

  async function handleStartSession() {
    const session: ActiveSleepSession = {
      id: createSessionId(),
      type: sleepType,
      startedAt: new Date().toISOString(),
      liquidMinutesBefore: Number(liquidMinutesBefore),
    };

    await saveActiveSleepSession(session);
    setActiveSession(session);
  }

  async function handleEndSession(dryness: SleepDryness) {
    if (!activeSession) {
      return;
    }

    const completedSession: CompletedSleepSession = {
      ...activeSession,
      endedAt: new Date().toISOString(),
      dryness,
    };

    await saveCompletedSleepSession(completedSession);
    await clearActiveSleepSession();
    setActiveSession(null);
    setCompletedSessions((current) =>
      [completedSession, ...current].sort(
        (left, right) =>
          new Date(right.endedAt).getTime() - new Date(left.endedAt).getTime(),
      ),
    );
  }

  return (
    <section className={styles.sleepPanel} aria-label="Nap and night sessions">
      <h2>Nap and night sessions</h2>

      {activeSession ? (
        <div className={styles.panel}>
          <div>
            <p className={styles.metric}>
              {getElapsedMinutes(activeSession.startedAt, now)}
              <span className={styles.metricUnit}> min</span>
            </p>
            <p className={styles.muted}>
              Active {activeSession.type} session
            </p>
          </div>
          <div>
            <p className={styles.resultText}>
              Started {formatSessionTime(activeSession.startedAt)}. This active
              session is saved and will survive a reload.
            </p>
            <div className={styles.actionGrid}>
              <button
                className={styles.primaryButton}
                type="button"
                onClick={() => handleEndSession("dry")}
              >
                End dry
              </button>
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={() => handleEndSession("wet")}
              >
                End wet
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.sleepStartGrid}>
          <label className={styles.noteField}>
            Session type
            <select
              value={sleepType}
              onChange={(event) =>
                setSleepType(event.target.value as SleepSessionType)
              }
            >
              <option value="nap">Nap</option>
              <option value="night">Night</option>
            </select>
          </label>
          <label className={styles.noteField}>
            Liquid minutes before sleep
            <input
              min="0"
              max="240"
              type="number"
              value={liquidMinutesBefore}
              onChange={(event) => setLiquidMinutesBefore(event.target.value)}
            />
          </label>
          <button
            className={styles.primaryButton}
            type="button"
            onClick={handleStartSession}
          >
            Start session
          </button>
        </div>
      )}

      <section className={styles.panel} aria-label="Sleep dryness summary">
        <div>
          <p className={styles.metric}>{stats.dryRate}%</p>
          <p className={styles.muted}>Dry sleep sessions</p>
        </div>
        <p className={styles.resultText}>
          {stats.total === 0
            ? "No completed nap or night sessions yet."
            : `${stats.dry} of ${stats.total} completed sessions were dry.`}
        </p>
      </section>

      <div className={styles.bucketGrid} aria-label="Dryness by liquid timing">
        {stats.buckets.map((bucket) => (
          <div key={bucket.bucket}>
            <strong>{bucket.dryRate}%</strong>
            <span>{bucket.label}</span>
            <em>
              {bucket.dry}/{bucket.total} dry
            </em>
          </div>
        ))}
      </div>
    </section>
  );
}

function createSessionId() {
  return globalThis.crypto?.randomUUID?.() ?? `sleep-${Date.now()}`;
}

function getElapsedMinutes(startedAt: string, now: Date) {
  return Math.max(
    0,
    Math.floor((now.getTime() - new Date(startedAt).getTime()) / 60_000),
  );
}

function formatSessionTime(isoDate: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(isoDate));
}
