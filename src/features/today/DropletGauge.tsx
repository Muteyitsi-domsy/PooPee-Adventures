interface DropletGaugeProps {
  percent: number;
  label: string;
  sub?: string;
}

export function DropletGauge({ percent, label, sub }: DropletGaugeProps) {
  const p = Math.max(0, Math.min(1, percent));
  const y = 100 - p * 92;
  return (
    <div className="flex flex-col items-center">
      <div style={{ position: "relative", width: 132, height: 132 }}>
        <svg width="132" height="132" viewBox="0 0 100 100">
          <defs>
            <clipPath id="dropClip">
              <path d="M50 6 C50 6 88 54 88 78 A38 38 0 1 1 12 78 C12 54 50 6 50 6 Z" />
            </clipPath>
          </defs>
          <path
            d="M50 6 C50 6 88 54 88 78 A38 38 0 1 1 12 78 C12 54 50 6 50 6 Z"
            fill="var(--card)"
            stroke="var(--pee)"
            strokeOpacity="0.35"
            strokeWidth="1.5"
          />
          <g clipPath="url(#dropClip)">
            <rect
              x="0"
              y={y}
              width="100"
              height={100 - y + 5}
              fill="var(--pee)"
              style={{ transition: "y 1s ease" }}
            />
            <path
              d={`M0 ${y} q 8 -3 16 0 t16 0 16 0 16 0 16 0 16 0 v6 h-96 z`}
              fill="var(--pee)"
              opacity="0.55"
              className="wave"
              style={{ transition: "d 1s ease" }}
            />
          </g>
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 15,
              color: "var(--ink)",
            }}
          >
            {label}
          </div>
        </div>
      </div>
      {sub && (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--ink-soft)",
            marginTop: 8,
            textAlign: "center",
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}
