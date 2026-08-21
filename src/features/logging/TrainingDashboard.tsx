"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "@/app/page.module.css";
import type { OnboardingProfile } from "@/features/onboarding/types";
import { scoreReadiness } from "@/features/onboarding/readiness";
import { computeEngine } from "./engine";
import { getLogs, saveLog } from "./logStorage";
import { getNextTrainingPhase, type TrainingPhase } from "./phase";
import type {
  OutsideReason,
  PottyEventType,
  PottyLocation,
  PottyLogEntry,
} from "./types";

type TrainingDashboardProps = {
  profile: OnboardingProfile;
  onProfileChange: (profile: OnboardingProfile) => Promise<void>;
  onResetOnboarding: () => Promise<void>;
};

export function TrainingDashboard({
  profile,
  onProfileChange,
  onResetOnboarding,
}: TrainingDashboardProps) {
  const [logs, setLogs] = useState<PottyLogEntry[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [includeBeverage, setIncludeBeverage] = useState(false);
  const [location, setLocation] = useState<PottyLocation>("potty");
  const [outsideReason, setOutsideReason] =
    useState<OutsideReason>("missed-cue");
  const [banner, setBanner] = useState<string | null>(null);
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
      location,
      happenedAt: now,
      createdAt: now,
      notes: notes.trim() || undefined,
      recentBeverageMl: type === "pee" && includeBeverage ? 200 : undefined,
      outsideReason: location === "outside" ? outsideReason : undefined,
    };
    const nextPhase = getNextTrainingPhase(
      getTrainingPhase(profile),
      entry,
    );

    await saveLog(entry);
    if (nextPhase !== getTrainingPhase(profile)) {
      await onProfileChange({
        ...profile,
        trainingPhase: nextPhase,
      });
    }
    setLogs((current) =>
      [entry, ...current].sort(
        (left, right) =>
          new Date(right.happenedAt).getTime() -
          new Date(left.happenedAt).getTime(),
      ),
    );
    setBanner(getLogBanner(entry, profile.childName, nextPhase));
    setNotes("");
  }

  return (
    <main className={styles.shell}>
      <p className={styles.kicker}>{profile.childName}&apos;s training</p>
      <h1>Hi, {profile.caregiverName}</h1>
      <p className={styles.summary}>
        Today is for logging what happened without pressure. You are in Phase{" "}
        {getTrainingPhase(profile)} for {profile.childName}&apos;s training.
      </p>

      {banner ? (
        <p className={styles.banner} role="status">
          {banner}
        </p>
      ) : null}

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

      <section className={styles.todayControls} aria-label="Today tab">
        <div className={styles.segmented} aria-label="Potty location">
          <button
            className={location === "potty" ? styles.segmentActive : ""}
            type="button"
            onClick={() => setLocation("potty")}
            aria-pressed={location === "potty"}
          >
            Potty
          </button>
          <button
            className={location === "outside" ? styles.segmentActive : ""}
            type="button"
            onClick={() => setLocation("outside")}
            aria-pressed={location === "outside"}
          >
            Outside potty
          </button>
        </div>

        {location === "outside" ? (
          <label className={styles.noteField}>
            Outside reason
            <select
              value={outsideReason}
              onChange={(event) =>
                setOutsideReason(event.target.value as OutsideReason)
              }
            >
              <option value="missed-cue">Missed cue</option>
              <option value="resisted-potty">Resisted potty</option>
              <option value="travel">Travel or outing</option>
              <option value="other">Other</option>
            </select>
          </label>
        ) : null}
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
        <span>Phase {getTrainingPhase(profile)}</span>
        <span>{peeCount} pee logs</span>
        <span>{pooCount} poo logs</span>
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
                <span>
                  {formatLogTime(log.happenedAt)} ·{" "}
                  {log.location === "potty" ? "Potty" : "Outside potty"}
                </span>
                {log.recentBeverageMl ? <em>Recent drink</em> : null}
                {log.outsideReason ? (
                  <em>{formatOutsideReason(log.outsideReason)}</em>
                ) : null}
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

function getTrainingPhase(profile: OnboardingProfile): TrainingPhase {
  return profile.trainingPhase ?? 1;
}

function getLogBanner(
  entry: PottyLogEntry,
  childName: string,
  nextPhase: TrainingPhase,
) {
  if (entry.location === "outside") {
    return `No reprimands. ${childName} is still learning; note the pattern and try the next calm prompt.`;
  }

  if (entry.type === "poo" && nextPhase === 2) {
    return `Phase 2 unlocked. ${childName}'s first potty poo is saved.`;
  }

  return `${entry.type === "pee" ? "Pee" : "Poo"} logged on the potty.`;
}

function formatOutsideReason(reason: OutsideReason) {
  switch (reason) {
    case "missed-cue":
      return "Missed cue";
    case "resisted-potty":
      return "Resisted potty";
    case "travel":
      return "Travel";
    case "other":
      return "Other";
  }
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
