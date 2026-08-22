export interface ChoiceOption {
  v: string;
  l: string;
}

interface ChoiceRowProps {
  value: string;
  onChange: (value: string) => void;
  options: ChoiceOption[];
}

export function ChoiceRow({ value, onChange, options }: ChoiceRowProps) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
      {options.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          style={{
            padding: "10px 14px",
            borderRadius: 999,
            border: value === o.v ? "1.5px solid var(--pee)" : "1.5px solid var(--line)",
            background: value === o.v ? "var(--pee-soft)" : "var(--card)",
            color: "var(--ink)",
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: 13.5,
          }}
        >
          {o.l}
        </button>
      ))}
    </div>
  );
}
