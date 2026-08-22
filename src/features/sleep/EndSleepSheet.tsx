"use client";

import { useState } from "react";
import { ChoiceRow } from "@/components/form/ChoiceRow";
import { FieldLabel } from "@/components/form/FieldLabel";
import { PrimaryButton } from "@/components/form/PrimaryButton";
import { Moon, Cloud } from "@/components/icons";
import { fmtMins, MIN } from "@/lib/time";
import { LIQUID_TIMING, LIQUID_TYPES } from "./constants";
import type { SleepSession } from "./types";

export interface EndSleepSubmission {
  actualMinutes: number;
  outcome: "dry" | "wet";
  wetMinutesIn: number;
  wetUnknown: boolean;
}

interface EndSleepSheetProps {
  session: SleepSession | undefined;
  now: number;
  onClose: () => void;
  onSubmit: (payload: EndSleepSubmission) => void;
}

export function EndSleepSheet({ session, now, onClose, onSubmit }: EndSleepSheetProps) {
  if (!session) return null;
  return <EndSleepSheetForm session={session} now={now} onClose={onClose} onSubmit={onSubmit} />;
}

function EndSleepSheetForm({
  session,
  now,
  onClose,
  onSubmit,
}: {
  session: SleepSession;
  now: number;
  onClose: () => void;
  onSubmit: (payload: EndSleepSubmission) => void;
}) {
  const isNight = session.kind === "night";
  const color = isNight ? "var(--night)" : "var(--nap)";
  const soft = isNight ? "var(--night-soft)" : "var(--nap-soft)";
  const elapsedMinutes = Math.round((now - session.startTs) / MIN);
  const [actualMinutes, setActualMinutes] = useState(Math.max(session.estMinutes, elapsedMinutes, 15));
  const [outcome, setOutcome] = useState<"dry" | "wet">("dry");
  const [wetPct, setWetPct] = useState(60);
  const [wetUnknown, setWetUnknown] = useState(false);

  const wetMinutesIn = Math.round((wetPct / 100) * actualMinutes);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(51,41,31,0.4)", display: "flex", alignItems: "flex-end", zIndex: 50 }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="riseIn"
        style={{ background: "var(--bg)", width: "100%", maxWidth: 480, margin: "0 auto", borderRadius: "26px 26px 0 0", padding: "10px 20px 28px", maxHeight: "88vh", overflowY: "auto" }}
      >
        <div style={{ width: 40, height: 4, background: "var(--line)", borderRadius: 4, margin: "8px auto 18px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: soft, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {isNight ? <Moon size={18} color={color} /> : <Cloud size={18} color={color} />}
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 22, color: "var(--ink)" }}>
            {isNight ? "Night" : "Nap"} outcome
          </div>
        </div>

        {session.liquid?.had && (
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 16 }}>
            {LIQUID_TYPES.find((t) => t.v === session.liquid.type)?.l} ·{" "}
            {LIQUID_TIMING.find((t) => t.v === session.liquid.timing)?.l.toLowerCase()}
          </div>
        )}

        <FieldLabel>Actual length</FieldLabel>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <input
            type="range"
            min="15"
            max={isNight ? 900 : 210}
            step="5"
            value={actualMinutes}
            onChange={(e) => setActualMinutes(Number(e.target.value))}
            style={{ flex: 1, accentColor: color }}
          />
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--ink)", minWidth: 68 }}>
            {fmtMins(actualMinutes)}
          </div>
        </div>

        <FieldLabel>Outcome</FieldLabel>
        <ChoiceRow
          value={outcome}
          onChange={(v) => setOutcome(v as "dry" | "wet")}
          options={[
            { v: "dry", l: "Dry" },
            { v: "wet", l: "Wet" },
          ]}
        />

        {outcome === "wet" && (
          <>
            <FieldLabel>Roughly when</FieldLabel>
            <ChoiceRow
              value={wetUnknown ? "unknown" : "known"}
              onChange={(v) => setWetUnknown(v === "unknown")}
              options={[
                { v: "known", l: "I can estimate" },
                { v: "unknown", l: "Not sure" },
              ]}
            />
            {!wetUnknown && (
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <input
                  type="range"
                  min="5"
                  max="95"
                  step="5"
                  value={wetPct}
                  onChange={(e) => setWetPct(Number(e.target.value))}
                  style={{ flex: 1, accentColor: "var(--alert)" }}
                />
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink)", minWidth: 68 }}>
                  ~{fmtMins(wetMinutesIn)} in
                </div>
              </div>
            )}
            <div
              style={{
                background: "var(--child-soft)",
                borderRadius: 14,
                padding: "12px 14px",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--ink)",
                lineHeight: 1.5,
                marginBottom: 6,
              }}
            >
              This is useful information about what she can hold right now, not a setback — no need
              to make anything of it with her.
            </div>
          </>
        )}

        <div style={{ height: 6 }} />
        <PrimaryButton
          label="Save outcome"
          onClick={() => onSubmit({ actualMinutes, outcome, wetMinutesIn, wetUnknown })}
        />
        <button
          onClick={onClose}
          style={{ width: "100%", marginTop: 10, background: "none", border: "none", color: "var(--ink-soft)", fontFamily: "var(--font-body)", fontSize: 13, padding: 8 }}
        >
          Not yet
        </button>
      </div>
    </div>
  );
}
