import { Droplet, Swirl } from "@/components/icons";
import { fmtTime, minsAgo } from "@/lib/time";
import type { PottyLog } from "./types";

interface LogRowProps {
  log: PottyLog;
  onEdit?: () => void;
}

export function LogRow({ log, onEdit }: LogRowProps) {
  const isOutside = log.location === "outside";
  const isSleep = log.location === "sleep";
  return (
    <div
      onClick={onEdit}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 4px",
        borderBottom: "1px solid var(--line)",
        cursor: onEdit ? "pointer" : undefined,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          background:
            isOutside || isSleep
              ? "var(--alert-soft)"
              : log.kind === "poo"
                ? "var(--poo-soft)"
                : "var(--pee-soft)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {log.kind === "poo" ? (
          <Swirl size={18} />
        ) : log.kind === "both" ? (
          <div style={{ display: "flex", gap: 2 }}>
            <Droplet size={13} />
            <Swirl size={13} />
          </div>
        ) : (
          <Droplet size={18} color={isOutside || isSleep ? "var(--alert)" : "var(--pee)"} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>
          {log.kind === "both" ? "Pee & poo" : log.kind === "poo" ? "Poo" : "Pee"}
          {isOutside && <span style={{ color: "var(--alert)" }}> · outside potty</span>}
          {isSleep && (
            <span style={{ color: "var(--alert)" }}>
              {" "}
              · during {log.sleepKind === "night" ? "night sleep" : "nap"}
            </span>
          )}
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11.5,
            color: "var(--ink-soft)",
            marginTop: 2,
          }}
        >
          {fmtTime(log.ts)} · {minsAgo(log.ts)}
          {log.initiator === "child" && " · she initiated"}
          {log.initiator === "parent" && " · you led"}
          {log.context === "pre-nap" && " · pre-nap"}
          {log.context === "post-nap" && " · post-nap"}
          {isOutside && log.reason && ` · ${log.reason}`}
        </div>
      </div>
      {onEdit && (
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--pee)", flexShrink: 0 }}>
          Edit
        </div>
      )}
    </div>
  );
}
