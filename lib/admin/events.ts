// Moments to mark on the sign-ups chart, like the auction markers on Grey Market's admin.
// "start" draws a green dashed line, "end" a red one. Dates are Pacific (YYYY-MM-DD).
// Add launches, campaigns and challenges here as they happen.
export type AdminEvent = { date: string; label: string; kind: "start" | "end" };

export const adminEvents: AdminEvent[] = [
  { date: "2026-11-14", label: "Shop and emails live", kind: "start" },
  { date: "2027-01-04", label: "Declutter challenge starts", kind: "start" },
  { date: "2027-01-08", label: "Declutter challenge ends", kind: "end" },
];
