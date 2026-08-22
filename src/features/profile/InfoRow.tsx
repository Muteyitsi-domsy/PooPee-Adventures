export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "13px 2px", borderBottom: "1px solid var(--line)" }}>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--ink-soft)" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 13.5, color: "var(--ink)" }}>{value}</div>
    </div>
  );
}
