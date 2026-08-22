"use client";

import { useState } from "react";
import { ChoiceRow } from "@/components/form/ChoiceRow";
import { FieldLabel } from "@/components/form/FieldLabel";
import { PrimaryButton } from "@/components/form/PrimaryButton";
import { Cloud, Moon } from "@/components/icons";
import { fmtMins } from "@/lib/time";
import { LIQUID_TIMING, LIQUID_TYPES } from "./constants";
import type { LiquidTimingValue, LiquidTypeValue, SleepLiquid } from "./types";

interface StartSleepSheetProps {
  kind: "nap" | "night";
  onClose: () => void;
  onSubmit: (liquid: SleepLiquid, estMinutes: number) => void;
}

export function StartSleepSheet({ kind, onClose, onSubmit }: StartSleepSheetProps) {
  const isNight = kind === "night";
  const [had, setHad] = useState(true);
  const [type, setType] = useState<LiquidTypeValue>("milk");
  const [timing, setTiming] = useState<LiquidTimingValue>(isNight ? "just" : "30-60");
  const [estMinutes, setEstMinutes] = useState(isNight ? 630 : 90);
  const color = isNight ? "var(--night)" : "var(--nap)";
  const soft = isNight ? "var(--night-soft)" : "var(--nap-soft)";

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(51,41,31,0.4)", display: "flex", alignItems: "flex-end", zIndex: 50 }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="riseIn"
        style={{
          background: "var(--bg)",
          width: "100%",
          maxWidth: 480,
          margin: "0 auto",
          borderRadius: "26px 26px 0 0",
          padding: "10px 20px 28px",
          maxHeight: "88vh",
          overflowY: "auto",
        }}
      >
        <div style={{ width: 40, height: 4, background: "var(--line)", borderRadius: 4, margin: "8px auto 18px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: soft,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isNight ? <Moon size={18} color={color} /> : <Cloud size={18} color={color} />}
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 22, color: "var(--ink)" }}>
            Start {isNight ? "night" : "nap"}
          </div>
        </div>

        <FieldLabel>Did she have a drink beforehand?</FieldLabel>
        <ChoiceRow
          value={had ? "yes" : "no"}
          onChange={(v) => setHad(v === "yes")}
          options={[
            { v: "yes", l: "Yes" },
            { v: "no", l: "No" },
          ]}
        />

        {had && (
          <>
            <FieldLabel>What</FieldLabel>
            <ChoiceRow
              value={type}
              onChange={(v) => setType(v as LiquidTypeValue)}
              options={LIQUID_TYPES.map((t) => ({ v: t.v, l: t.l }))}
            />
            <FieldLabel>How long before {isNight ? "bed" : "the nap"}</FieldLabel>
            <ChoiceRow
              value={timing}
              onChange={(v) => setTiming(v as LiquidTimingValue)}
              options={LIQUID_TIMING.map((t) => ({ v: t.v, l: t.l }))}
            />
          </>
        )}

        <FieldLabel>Estimated {isNight ? "night" : "nap"} length — adjust anytime</FieldLabel>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
          <input
            type="range"
            min={isNight ? 480 : 30}
            max={isNight ? 780 : 180}
            step="15"
            value={estMinutes}
            onChange={(e) => setEstMinutes(Number(e.target.value))}
            style={{ flex: 1, accentColor: color }}
          />
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--ink)", minWidth: 68 }}>
            {fmtMins(estMinutes)}
          </div>
        </div>

        <PrimaryButton
          label={`Start ${isNight ? "night" : "nap"} tracking`}
          onClick={() => {
            const timingMeta = LIQUID_TIMING.find((t) => t.v === timing)!;
            onSubmit(had ? { had: true, type, timing, mins: timingMeta.mins } : { had: false }, estMinutes);
          }}
        />
        <button
          onClick={onClose}
          style={{ width: "100%", marginTop: 10, background: "none", border: "none", color: "var(--ink-soft)", fontFamily: "var(--font-body)", fontSize: 13, padding: 8 }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
