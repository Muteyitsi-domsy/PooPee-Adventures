"use client";

import { useMemo, useState } from "react";
import { StatChip } from "@/components/StatChip";
import { Cloud, Moon } from "@/components/icons";
import { fmtDay, fmtMins, fmtTime } from "@/lib/time";
import { LIQUID_TYPES } from "./constants";
import { computeSleepStats, timingLabel } from "./stats";
import type { SleepSession } from "./types";

interface SleepTabProps {
  sleepSessions: SleepSession[];
  onStart: (kind: "nap" | "night") => void;
  onEnd: (id: string) => void;
}

export function SleepTab({ sleepSessions, onStart, onEnd }: SleepTabProps) {
  const [view, setView] = useState<"nap" | "night">("nap");
  const active = sleepSessions.find((s) => s.status === "active" && s.kind === view);
  const stats = useMemo(() => computeSleepStats(sleepSessions, view), [sleepSessions, view]);
  const history = sleepSessions
    .filter((s) => s.kind === view && s.status === "done")
    .sort((a, b) => b.startTs - a.startTs);
  const color = view === "nap" ? "var(--nap)" : "var(--night)";
  const soft = view === "nap" ? "var(--nap-soft)" : "var(--night-soft)";

  return (
    <div className="riseIn">
      <div style={{ display: "flex", gap: 8, margin: "18px 0" }}>
        {(
          [
            { v: "nap", l: "Naps" },
            { v: "night", l: "Night" },
          ] as const
        ).map((o) => (
          <button
            key={o.v}
            onClick={() => setView(o.v)}
            style={{
              flex: 1,
              padding: "10px 8px",
              borderRadius: 12,
              border: view === o.v ? "1.5px solid var(--ink)" : "1.5px solid var(--line)",
              background: view === o.v ? "var(--ink)" : "var(--card)",
              color: view === o.v ? "#fff" : "var(--ink)",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {o.l}
          </button>
        ))}
      </div>

      {!active ? (
        <button
          onClick={() => onStart(view)}
          style={{
            width: "100%",
            padding: "18px",
            borderRadius: 18,
            border: "none",
            background: color,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          {view === "nap" ? <Cloud size={18} color="#fff" /> : <Moon size={18} color="#fff" />}
          Start {view === "nap" ? "nap" : "night"} tracking
        </button>
      ) : (
        <button
          onClick={() => onEnd(active.id)}
          style={{
            width: "100%",
            padding: "18px",
            borderRadius: 18,
            border: `1.5px solid ${color}`,
            background: soft,
            color: "var(--ink)",
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: 14.5,
          }}
        >
          {view === "nap" ? "Nap" : "Night"} in progress since {fmtTime(active.startTs)} · log outcome
        </button>
      )}

      {view === "night" && (
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.5, marginTop: 12, padding: "0 2px" }}>
          Night training builds on day mastery — this just quietly gathers the liquid-and-length
          picture so, whenever you&apos;re ready to work on staying dry overnight, the pattern is
          already there.
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <StatChip label="Dry rate" value={stats.dryPct === null ? "—" : `${stats.dryPct}%`} accent={color} />
        <StatChip label={`Avg ${view === "nap" ? "nap" : "night"}`} value={stats.avgMinutes ? fmtMins(stats.avgMinutes) : "—"} />
      </div>

      {stats.rows.length > 0 && (
        <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 18, padding: "18px 16px", marginTop: 16 }}>
          <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 14, color: "var(--ink)", marginBottom: 4 }}>
            Dryness by liquid timing
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-soft)", marginBottom: 14 }}>
            How close to sleep she drank, and how often she stayed dry
          </div>
          {stats.rows.map((r) => (
            <div key={r.label} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-body)", fontSize: 12.5, color: "var(--ink)", marginBottom: 4 }}>
                <span>{r.label}</span>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--ink-soft)" }}>
                  {r.dryPct}% dry · {r.total}
                </span>
              </div>
              <div style={{ height: 7, borderRadius: 4, background: "var(--line)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${r.dryPct}%`, background: color, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 15, color: "var(--ink)", marginTop: 24, marginBottom: 10 }}>
        History
      </div>
      {history.length === 0 && (
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--ink-soft)", padding: "10px 0 30px" }}>
          No completed {view === "nap" ? "naps" : "nights"} logged yet.
        </div>
      )}
      {history.slice(0, 30).map((s) => (
        <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 4px", borderBottom: "1px solid var(--line)" }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: s.outcome === "wet" ? "var(--alert-soft)" : soft,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {view === "nap" ? (
              <Cloud size={17} color={s.outcome === "wet" ? "var(--alert)" : color} />
            ) : (
              <Moon size={17} color={s.outcome === "wet" ? "var(--alert)" : color} />
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>
              {s.outcome === "wet" ? "Wet" : "Dry"} · {fmtMins(s.actualMinutes ?? 0)}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--ink-soft)", marginTop: 2 }}>
              {fmtDay(s.startTs)} · started {fmtTime(s.startTs)}
              {s.liquid?.had
                ? ` · ${LIQUID_TYPES.find((t) => t.v === s.liquid.type)?.l.toLowerCase()} ${timingLabel(s.liquid.mins).toLowerCase()}`
                : " · no liquid noted"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
