export interface LeakageRange {
  lower: number;
  upper: number;
  displayFull: string;
  displayShort: string;
}

function fmt(n: number): string {
  return "$" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function fmtShort(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1).replace(".0", "")}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n.toLocaleString()}`;
}

export function getLeakageRange(monthlyLeakage: number): LeakageRange {
  const lower = Math.round((monthlyLeakage * 0.85) / 500) * 500;
  const upper = Math.round((monthlyLeakage * 1.15) / 500) * 500;
  return {
    lower,
    upper,
    displayFull: `${fmt(lower)}\u2013${fmt(upper)}`,
    displayShort: `${fmtShort(lower)}\u2013${fmtShort(upper)}`,
  };
}
