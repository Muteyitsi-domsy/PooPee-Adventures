import { Cloud, Moon } from "@/components/icons";
import { fmtDuration, fmtTime, MIN } from "@/lib/time";
import type { SleepSession } from "./types";

interface ActiveSleepBannerProps {
  session: SleepSession;
  now: number;
  onOpen: () => void;
}

export function ActiveSleepBanner({ session, now, onOpen }: ActiveSleepBannerProps) {
  const color = session.kind === "nap" ? "var(--nap)" : "var(--night)";
  const soft = session.kind === "nap" ? "var(--nap-soft)" : "var(--night-soft)";
  const estEnd = session.startTs + session.estMinutes * MIN;
  const remaining = estEnd - now;
  return (
    <button
      onClick={onOpen}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        background: soft,
        border: "none",
        borderBottom: `1px solid ${color}33`,
        padding: "12px 18px",
      }}
    >
      <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", alignItems: "center", gap: 10 }}>
        {session.kind === "nap" ? <Cloud size={18} color={color} /> : <Moon size={18} color={color} />}
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 13.5, color: "var(--ink)" }}>
            {session.kind === "nap" ? "Nap" : "Night"} in progress · started {fmtTime(session.startTs)}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--ink-soft)" }}>
            {remaining > 0
              ? `~${fmtDuration(remaining)} until expected wake`
              : "Past expected wake — log outcome when ready"}
          </div>
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 12.5, color }}>
          Log outcome →
        </div>
      </div>
    </button>
  );
}
