const dutchDateFormatter = new Intl.DateTimeFormat("nl-NL", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Europe/Amsterdam",
});

const dutchTimeFormatter = new Intl.DateTimeFormat("nl-NL", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Amsterdam",
});

export const parseDutchDateTimeToDate = (date: string, time: string) => {
  const cleanTime = time.replace(/\s*\(NL\)\s*/i, "");
  return new Date(`${date}T${cleanTime}:00+02:00`);
};

export const formatDutchDate = (dateLike?: string) => {
  if (!dateLike) return "Datum onbekend";
  return dutchDateFormatter.format(new Date(dateLike));
};

export const formatDutchTime = (dateLike?: string) => {
  if (!dateLike) return "--:--";
  return dutchTimeFormatter.format(new Date(dateLike));
};

export const formatDutchDateTime = (dateLike?: string) => `${formatDutchDate(dateLike)} om ${formatDutchTime(dateLike)}`;

export const isToday = (dateLike?: string) => {
  if (!dateLike) return false;
  const now = new Date();
  const date = new Date(dateLike);
  return dutchDateFormatter.format(now) === dutchDateFormatter.format(date);
};
