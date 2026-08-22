import type { ReactNode } from "react";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "var(--font-body)" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", position: "relative" }}>{children}</div>
    </div>
  );
}
