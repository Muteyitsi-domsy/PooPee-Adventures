import type { LiquidTimingValue, LiquidTypeValue } from "./types";

export const LIQUID_TIMING: { v: LiquidTimingValue; l: string; mins: number }[] = [
  { v: "just", l: "Just before", mins: 10 },
  { v: "15-30", l: "15–30 min before", mins: 22 },
  { v: "30-60", l: "30–60 min before", mins: 45 },
  { v: "1-2h", l: "1–2h before", mins: 90 },
  { v: "long", l: "Longer / not sure", mins: 150 },
];

export const LIQUID_TYPES: { v: LiquidTypeValue; l: string }[] = [
  { v: "milk", l: "Milk" },
  { v: "juice", l: "Juice" },
  { v: "water", l: "Water" },
  { v: "porridge", l: "Porridge" },
  { v: "other", l: "Other" },
];
