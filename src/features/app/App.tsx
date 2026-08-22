"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { TabBar, type TabKey } from "@/components/TabBar";
import { Toast } from "@/components/Toast";
import { computeEngine } from "@/features/logging/engine";
import type { Beverage, PottyLog } from "@/features/logging/types";
import { Onboarding } from "@/features/onboarding/Onboarding";
import type { Profile } from "@/features/onboarding/types";
import { ExportSheet } from "@/features/profile/ExportSheet";
import { ProfileTab } from "@/features/profile/ProfileTab";
import { ActiveSleepBanner } from "@/features/sleep/ActiveSleepBanner";
import { EditLogSheet } from "@/features/logging/EditLogSheet";
import { EndSleepSheet, type EndSleepSubmission } from "@/features/sleep/EndSleepSheet";
import { SleepTab } from "@/features/sleep/SleepTab";
import { StartSleepSheet } from "@/features/sleep/StartSleepSheet";
import type { SleepLiquid, SleepSession } from "@/features/sleep/types";
import { LogSheet } from "@/features/today/LogSheet";
import { TodayTab } from "@/features/today/TodayTab";
import { TrendsTab } from "@/features/trends/TrendsTab";
import * as storage from "@/lib/storage";
import { MIN } from "@/lib/time";
import { Shell } from "./Shell";

const K_PROFILE = "potty:profile";
const K_LOGS = "potty:logs";
const K_BEV = "potty:beverage";
const K_SLEEP = "potty:sleep";

function makeId(prefix?: string): string {
  const base = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  return prefix ? `${prefix}-${base}` : base;
}

function logLine(entry: PottyLog, profile: Profile | undefined): string {
  const name = profile?.name || "She";
  if (entry.location === "outside") return "Logged — noted gently, no reprimand needed.";
  if (entry.kind === "both") return `${name}'s pee and poo logged. Nicely done.`;
  return `${name}'s ${entry.kind} logged.`;
}

