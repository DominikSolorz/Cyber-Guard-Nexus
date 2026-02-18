const polishFormatter = new Intl.DateTimeFormat("pl-PL", {
  timeZone: "Europe/Warsaw",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

const polishDateOnly = new Intl.DateTimeFormat("pl-PL", {
  timeZone: "Europe/Warsaw",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const polishTimeOnly = new Intl.DateTimeFormat("pl-PL", {
  timeZone: "Europe/Warsaw",
  hour: "2-digit",
  minute: "2-digit",
});

const polishFull = new Intl.DateTimeFormat("pl-PL", {
  timeZone: "Europe/Warsaw",
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const polishShortDate = new Intl.DateTimeFormat("pl-PL", {
  timeZone: "Europe/Warsaw",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "";
  return polishFormatter.format(new Date(date));
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "";
  return polishDateOnly.format(new Date(date));
}

export function formatTime(date: string | Date | null | undefined): string {
  if (!date) return "";
  return polishTimeOnly.format(new Date(date));
}

export function formatFullDateTime(date: string | Date | null | undefined): string {
  if (!date) return "";
  return polishFull.format(new Date(date));
}

export function formatShortDate(date: string | Date | null | undefined): string {
  if (!date) return "";
  return polishShortDate.format(new Date(date));
}

export function getCurrentPolishTime(): string {
  return polishFormatter.format(new Date());
}
