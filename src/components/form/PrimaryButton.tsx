interface PrimaryButtonProps {
  onClick: () => void;
  label: string;
  disabled?: boolean;
}

export function PrimaryButton({ onClick, label, disabled }: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "15px 18px",
        borderRadius: 16,
        border: "none",
        background: disabled ? "#D9CDBC" : "var(--ink)",
        color: "#FFF",
        fontFamily: "var(--font-body)",
        fontWeight: 700,
        fontSize: 15,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {label}
    </button>
  );
}
