export const EDITORIAL_TEAM_NAME = "TurboArcade Editorial Team";
export const EDITORIAL_POLICY_PATH = "/editorial-policy";
export const EDITORIAL_POLICY_UPDATED_AT = "October 27, 2026";

export function parseEditorialDate(value: string, fallback: Date) {
  const date = new Date(`${value} 12:00:00 UTC`);

  return Number.isNaN(date.getTime()) ? fallback : date;
}

export function formatEditorialDate(value: string) {
  const date = parseEditorialDate(value, new Date(Number.NaN));

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
