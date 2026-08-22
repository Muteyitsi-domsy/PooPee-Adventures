import { Leaf, Moon } from "@/components/icons";
import type { Profile } from "@/features/onboarding/types";
import { InfoRow } from "./InfoRow";

interface ProfileTabProps {
  profile: Profile;
  onExport: () => void;
}

export function ProfileTab({ profile, onExport }: ProfileTabProps) {
  return (
    <div className="riseIn" style={{ paddingTop: 18 }}>
      <div style={{ background: "var(--pee-soft)", borderRadius: 18, padding: "20px", marginBottom: 18 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Readiness at setup
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "4px 0" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, color: "var(--ink)" }}>
            {profile.readiness?.label || "—"}
          </div>
          {profile.readiness && (
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--ink-soft)" }}>
              {profile.readiness.pct}%
            </div>
          )}
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--ink)", opacity: 0.85, lineHeight: 1.5 }}>
          {profile.readiness?.note}
        </div>
      </div>

      <InfoRow label="Age at setup" value={`${profile.ageMonths} months`} />
      <InfoRow
        label="Followed instructions"
        value={profile.follows === "yes" ? "Reliably" : profile.follows === "sometimes" ? "Sometimes" : "Not yet"}
      />
      <InfoRow
        label="Potty exposure"
        value={profile.exposure === "regular" ? "Regular" : profile.exposure === "occasional" ? "Occasional" : "Completely new"}
      />
      <InfoRow label="Current phase" value={profile.phase === "pee+poo" ? "Phase 2 · Pee & poo control" : "Phase 1 · Pee control"} />

      <div
        style={{
          marginTop: 22,
          background: "var(--child-soft)",
          borderRadius: 16,
          padding: "16px 16px",
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
        }}
      >
        <Leaf size={18} color="var(--child)" />
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink)", lineHeight: 1.55 }}>
          The goal line here is quiet: fewer nudges from you, more moments she brings herself. The
          child-led percentage on the Trends tab is the number worth watching over the weeks — not
          the daily count.
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 10, alignItems: "flex-start", padding: "14px 2px" }}>
        <Moon size={18} color="var(--ink-soft)" />
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.55 }}>
          Naps and night sleep have their own tab, tracking what she drank beforehand against
          whether she stayed dry — that&apos;s the picture you&apos;ll want once day training is
          solid and night training is next. Pre/post-potty visits around a nap still show up as
          context tags on the daily log.
        </div>
      </div>

      <button
        onClick={onExport}
        style={{
          width: "100%",
          marginTop: 22,
          padding: "15px 16px",
          borderRadius: 16,
          border: "1px solid var(--line)",
          background: "var(--card)",
          color: "var(--ink)",
          fontFamily: "var(--font-body)",
          fontWeight: 700,
          fontSize: 14,
        }}
      >
        Export data
      </button>
    </div>
  );
}
