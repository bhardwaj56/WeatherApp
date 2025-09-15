import { useEffect, useMemo, useState } from "react";
import type { CombinedWeather } from "../types";
import { fetchCombined } from "../services/weatherStack";

export function useWeather(initialQuery: string) {
  const [query, setQuery] = useState(initialQuery);
  const [data, setData] = useState<CombinedWeather | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      return;
    }
    setLoading(true);
    setError(null);
    fetchCombined(query)
      .then((res) => {
        if (res.ok) {
          setData(res.data);
          // select today by default
          const today = new Date().toISOString().slice(0, 10);
          const ok =
            res.data.days.find((d) => d.date === today)?.date ??
            res.data.days[Math.floor(res.data.days.length / 2)]?.date;
          setSelectedDate(ok ?? null);
        } else {
          setError(res.error);
          setData(null);
        }
      })
      .finally(() => setLoading(false));
  }, [query]);

  const selected = useMemo(() => {
    if (!data || !selectedDate) return null;
    return data.days.find((d) => d.date === selectedDate) ?? null;
  }, [data, selectedDate]);

  return {
    query,
    setQuery,
    data,
    loading,
    error,
    selectedDate,
    setSelectedDate,
    selected,
  };
}
