export function toIsoDate(dateLabel: string) {
  const text = String(dateLabel || "").trim();
  const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (isoMatch) {
    return text;
  }

  const parsed = new Date(`${text} 12:00:00 UTC`);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toISOString().slice(0, 10);
}

export function toUtcDate(isoDate: string) {
  return new Date(`${isoDate}T12:00:00Z`);
}

export function formatPuzzleDateWithWeekday(dateLabel: string) {
  const parsed = new Date(`${dateLabel} 12:00:00 UTC`);

  if (Number.isNaN(parsed.getTime())) {
    return dateLabel;
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

export function formatFullDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(toUtcDate(isoDate));
}

export function formatShortDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(toUtcDate(isoDate));
}
