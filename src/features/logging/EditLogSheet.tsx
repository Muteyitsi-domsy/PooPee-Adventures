"use client";

import { useState } from "react";
import { FieldLabel } from "@/components/form/FieldLabel";
import { PrimaryButton } from "@/components/form/PrimaryButton";
import { inputStyle } from "@/components/form/styles";
import { fromDateTimeLocalValue, toDateTimeLocalValue } from "@/lib/time";
import type { PottyLog } from "./types";

interface EditLogSheetProps {
  log: PottyLog;
  onClose: () => void;
  onSave: (ts: number) => void;
}

export function EditLogSheet({ log, onClose, onSave }: EditLogSheetProps) {
  const [when, setWhen] = useState(() => toDateTimeLocalValue(log.ts));

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
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 22,
            color: "var(--ink)",
            marginBottom: 18,
          }}
        >
          Edit time
        </div>

        <FieldLabel>When did this happen</FieldLabel>
        <input
          type="datetime-local"
          value={when}
          onChange={(e) => setWhen(e.target.value)}
          style={{ ...inputStyle, marginBottom: 20 }}
        />

        <PrimaryButton label="Save" onClick={() => onSave(fromDateTimeLocalValue(when, log.ts))} />
        <button
          onClick={onClose}
          style={{
            width: "100%",
            marginTop: 10,
            background: "none",
            border: "none",
            color: "var(--ink-soft)",
            fontFamily: "var(--font-body)",
            fontSize: 13,
            padding: 8,
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
