"use client";

import { useMemo, useState } from "react";
import { StatChip } from "@/components/StatChip";
import { LogRow } from "@/features/logging/LogRow";
import type { PottyLog } from "@/features/logging/types";
import type { Profile } from "@/features/onboarding/types";
import { dayKey, fmtDay, HR } from "@/lib/time";
import { computeProgress } from "./progress";
import { ProgressBar } from "./ProgressBar";

interface TrendsTabProps {
  logs: PottyLog[];
  profile: Profile;
  now: number;
}

type Range = "day" | "week" | "month";

interface DayBucket {
  ts: number;
  pee: number;
  poo: number;
  outside: number;
  child: number;
  potty: number;
}

export function TrendsTab({ logs, profile, now }: TrendsTabProps) {
  const [range, setRange] = useState<Range>("week");

  const days = range === "day" ? 1 : range === "week" ? 7 : 30;
  const cutoff = now - days * 24 * HR;
  const scoped = logs.filter((l) => l.ts >= cutoff);

  const buckets = useMemo(() => {
    const map: Record<string, DayBucket> = {};
    scoped.forEach((l) => {
      const k = dayKey(l.ts);
      if (!map[k]) map[k] = { ts: l.ts, pee: 0, poo: 0, outside: 0, child: 0, potty: 0 };
      if (l.location === "outside") map[k].outside++;
      else if (l.location === "potty") {
        map[k].potty++;
        if (l.kind === "pee" || l.kind === "both") map[k].pee++;
        if (l.kind === "poo" || l.kind === "both") map[k].poo++;
        if (l.initiator === "child") map[k].child++;
      }
    });
    return Object.values(map).sort((a, b) => a.ts - b.ts);
  }, [scoped]);

  const totalPotty = scoped.filter((l) => l.location === "potty").length;
  const totalChild = scoped.filter((l) => l.location === "potty" && l.initiator === "child").length;
  const totalOutside = scoped.filter((l) => l.location === "outside").length;
  const childPct = totalPotty ? Math.round((totalChild / totalPotty) * 100) : null;
  const maxCount = Math.max(1, ...buckets.map((b) => b.pee + b.poo));

  const peeProgress = useMemo(() => computeProgress(logs, "pee"), [logs]);
  const pooProgress = useMemo(() => computeProgress(logs, "poo"), [logs]);

  return (
    <div className="riseIn">
      <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 18, padding: "18px 16px", marginTop: 18 }}>
        <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 14, color: "var(--ink)", marginBottom: 2 }}>
          Overall training progress
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-soft)", marginBottom: 16 }}>
          All-time, out of every pee/poo logged — the goal is 100% on the potty, child-led
        </div>
        <ProgressBar label="Pee" color="var(--pee)" data={peeProgress} name={profile.name} />
        <div style={{ height: 18 }} />
        <ProgressBar label="Poo" color="var(--poo)" data={pooProgress} name={profile.name} locked={profile.phase !== "pee+poo"} />
      </div>

      <div style={{ display: "flex", gap: 8, margin: "18px 0" }}>
        {(
          [
            { v: "day", l: "Day" },
            { v: "week", l: "Week" },
            { v: "month", l: "Month" },
          ] as const
        ).map((o) => (
          <button
            key={o.v}
            onClick={() => setRange(o.v)}
            style={{
              flex: 1,
              padding: "10px 8px",
              borderRadius: 12,
              border: range === o.v ? "1.5px solid var(--ink)" : "1.5px solid var(--line)",
              background: range === o.v ? "var(--ink)" : "var(--card)",
              color: range === o.v ? "#fff" : "var(--ink)",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {o.l}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <StatChip label="Child-initiated" value={childPct === null ? "—" : `${childPct}%`} accent="var(--child)" />
        <StatChip label="Outside potty" value={totalOutside} accent="var(--alert)" />
      </div>

      <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 18, padding: "18px 16px", marginTop: 16 }}>
        <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 14, color: "var(--ink)", marginBottom: 14 }}>
          Successes by day
        </div>
        {buckets.length === 0 && (
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-soft)" }}>No logs in this range yet.</div>
        )}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 110 }}>
          {buckets.map((b, i) => {
            const total = b.pee + b.poo;
            const h = Math.max(4, (total / maxCount) * 100);
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-soft)", marginBottom: 3 }}>{total || ""}</div>
                <div
                  style={{
                    width: "100%",
                    height: `${h}%`,
                    borderRadius: 6,
                    background: "linear-gradient(180deg, var(--pee), var(--poo))",
                    opacity: 0.85,
                  }}
                />
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: "var(--ink-soft)", marginTop: 5 }}>
                  {new Date(b.ts).toLocaleDateString([], { weekday: "narrow" })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 15, color: "var(--ink)", marginTop: 24, marginBottom: 10 }}>
        Entries
      </div>
      {[...scoped]
        .sort((a, b) => b.ts - a.ts)
        .slice(0, 40)
        .map((l) => (
          <div key={l.id}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--ink-soft)", marginTop: 10 }}>
              {fmtDay(l.ts)}
            </div>
            <LogRow log={l} />
          </div>
        ))}
      {scoped.length === 0 && (
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--ink-soft)", padding: "10px 0 30px" }}>
          Once you log a few moments, {profile.name}&apos;s pattern will start showing up here.
        </div>
      )}
    </div>
  );
}
