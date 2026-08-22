"use client";

import { useState } from "react";
import { ChoiceRow } from "@/components/form/ChoiceRow";
import { FieldLabel } from "@/components/form/FieldLabel";
import { PrimaryButton } from "@/components/form/PrimaryButton";
import { inputStyle } from "@/components/form/styles";
import { Droplet, Swirl } from "@/components/icons";
import type { Profile } from "@/features/onboarding/types";
import type {
  Initiator,
  LogContext,
  LogKind,
  LogLocation,
  OutsideReason,
  PooStyle,
} from "@/features/logging/types";
import { fromDateTimeLocalValue, toDateTimeLocalValue } from "@/lib/time";

export interface LogSheetSubmission {
  kind: LogKind;
  location: LogLocation;
  initiator: Initiator;
  context: LogContext;
  reason: OutsideReason | null;
  pooStyle: PooStyle | null;
  ts: number;
}

interface LogSheetProps {
  profile: Profile;
  onClose: () => void;
  onSubmit: (entry: LogSheetSubmission) => void;
}

export function LogSheet({ profile, onClose, onSubmit }: LogSheetProps) {
  const [kind, setKind] = useState<LogKind>("pee");
  const [location, setLocation] = useState<LogLocation>("potty");
  const [initiator, setInitiator] = useState<Initiator>("child");
  const [reason, setReason] = useState<OutsideReason>("unaware");
  const [context, setContext] = useState<LogContext>("normal");
  const [pooStyle, setPooStyle] = useState<PooStyle>("unknown");
  const [when, setWhen] = useState(() => toDateTimeLocalValue(Date.now()));

  const showPooStyle = kind === "poo" || kind === "both";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(51,41,31,0.4)",
        display: "flex",
        alignItems: "flex-end",
        zIndex: 50,
      }}
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
        <div
          style={{
            width: 40,
            height: 4,
            background: "var(--line)",
            borderRadius: 4,
            margin: "8px auto 18px",
          }}
        />
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 22,
            color: "var(--ink)",
            marginBottom: 18,
          }}
        >
          Log a moment
        </div>

        <FieldLabel>What happened</FieldLabel>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {(
            [
              { v: "pee", l: "Pee" },
              { v: "poo", l: "Poo" },
              { v: "both", l: "Both" },
            ] as const
          ).map((o) => (
            <button
              key={o.v}
              onClick={() => setKind(o.v)}
              style={{
                flex: 1,
                padding: "14px 8px",
                borderRadius: 16,
                border: kind === o.v ? "1.5px solid var(--pee)" : "1.5px solid var(--line)",
                background: kind === o.v ? "var(--pee-soft)" : "var(--card)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              {o.v === "both" ? (
                <div style={{ display: "flex", gap: 3 }}>
                  <Droplet size={18} />
                  <Swirl size={18} />
                </div>
              ) : o.v === "poo" ? (
                <Swirl size={20} />
              ) : (
                <Droplet size={20} />
              )}
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: 12.5,
                  color: "var(--ink)",
                }}
              >
                {o.l}
              </span>
            </button>
          ))}
        </div>

        <FieldLabel>Where</FieldLabel>
        <ChoiceRow
          value={location}
          onChange={(v) => setLocation(v as LogLocation)}
          options={[
            { v: "potty", l: "On the potty" },
            { v: "outside", l: "Outside the potty" },
          ]}
        />

        {location === "potty" && (
          <>
            <FieldLabel>Who initiated</FieldLabel>
            <ChoiceRow
              value={initiator}
              onChange={(v) => setInitiator(v as Initiator)}
              options={[
                { v: "child", l: `${profile.name} asked / went` },
                { v: "parent", l: "You led her" },
              ]}
            />
            <FieldLabel>Context</FieldLabel>
            <ChoiceRow
              value={context}
              onChange={(v) => setContext(v as LogContext)}
              options={[
                { v: "normal", l: "Regular" },
                { v: "pre-nap", l: "Pre-nap" },
                { v: "post-nap", l: "Post-nap" },
              ]}
            />
          </>
        )}

        {location === "outside" && (
          <>
            <FieldLabel>What seemed to happen</FieldLabel>
            <ChoiceRow
              value={reason}
              onChange={(v) => setReason(v as OutsideReason)}
              options={[
                { v: "unaware", l: "Caught unaware" },
                { v: "refusal", l: "Refused when asked" },
                { v: "cheeky", l: "Cheeky / knew better" },
              ]}
            />
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
              Her body is still learning. No reprimand needed — a calm reset and an affirming word
              for next time goes further than a correction now.
            </div>
          </>
        )}

        {showPooStyle && (
          <>
            <FieldLabel>Did she seek privacy for this one?</FieldLabel>
            <ChoiceRow
              value={pooStyle}
              onChange={(v) => setPooStyle(v as PooStyle)}
              options={[
                { v: "hid", l: "Went to hide" },
                { v: "open", l: "Comfortable, in the open" },
                { v: "unknown", l: "Not sure" },
              ]}
            />
          </>
        )}

        <FieldLabel>When did this happen</FieldLabel>
        <input
          type="datetime-local"
          value={when}
          onChange={(e) => setWhen(e.target.value)}
          style={{ ...inputStyle, marginBottom: 20 }}
        />

        <div style={{ height: 6 }} />
        <PrimaryButton
          label="Save log"
          onClick={() =>
            onSubmit({
              kind,
              location,
              initiator: location === "potty" ? initiator : "accident",
              context: location === "potty" ? context : "normal",
              reason: location === "outside" ? reason : null,
              pooStyle: showPooStyle ? pooStyle : null,
              ts: fromDateTimeLocalValue(when),
            })
          }
        />
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
