interface StatChipProps {
  label: string;
  value: string | number;
  accent?: string;
}

export function StatChip({ label, value, accent }: StatChipProps) {
  return (
    <div
      style={{
        flex: 1,
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: 14,
        padding: "12px 14px",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10.5,
          color: "var(--ink-soft)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 19,
          color: accent || "var(--ink)",
          marginTop: 2,
        }}
      >
        {value}
      </div>
    </div>
  );
}
