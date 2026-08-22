export type TabKey = "today" | "sleep" | "trends" | "profile";

interface TabBarProps {
  tab: TabKey;
  setTab: (tab: TabKey) => void;
}

const items: { v: TabKey; l: string }[] = [
  { v: "today", l: "Today" },
  { v: "sleep", l: "Sleep" },
  { v: "trends", l: "Trends" },
  { v: "profile", l: "Profile" },
];

export function TabBar({ tab, setTab }: TabBarProps) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: 480,
          width: "100%",
          background: "var(--card)",
          borderTop: "1px solid var(--line)",
          display: "flex",
          padding: "10px 18px calc(10px + env(safe-area-inset-bottom))",
        }}
      >
        {items.map((it) => (
          <button
            key={it.v}
            onClick={() => setTab(it.v)}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              padding: "8px 0",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: 13,
              color: tab === it.v ? "var(--ink)" : "var(--ink-soft)",
              borderBottom: tab === it.v ? "2px solid var(--pee)" : "2px solid transparent",
            }}
          >
            {it.l}
          </button>
        ))}
      </div>
    </div>
  );
}
