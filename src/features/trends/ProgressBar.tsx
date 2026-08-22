import type { ProgressResult } from "./types";

interface ProgressBarProps {
  label: string;
  color: string;
  data: ProgressResult;
  name: string;
  locked?: boolean;
}

function MiniBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--ink-soft)" }}>{label}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink)", fontWeight: 700 }}>
          {value}%
        </span>
      </div>
      <div style={{ height: 8, borderRadius: 5, background: "var(--line)", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${value}%`,
            background: color,
            borderRadius: 5,
            transition: "width 0.6s ease",
          }}
        />
      </div>
    </div>
  );
}

export function ProgressBar({ label, color, data, name, locked }: ProgressBarProps) {
  if (locked) {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 13, color: "var(--ink)" }}>{label}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-soft)" }}>Phase 1 · not started</span>
        </div>
        <div style={{ height: 10, borderRadius: 6, background: "var(--line)" }} />
      </div>
    );
  }
  if (data.pct === null) {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 13, color: "var(--ink)" }}>{label}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-soft)" }}>Not enough data yet</span>
        </div>
        <div style={{ height: 10, borderRadius: 6, background: "var(--line)" }} />
      </div>
    );
  }
  return (
    <div>
      <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 13, color: "var(--ink)" }}>{label}</div>
      <MiniBar label="On the potty (any lead)" value={data.successRate ?? 0} color={color} />
      <MiniBar label={`${name} led it herself — goal 100%`} value={data.childRate ?? 0} color="var(--child)" />
    </div>
  );
}
