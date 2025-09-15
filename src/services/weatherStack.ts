import type {
  DaySummary,
  CombinedWeather,
  Weather,
  Success,
  Error,
} from "../types";

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

const fmtDate = (d: Date) => d.toISOString().slice(0, 10);

type WSCurrent = Weather;
type WSForecast = Weather;
type WSHistorical = Weather;

export type FetchResult<T> = Success<T> | Error;

const withKey = (endpoint: string, params: Record<string, string>) => {
  const usp = new URLSearchParams({ access_key: API_KEY, ...params });
  return `${API_URL}/${endpoint}?${usp.toString()}`;
};

async function fetchWeather<T>(url: string): Promise<FetchResult<T>> {
  try {
    const res = await fetch(url);
    const data = await res.json();
    if ((data && data.success === false) || data.error) {
      return { ok: false, error: data.error?.info || "API error" };
    }
    return { ok: true, data: data as T };
  } catch (e: Error | unknown) {
    return {
      ok: false,
      error: (e instanceof Error && e.message) || "Network error",
    };
  }
}

// Simple cache using localStorage with TTL
const CACHE_NS = "ws-cache-v1";
type CacheEntry<T> = { expires: number; value: T };
function getCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`${CACHE_NS}:${key}`);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() > entry.expires) {
      localStorage.removeItem(`${CACHE_NS}:${key}`);
      return null;
    }
    return entry.value;
  } catch {
    return null;
  }
}
function setCache<T>(key: string, value: T, ttlMs = 15 * 60 * 1000) {
  const entry: CacheEntry<T> = { expires: Date.now() + ttlMs, value };
  localStorage.setItem(`${CACHE_NS}:${key}`, JSON.stringify(entry));
}

export async function fetchCombined(
  query: string
): Promise<FetchResult<CombinedWeather>> {
  const cacheKey = `combined:${query}`;
  const cached = getCache<CombinedWeather>(cacheKey);
  if (cached) return { ok: true, data: cached };

  const today = new Date();
  const minus = (n: number) =>
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - n);
  const plus = (n: number) =>
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + n);

  // Build dates
  const histStart = fmtDate(minus(3));
  const histEnd = fmtDate(minus(1));
  const forecastDays = 3;

  // 1) Current
  const curUrl = withKey("current", { query });
  const cur = await fetchWeather<WSCurrent>(curUrl);

  // 2) History
  const histUrl = withKey("historical", {
    query,
    historical_date_start: histStart,
    historical_date_end: histEnd,
  });
  const hist = await fetchWeather<WSHistorical>(histUrl);

  // 3) Forecast
  const fcUrl = withKey("forecast", {
    query,
    forecast_days: String(forecastDays),
  });
  const fc = await fetchWeather<WSForecast>(fcUrl);

  const days: DaySummary[] = [];

  // Include history
  if (hist.ok && hist.data?.historical) {
    const entries = hist.data.historical as Record<string, DaySummary>;
    Object.entries(entries).forEach(([date, v]) => {
      days.push({
        date,
        avgtemp: v?.avgtemp ?? 0,
        precip: v?.hourly?.[12]?.precip ?? 0,
        description: v?.hourly?.[12]?.weather_descriptions?.[0] ?? "",
        icon: v?.hourly?.[12]?.weather_icons?.[0] ?? "",
        wind: v?.hourly?.[12]?.wind_speed ?? 0,
        pressure: v?.hourly?.[12]?.pressure ?? 0,
      });
    });
  }

  // Today (from current)
  if (cur.ok && cur.data?.current) {
    const c = cur.data.current;
    days.push({
      date: fmtDate(today),
      avgtemp: c.temperature,
      precip: c.precip,
      description: c.weather_descriptions?.[0],
      icon: c.weather_icons?.[0],
      wind: c.wind_speed,
      pressure: c.pressure,
    });
  }

  // Forecast - includes today too, but we prefer current for that
  if (fc.ok && fc.data?.forecast) {
    const entries = fc.data.forecast as Record<string, DaySummary>;
    Object.entries(entries).forEach(([date, v]) => {
      if (!days.some((day) => day.date === date)) {
        days.push({
          date,
          avgtemp: v?.avgtemp ?? 0,
          precip: v?.hourly?.[12]?.precip ?? 0,
          description: v?.hourly?.[12]?.weather_descriptions?.[0] ?? "",
          icon: v?.hourly?.[12]?.weather_icons?.[0] ?? "",
          wind: v?.hourly?.[12]?.wind_speed ?? 0,
          pressure: v?.hourly?.[12]?.pressure ?? 0,
        });
      }
    });
  }

  // Fallback: For errors
  if (!cur.ok) {
    return { ok: false, error: cur.error || "Current weather API failed" };
  }

  // Commenting out to allow partial results as the api key I'm using doesn't support hist/forecast
  // if (!hist.ok) {
  //   return { ok: false, error: hist.error || "Historical weather API failed" };
  // }
  // if (!fc.ok) {
  //   return { ok: false, error: fc.error || "Forecast weather API failed" };
  // }

  // Fallback: For keys where hist/forecast aren't available, synthesize using current
  if (days.length === 1) {
    const c = cur.ok && cur.data?.current ? cur.data.current : null;
    const synth = (offset: number) => ({
      date: fmtDate(offset < 0 ? minus(-offset) : plus(offset)),
      avgtemp: c?.temperature ?? 0,
      precip: c?.precip ?? 0,
      description: c?.weather_descriptions?.[0],
      icon: c?.weather_icons?.[0],
      wind: c?.wind_speed ?? 0,
      pressure: c?.pressure ?? 0,
    });
    [-3, -2, -1, 1, 2, 3].forEach((k) => {
      const synthesizedDay = synth(k);
      if (!days.some((day) => day.date === synthesizedDay.date)) {
        days.push(synthesizedDay);
      }
    });
  }

  const locationName =
    cur.ok && cur.data?.location
      ? `${cur.data.location.name}${
          cur.data.location.region ? `, ${cur.data.location.region}` : ""
        }
    ${cur.data.location.country ? `, ${cur.data.location.country}` : ""}`
      : query;

  const combined: CombinedWeather = {
    location: locationName,
    current: cur.ok ? cur.data?.current ?? null : null,
    days: days.sort((a, b) => a.date.localeCompare(b.date)),
  };

  // Cache and return
  setCache(cacheKey, combined);
  return { ok: true, data: combined };
}
