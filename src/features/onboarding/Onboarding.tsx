"use client";

import { useState } from "react";
import { ChoiceRow } from "@/components/form/ChoiceRow";
import { FieldLabel } from "@/components/form/FieldLabel";
import { PrimaryButton } from "@/components/form/PrimaryButton";
import { inputStyle } from "@/components/form/styles";
import { scoreReadiness } from "./readiness";
import type { FollowsInstructions, Profile, PottyExposure } from "./types";

interface OnboardingProps {
  onDone: (profile: Profile) => void;
}

export function Onboarding({ onDone }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [ageMonths, setAgeMonths] = useState(24);
  const [follows, setFollows] = useState<FollowsInstructions>("sometimes");
  const [exposure, setExposure] = useState<PottyExposure>("occasional");

  const readiness = scoreReadiness({ ageMonths, follows, exposure });

  return (
    <div style={{ padding: "40px 22px", minHeight: "100vh" }} className="riseIn">
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.1em",
          color: "var(--ink-soft)",
          textTransform: "uppercase",
        }}
      >
        Getting set up
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 30,
          color: "var(--ink)",
          lineHeight: 1.15,
          marginTop: 4,
          marginBottom: 24,
        }}
      >
        {step === 0 && "What's her name?"}
        {step === 1 && "A little about where she's at"}
        {step === 2 && "One more thing"}
        {step === 3 && "Here's what that suggests"}
      </div>

      {step === 0 && (
        <div>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Amara"
            style={inputStyle}
          />
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "var(--ink-soft)",
              marginTop: 10,
            }}
          >
            This just personalizes the nudges and logs — nothing formal.
          </p>
          <PrimaryButton disabled={!name.trim()} onClick={() => setStep(1)} label="Continue" />
        </div>
      )}

      {step === 1 && (
        <div>
          <FieldLabel>Age</FieldLabel>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
            <input
              type="range"
              min="12"
              max="48"
              value={ageMonths}
              onChange={(e) => setAgeMonths(Number(e.target.value))}
              style={{ flex: 1, accentColor: "var(--pee)" }}
            />
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 15,
                color: "var(--ink)",
                minWidth: 78,
              }}
            >
              {ageMonths} months
            </div>
          </div>

          <FieldLabel>Can she follow simple instructions?</FieldLabel>
          <ChoiceRow
            value={follows}
            onChange={(v) => setFollows(v as FollowsInstructions)}
            options={[
              { v: "no", l: "Not yet" },
              { v: "sometimes", l: "Sometimes" },
              { v: "yes", l: "Reliably" },
            ]}
          />
          <div style={{ height: 22 }} />
          <PrimaryButton onClick={() => setStep(2)} label="Continue" />
        </div>
      )}

      {step === 2 && (
        <div>
          <FieldLabel>Has she seen or sat on a potty before?</FieldLabel>
          <ChoiceRow
            value={exposure}
            onChange={(v) => setExposure(v as PottyExposure)}
            options={[
              { v: "never", l: "Completely new" },
              { v: "occasional", l: "Occasionally" },
              { v: "regular", l: "Regularly" },
            ]}
          />
          <div style={{ height: 22 }} />
          <PrimaryButton onClick={() => setStep(3)} label="See readiness" />
        </div>
      )}

      {step === 3 && (
        <div>
          <div
            style={{
              background: "var(--pee-soft)",
              borderRadius: 18,
              padding: "22px 20px",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--ink-soft)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Estimated readiness
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "4px 0" }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 32,
                  color: "var(--ink)",
                }}
              >
                {readiness.label}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 16, color: "var(--ink-soft)" }}>
                {readiness.pct}%
              </div>
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "var(--ink)",
                opacity: 0.85,
                lineHeight: 1.5,
              }}
            >
              {readiness.note}
            </div>
          </div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              color: "var(--ink-soft)",
              marginBottom: 20,
              lineHeight: 1.5,
            }}
          >
            This is only a starting orientation — the app will learn her real rhythm from what you
            log, not from this estimate.
          </p>
          <PrimaryButton
            onClick={() =>
              onDone({
                name: name.trim(),
                ageMonths,
                follows,
                exposure,
                readiness,
                phase: "pee",
                onboarded: true,
                createdAt: Date.now(),
              })
            }
            label={`Start tracking with ${name.trim()}`}
          />
        </div>
      )}

      {step > 0 && (
        <button
          onClick={() => setStep(step - 1)}
          style={{
            marginTop: 14,
            background: "none",
            border: "none",
            color: "var(--ink-soft)",
            fontFamily: "var(--font-body)",
            fontSize: 13,
          }}
        >
          ← back
        </button>
      )}
    </div>
  );
}
