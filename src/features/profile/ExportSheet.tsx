"use client";

import { useState } from "react";
import { downloadFile, logsToCSV, sleepToCSV } from "@/lib/export";
import type { PottyLog } from "@/features/logging/types";
import type { Profile } from "@/features/onboarding/types";
import type { SleepSession } from "@/features/sleep/types";

interface ExportSheetProps {
  profile: Profile;
  logs: PottyLog[];
  sleepSessions: SleepSession[];
  onClose: () => void;
}

export function ExportSheet({ profile, logs, sleepSessions, onClose }: ExportSheetProps) {
  const [status, setStatus] = useState<string | null>(null);
  const doneSleep = sleepSessions.filter((s) => s.status === "done");
  const dateStamp = new Date().toISOString().slice(0, 10);

  function handle(kind: "logs" | "sleep" | "json") {
    let ok = false;
    if (kind === "logs") {
      ok = downloadFile(`${profile.name.toLowerCase()}-potty-logs-${dateStamp}.csv`, logsToCSV(logs), "text/csv");
    } else if (kind === "sleep") {
      ok = downloadFile(`${profile.name.toLowerCase()}-sleep-sessions-${dateStamp}.csv`, sleepToCSV(sleepSessions), "text/csv");
    } else {
      ok = downloadFile(
        `${profile.name.toLowerCase()}-full-backup-${dateStamp}.json`,
        JSON.stringify({ profile, logs, sleepSessions }, null, 2),
        "application/json",
      );
    }
    setStatus(ok ? "Downloaded." : "Download didn't start — your browser may be blocking it.");
    setTimeout(() => setStatus(null), 3000);
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(51,41,31,0.4)", display: "flex", alignItems: "flex-end", zIndex: 50 }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="riseIn"
        style={{ background: "var(--bg)", width: "100%", maxWidth: 480, margin: "0 auto", borderRadius: "26px 26px 0 0", padding: "10px 20px 28px", maxHeight: "88vh", overflowY: "auto" }}
      >
        <div style={{ width: 40, height: 4, background: "var(--line)", borderRadius: 4, margin: "8px auto 18px" }} />
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 22, color: "var(--ink)", marginBottom: 6 }}>
          Export data
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-soft)", marginBottom: 20, lineHeight: 1.5 }}>
          {logs.length} potty log{logs.length === 1 ? "" : "s"} and {doneSleep.length} completed sleep
          session{doneSleep.length === 1 ? "" : "s"}, ready to take out and look at however you like.
        </div>

        <ExportRow title="Potty logs (CSV)" desc="Every pee, poo, and outside-potty entry — one row per log." onClick={() => handle("logs")} />
        <ExportRow title="Sleep sessions (CSV)" desc="Naps and nights, with liquid timing and dry/wet outcome." onClick={() => handle("sleep")} />
        <ExportRow title="Full backup (JSON)" desc="Everything, including your profile — good for safekeeping." onClick={() => handle("json")} />

        {status && (
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: "var(--ink-soft)", textAlign: "center", marginTop: 10 }}>
            {status}
          </div>
        )}

        <button onClick={onClose} style={{ width: "100%", marginTop: 16, background: "none", border: "none", color: "var(--ink-soft)", fontFamily: "var(--font-body)", fontSize: 13, padding: 8 }}>
          Close
        </button>
      </div>
    </div>
  );
}

function ExportRow({ title, desc, onClick }: { title: string; desc: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: 16,
        padding: "14px 16px",
        marginBottom: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
      }}
    >
      <div>
        <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{title}</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-soft)", marginTop: 2 }}>{desc}</div>
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--pee)", flexShrink: 0 }}>Download ↓</div>
    </button>
  );
}
