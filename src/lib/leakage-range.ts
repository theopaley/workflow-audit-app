export interface LeakageRange {
  lower: number;
  upper: number;
  displayFull: string;
  displayShort: string;
}

function fmt(n: number): string {
  return "$" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getLeakageRange(monthlyLeakage: number): LeakageRange {
  const lower = Math.round((monthlyLeakage * 0.85) / 500) * 500;
  const upper = Math.round((monthlyLeakage * 1.15) / 500) * 500;
  const display = `${fmt(lower)}–${fmt(upper)}`;
  return {
    lower,
    upper,
    displayFull: display,
    displayShort: display,
  };
}
