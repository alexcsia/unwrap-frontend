import { ref } from "vue";
import type { StatsParams } from "@/services/types/statistics";

type FilterMode = "all" | "year" | "month" | "day" | "range";

const MODES: { value: FilterMode; label: string }[] = [
  { value: "all", label: "All time" },
  { value: "year", label: "Year" },
  { value: "month", label: "Month" },
  { value: "day", label: "Day" },
  { value: "range", label: "Custom range" },
];

const mode = ref<FilterMode>("all");

const currentYear = new Date().getFullYear();
const years = Array.from(
  { length: currentYear - 1999 },
  (_, i) => currentYear - i,
);

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const selectedYear = ref(currentYear);
const selectedMonth = ref(new Date().getMonth() + 1);
const selectedDay = ref<Date | null>(null);
const selectedRange = ref<[Date, Date] | null>(null);

export function useDate() {
  function dateString(d: Date): string {
    return d.toLocaleDateString("en-CA"); // yyyy-mm-dd
  }

  function formatDuration(raw: number): string {
    const s = Math.floor(raw / 1_000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h) return `${h}h ${m}m`;
    if (m) return `${m}m ${sec}s`;
    return `${sec}s`;
  }

  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString();

  const buildParams = (): StatsParams => {
    const base: StatsParams = { limit: 10, offset: 0 };

    switch (mode.value) {
      case "year":
        return { ...base, year: selectedYear.value };
      case "month":
        return {
          ...base,
          year: selectedYear.value,
          month: selectedMonth.value,
        };
      case "day":
        return selectedDay.value
          ? { ...base, date: dateString(selectedDay.value) }
          : base;
      case "range":
        return selectedRange.value
          ? {
              ...base,
              from: dateString(selectedRange.value[0]),
              to: dateString(selectedRange.value[1]),
            }
          : base;

      case "all":
      default:
        return base;
    }
  };

  return {
    selectedDay,
    selectedMonth,
    selectedRange,
    selectedYear,
    mode,
    formatDuration,
    fmtDate,
    buildParams,
  };
}

export { MODES, MONTHS, years };
