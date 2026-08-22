import type { Profile } from "@/features/onboarding/types";

export function Header({ profile }: { profile: Profile }) {
  const phaseLabel = profile.phase === "pee+poo" ? "Phase 2 · Pee & poo control" : "Phase 1 · Pee control";
  return (
    <div style={{ padding: "26px 18px 14px", borderBottom: "1px solid var(--line)" }}>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.08em",
          color: "var(--ink-soft)",
          textTransform: "uppercase",
        }}
      >
        {phaseLabel}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 26,
          color: "var(--ink)",
          marginTop: 2,
        }}
      >
        {profile.name}&apos;s patterns
      </div>
    </div>
  );
}
