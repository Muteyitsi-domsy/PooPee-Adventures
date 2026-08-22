import { StatChip } from "@/components/StatChip";
import { Cup } from "@/components/icons";
import { LogRow } from "@/features/logging/LogRow";
import type { Beverage, EngineResult, PottyLog } from "@/features/logging/types";
import type { Profile } from "@/features/onboarding/types";
import { fmtDuration, fmtTime, HR, isSameDay } from "@/lib/time";
import { DropletGauge } from "./DropletGauge";

interface TodayTabProps {
  profile: Profile;
  logs: PottyLog[];
  engine: EngineResult;
  beverage: Beverage | undefined;
  now: number;
  onExtraDrink: () => void;
  onClearDrink: () => void;
  onOpenSheet: () => void;
  onEditLog: (log: PottyLog) => void;
}

export function TodayTab({
  profile,
  logs,
  engine,
  beverage,
  now,
  onExtraDrink,
  onClearDrink,
  onOpenSheet,
  onEditLog,
}: TodayTabProps) {
  const remainingMs = engine.nextTs - now;
  const totalMs = engine.adjustedMs || 2 * HR;
  const elapsedSince = engine.lastSuccess ? now - engine.lastSuccess.ts : totalMs * 0.25;
  const percent = totalMs > 0 ? elapsedSince / totalMs : 0;

  const todays = logs.filter((l) => isSameDay(l.ts, now)).sort((a, b) => b.ts - a.ts);
  const initiated = todays.filter((l) => l.initiator === "child").length;
  const potties = todays.filter((l) => l.location === "potty").length;
  const childPct = potties ? Math.round((initiated / potties) * 100) : null;

  const overdue = remainingMs < 0;

  return (
    <div className="riseIn">
      {beverage && now - beverage.at < 2.5 * HR && (
        <div
          style={{
            background: "var(--alert-soft)",
            border: "1px solid var(--alert)",
            borderRadius: 14,
            padding: "12px 14px",
            marginTop: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13.5,
              color: "var(--ink)",
              lineHeight: 1.4,
            }}
          >
            <strong>Vigilant mode</strong> — extra beverage at {fmtTime(beverage.at)}. Checking in
            more often.
          </div>
          <button
            onClick={onClearDrink}
            style={{
              background: "none",
              border: "none",
              color: "var(--ink-soft)",
              fontSize: 12,
              fontFamily: "var(--font-mono)",
              whiteSpace: "nowrap",
            }}
          >
            clear
          </button>
        </div>
      )}

      <div
        style={{
          background: "var(--card)",
          borderRadius: 22,
          padding: "24px 18px",
          marginTop: 16,
          border: "1px solid var(--line)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <DropletGauge
          percent={percent}
          label={overdue ? "Any time now" : fmtDuration(remainingMs)}
          sub={
            engine.hasData
              ? `Suggested nudge · ${fmtTime(engine.nextTs)}`
              : `Learning her rhythm — estimate · ${fmtTime(engine.nextTs)}`
          }
        />
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            color: "var(--ink-soft)",
            marginTop: 14,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          {overdue
            ? `It's around ${profile.name}'s usual window — a gentle, low-pressure invitation now.`
            : `Based on her own recent pattern, not a fixed clock.`}
        </div>
      </div>

      <button
        onClick={onOpenSheet}
        style={{
          width: "100%",
          marginTop: 16,
          padding: "20px 18px",
          borderRadius: 20,
          border: "none",
          background: "linear-gradient(135deg, var(--pee), var(--poo))",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 18,
          boxShadow: "0 8px 20px -6px rgba(107,147,166,0.5)",
        }}
      >
        + Log a moment
      </button>

      <button
        onClick={onExtraDrink}
        style={{
          width: "100%",
          marginTop: 10,
          padding: "13px 16px",
          borderRadius: 16,
          border: "1px solid var(--line)",
          background: "var(--card)",
          color: "var(--ink)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          fontFamily: "var(--font-body)",
          fontWeight: 700,
          fontSize: 13.5,
        }}
      >
        <Cup size={16} color="var(--alert)" /> She had extra juice / porridge
      </button>

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <StatChip label="Today" value={`${todays.length} logged`} />
        <StatChip
          label="Child-led"
          value={childPct === null ? "—" : `${childPct}%`}
          accent="var(--child)"
        />
      </div>

      <div
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 800,
          fontSize: 15,
          color: "var(--ink)",
          marginTop: 26,
          marginBottom: 10,
        }}
      >
        Today&apos;s log
      </div>
      {todays.length === 0 && (
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13.5,
            color: "var(--ink-soft)",
            padding: "18px 0",
          }}
        >
          Nothing logged yet today — the first entry will start shaping her pattern.
        </div>
      )}
      {todays.map((l) => (
        <LogRow key={l.id} log={l} onEdit={() => onEditLog(l)} />
      ))}
    </div>
  );
}
