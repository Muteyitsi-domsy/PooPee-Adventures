interface IconProps {
  size?: number;
  color?: string;
}

export function Droplet({ size = 22, color = "var(--pee)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path
        d="M50 6 C50 6 88 54 88 78 A38 38 0 1 1 12 78 C12 54 50 6 50 6 Z"
        fill={color}
      />
    </svg>
  );
}

export function Swirl({ size = 22, color = "var(--poo)" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path
        d="M50 82c-20 0-32-10-32-24 0-9 7-15 15-15 4 0 7 2 9 5-3-9 2-19 12-21 9-2 18 4 20 13 6-1 12 3 13 10 2 12-9 32-37 32Z"
        fill={color}
      />
    </svg>
  );
}

export function Cup({ size = 18, color = "currentColor" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3h12l-1.2 14.5a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 3Z" />
      <path d="M6.5 8h11" />
    </svg>
  );
}

export function Moon({ size = 18, color = "currentColor" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
    </svg>
  );
}

export function Leaf({ size = 16, color = "currentColor" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 21c8 0 14-6 14-14V5h-2C9 5 5 11 5 19v2Z" />
      <path d="M5 21c0-6 4-10 10-12" />
    </svg>
  );
}

export function Cloud({ size = 18, color = "currentColor" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 18h10a4 4 0 0 0 .5-7.97A5.5 5.5 0 0 0 7.1 9.1 4 4 0 0 0 7 18Z" />
    </svg>
  );
}
