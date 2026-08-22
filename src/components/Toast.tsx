export function Toast({ text }: { text: string }) {
  return (
    <div
      className="riseIn"
      style={{
        position: "fixed",
        bottom: 78,
        left: "50%",
        transform: "translateX(-50%)",
        background: "var(--ink)",
        color: "#fff",
        padding: "11px 18px",
        borderRadius: 999,
        fontFamily: "var(--font-body)",
        fontSize: 13,
        fontWeight: 600,
        maxWidth: "88%",
        textAlign: "center",
        boxShadow: "0 10px 24px -8px rgba(0,0,0,0.35)",
        zIndex: 60,
      }}
    >
      {text}
    </div>
  );
}
