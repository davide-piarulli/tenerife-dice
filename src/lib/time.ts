export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffSec = Math.round((now - then) / 1000);

  if (diffSec < 60) return "hace un momento";
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `hace ${diffMin} min`;
  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `hace ${diffHour} h`;
  const diffDay = Math.round(diffHour / 24);
  if (diffDay < 7) return `hace ${diffDay} d`;

  return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short" }).format(then);
}

export function isRecent(iso: string, hours = 20): boolean {
  const then = new Date(iso).getTime();
  return Date.now() - then < hours * 60 * 60 * 1000;
}