export function App() {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [logs, setLogs] = useState<PottyLog[]>([]);
  const [beverage, setBeverage] = useState<Beverage | undefined>(undefined);
  const [sleepSessions, setSleepSessions] = useState<SleepSession[]>([]);
  const [tab, setTab] = useState<TabKey>("today");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [startSleepKind, setStartSleepKind] = useState<"nap" | "night" | null>(null);
  const [endSleepId, setEndSleepId] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<PottyLog | null>(null);
  const [now, setNow] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    (async () => {
      try {
        const [loadedProfile, loadedLogs, loadedBeverage, loadedSleep] = await Promise.all([
          storage.get<Profile>(K_PROFILE),
          storage.get<PottyLog[]>(K_LOGS),
          storage.get<Beverage>(K_BEV),
          storage.get<SleepSession[]>(K_SLEEP),
        ]);
        setProfile(loadedProfile ?? null);
        setLogs(loadedLogs ?? []);
        setBeverage(loadedBeverage);
        setSleepSessions(loadedSleep ?? []);
      } finally {
        setNow(Date.now());
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }

  async function saveProfile(next: Profile) {
    setProfile(next);
    await storage.set(K_PROFILE, next);
  }
  async function saveLogs(next: PottyLog[]) {
    setLogs(next);
    await storage.set(K_LOGS, next);
  }
  async function saveBeverage(next: Beverage | undefined) {
    setBeverage(next);
    if (next) await storage.set(K_BEV, next);
    else await storage.remove(K_BEV);
  }
  async function saveSleep(next: SleepSession[]) {
    setSleepSessions(next);
    await storage.set(K_SLEEP, next);
  }

  function addLog(entry: Omit<PottyLog, "id" | "ts"> & { ts?: number }) {
    const withId: PottyLog = { ...entry, id: makeId(), ts: entry.ts ?? Date.now() };
    const next = [...logs, withId];
    saveLogs(next);
    if (entry.location === "potty") {
      saveBeverage(undefined);
    }
    if (
      profile &&
      profile.phase !== "pee+poo" &&
      (entry.kind === "poo" || entry.kind === "both") &&
      entry.location === "potty"
    ) {
      saveProfile({ ...profile, phase: "pee+poo" });
      showToast(`Phase two unlocked — ${profile.name} had a potty poo. Following her lead now.`);
    } else if (entry.silent) {
      // no toast, e.g. auto-generated from a sleep session
    } else {
      showToast(logLine(withId, profile ?? undefined));
    }
    setSheetOpen(false);
    return withId;
  }

  function updateLogTime(id: string, ts: number) {
    saveLogs(logs.map((l) => (l.id === id ? { ...l, ts } : l)));
    setEditingLog(null);
  }

  function startSleepSession(kind: "nap" | "night", liquid: SleepLiquid, estMinutes: number) {
    const session: SleepSession = {
      id: makeId("sleep"),
      kind,
      startTs: Date.now(),
      liquid,
      estMinutes,
      status: "active",
    };
    saveSleep([...sleepSessions, session]);
    showToast(
      kind === "nap"
        ? "Nap started — I'll help you watch the window."
        : "Night tracking started. Sleep well.",
    );
  }

  function endSleepSession(id: string, { actualMinutes, outcome, wetMinutesIn, wetUnknown }: EndSleepSubmission) {
    const session = sleepSessions.find((s) => s.id === id);
    if (!session) return;
    const endTs = session.startTs + actualMinutes * MIN;
    const wetTs = outcome === "wet" && !wetUnknown ? session.startTs + wetMinutesIn * MIN : null;
    const updated: SleepSession = {
      ...session,
      status: "done",
      endTs,
      actualMinutes,
      outcome,
      wetTs,
      wetUnknown: outcome === "wet" ? wetUnknown : false,
    };
    saveSleep(sleepSessions.map((s) => (s.id === id ? updated : s)));
    if (outcome === "wet") {
      addLog({
        kind: "pee",
        location: "sleep",
        initiator: "accident",
        context: session.kind === "nap" ? "during-nap" : "during-night",
        reason: null,
        pooStyle: null,
        sleepKind: session.kind,
        ts: wetTs || endTs,
        silent: true,
      });
      showToast(
        session.kind === "nap"
          ? "Nap outcome logged. Wet naps are useful data, not setbacks."
          : "Night outcome logged. This helps map what she can hold overnight.",
      );
    } else {
      showToast(session.kind === "nap" ? "Dry nap logged — nice." : "Dry night logged — great data point.");
    }
    setEndSleepId(null);
  }

  const engine = useMemo(() => computeEngine(logs, beverage, now), [logs, beverage, now]);
  const activeSleep = sleepSessions.find((s) => s.status === "active");

  if (!ready) {
    return (
      <Shell>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink-soft)" }}>loading…</div>
        </div>
      </Shell>
    );
  }

  if (!profile || !profile.onboarded) {
    return (
      <Shell>
        <Onboarding onDone={(p) => saveProfile(p)} />
      </Shell>
    );
  }

  return (
    <Shell>
      <Header profile={profile} />
      {activeSleep && (
        <ActiveSleepBanner
          session={activeSleep}
          now={now}
          onOpen={() => {
            setTab("sleep");
            setEndSleepId(activeSleep.id);
          }}
        />
      )}
      <div style={{ padding: "0 18px 100px" }}>
        {tab === "today" && (
          <TodayTab
            profile={profile}
            logs={logs}
            engine={engine}
            beverage={beverage}
            now={now}
            onExtraDrink={() => {
              saveBeverage({ at: Date.now() });
              showToast("Noted — running a shorter interval until she's had a chance to go.");
            }}
            onClearDrink={() => saveBeverage(undefined)}
            onOpenSheet={() => setSheetOpen(true)}
            onEditLog={(log) => setEditingLog(log)}
          />
        )}
        {tab === "sleep" && (
          <SleepTab
            sleepSessions={sleepSessions}
            onStart={(kind) => setStartSleepKind(kind)}
            onEnd={(id) => setEndSleepId(id)}
          />
        )}
        {tab === "trends" && <TrendsTab logs={logs} profile={profile} now={now} />}
        {tab === "profile" && <ProfileTab profile={profile} onExport={() => setExportOpen(true)} />}
      </div>
      <TabBar tab={tab} setTab={setTab} />
      {sheetOpen && <LogSheet profile={profile} onClose={() => setSheetOpen(false)} onSubmit={addLog} />}
      {startSleepKind && (
        <StartSleepSheet
          kind={startSleepKind}
          onClose={() => setStartSleepKind(null)}
          onSubmit={(liquid, estMinutes) => {
            startSleepSession(startSleepKind, liquid, estMinutes);
            setStartSleepKind(null);
          }}
        />
      )}
      {endSleepId && (
        <EndSleepSheet
          session={sleepSessions.find((s) => s.id === endSleepId)}
          now={now}
          onClose={() => setEndSleepId(null)}
          onSubmit={(payload) => endSleepSession(endSleepId, payload)}
        />
      )}
      {editingLog && (
        <EditLogSheet
          log={editingLog}
          onClose={() => setEditingLog(null)}
          onSave={(ts) => updateLogTime(editingLog.id, ts)}
        />
      )}
      {toast && <Toast text={toast} />}
      {exportOpen && (
        <ExportSheet profile={profile} logs={logs} sleepSessions={sleepSessions} onClose={() => setExportOpen(false)} />
      )}
    </Shell>
  );
}

