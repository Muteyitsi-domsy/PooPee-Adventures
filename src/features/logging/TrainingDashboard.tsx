"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "@/app/page.module.css";
import type { OnboardingProfile } from "@/features/onboarding/types";
import { scoreReadiness } from "@/features/onboarding/readiness";
import { computeEngine } from "./engine";
import { getLogs, saveLog } from "./logStorage";
import type { PottyEventType, PottyLogEntry } from "./types";

type TrainingDashboardProps = {
  profile: OnboardingProfile;
  onResetOnboarding: () => Promise<void>;
};

export function TrainingDashboard({
  profile,
  onResetOnboarding,
}: TrainingDashboardProps) {
  const [logs, setLogs] = useState<PottyLogEntry[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [includeBeverage, setIncludeBeverage] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    let isMounted = true;

    getLogs()
      .then((savedLogs) => {
        if (isMounted) {
          setLogs(savedLogs);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingLogs(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const engine = useMemo(() => computeEngine(logs), [logs]);
  const peeCount = logs.filter((log) => log.type === "pee").length;
  const pooCount = logs.filter((log) => log.type === "poo").length;

  async function handleLog(type: PottyEventType) {
    const now = new Date().toISOString();
    const entry: PottyLogEntry = {
      id: createLogId(),
      type,
      happenedAt: now,
      createdAt: now,
      notes: notes.trim() || undefined,
      recentBeverageMl: type === "pee" && includeBeverage ? 200 : undefined,
    };

    await saveLog(entry);
    setLogs((current) =>
      [entry, ...current].sort(
        (left, right) =>
          new Date(right.happenedAt).getTime() -
          new Date(left.happenedAt).getTime(),
      ),
    );
    setNotes("");
  }

  return (
    <main className={styles.shell}>
      <p className={styles.kicker}>{profile.childName}&apos;s training</p>
      <h1>Hi, {profile.caregiverName}</h1>
      <p className={styles.summary}>
        Onboarding is saved on this device. You can log{" "}
        {profile.childName}&apos;s potty patterns now.
      </p>

      <section className={styles.panel} aria-label="Next reminder estimate">
        <div>
          <p className={styles.metric}>
            {engine.minutesUntilReminder}
            <span className={styles.metricUnit}> min</span>
          </p>
          <p className={styles.muted}>Until next pee reminder</p>
        </div>
        <p className={styles.resultText}>
          {engine.confidence === "learned"
            ? `Based on ${engine.sampleCount} logged interval${
                engine.sampleCount === 1 ? "" : "s"
              }, the current estimate is ${engine.learnedIntervalMinutes} minutes.`
            : "The app is using a 90-minute starter estimate until more pee logs are available."}
          {engine.beverageAdjusted
            ? " A recent drink shortened this estimate."
            : ""}
        </p>
      </section>

      <div className={styles.actionGrid} aria-label="Quick log actions">
        <button
          className={styles.primaryButton}
          type="button"
          onClick={() => handleLog("pee")}
        >
          Log pee
        </button>
        <button
          className={styles.primaryButton}
          type="button"
          onClick={() => handleLog("poo")}
        >
          Log poo
        </button>
      </div>

      <label className={styles.toggleRow}>
        <input
          type="checkbox"
          checked={includeBeverage}
          onChange={(event) => setIncludeBeverage(event.target.checked)}
        />
        <span>Recent drink before this pee</span>
      </label>

      <label className={styles.noteField}>
        Note
        <input
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Optional context"
        />
      </label>

      <section className={styles.panel} aria-label="Saved readiness result">
        <div>
          <p className={styles.metric}>{profile.readinessScore}%</p>
          <p className={styles.muted}>Readiness score</p>
        </div>
        <p className={styles.resultText}>
          {scoreReadiness(profile.readinessAnswers).message}
        </p>
      </section>

      <div className={styles.status} aria-label="Logging status">
        <span>{peeCount} pee logs</span>
        <span>{pooCount} poo logs</span>
        <span>IndexedDB saved</span>
      </div>

      <section className={styles.logSheet} aria-label="Recent potty logs">
        <h2>Recent logs</h2>
        {isLoadingLogs ? (
          <p className={styles.muted}>Loading saved logs.</p>
        ) : logs.length === 0 ? (
          <p className={styles.muted}>No pee or poo logs yet.</p>
        ) : (
          <ol>
            {logs.slice(0, 6).map((log) => (
              <li key={log.id}>
                <strong>{log.type === "pee" ? "Pee" : "Poo"}</strong>
                <span>{formatLogTime(log.happenedAt)}</span>
                {log.recentBeverageMl ? <em>Recent drink</em> : null}
                {log.notes ? <p>{log.notes}</p> : null}
              </li>
            ))}
          </ol>
        )}
      </section>

      <button
        className={styles.secondaryButton}
        type="button"
        onClick={onResetOnboarding}
      >
        Reset onboarding
      </button>
    </main>
  );
}

function createLogId() {
  return globalThis.crypto?.randomUUID?.() ?? `log-${Date.now()}`;
}

function formatLogTime(isoDate: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(isoDate));
}
