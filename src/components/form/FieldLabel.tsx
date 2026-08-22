import type { ReactNode } from "react";

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-body)",
        fontWeight: 700,
        fontSize: 13,
        color: "var(--ink)",
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}
