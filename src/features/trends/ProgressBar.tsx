import { progressLabel } from "./progress";
import type { ProgressResult } from "./types";

interface ProgressBarProps {
  label: string;
  color: string;
  data: ProgressResult;
  name: string;
  locked?: boolean;
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
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 13, color: "var(--ink)" }}>{label}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-soft)" }}>
          {data.pct}% · {progressLabel(data.pct)}
        </span>
      </div>
      <div style={{ height: 10, borderRadius: 6, background: "var(--line)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${data.pct}%`, background: color, borderRadius: 6, transition: "width 0.6s ease" }} />
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--ink-soft)", marginTop: 5 }}>
        {data.successRate}% on the potty · {data.childRate}% {name} initiated herself
      </div>
    </div>
  );
}
