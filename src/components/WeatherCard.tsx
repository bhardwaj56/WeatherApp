import { useMemo } from "react";
import type { CombinedWeather, DaySummary } from "../types";
import DayTile from "./DayTile";
interface WeatherCardProps {
  data: CombinedWeather | null;
  weather: DaySummary | null;
  selectedDate: string | null;
  onSetSelectedDate: (date: string) => void;
}

const WeatherCard = ({ data, weather, selectedDate, onSetSelectedDate }: WeatherCardProps) => {
  const days = useMemo(() => data?.days ?? [], [data]);

  if (!data || !data.location || !weather) return null;

  return (
    <div className="min-w-xs w-auto h-full p-4 mt-6 border-2 rounded-lg bg-[#103242] border-[#507487]">
      <h2 className="font-semibold text-center text-lg sm:text-xl xl:text-2xl">{data.location}</h2>
      <div className="cursor-pointer flex flex-col sm:flex-row justify-between items-center m-4 gap-4">
        <div className="flex flex-col items-center">
          <img
            src={weather.icon}
            alt={weather.description}
            className="w-16 h-16 sm:w-20 sm:h-20 xl:w-24 xl:h-24 mix-blend-color-multiply contrast-125 brightness-110"
          />
          <p className="text-center text-gray-400 text-sm sm:text-base xl:text-lg font-normal">
            {weather.description}
          </p>
        </div>
        <p className="text-3xl sm:text-4xl xl:text-5xl font-semi-bold">
          {Math.round(weather.avgtemp)}°C
        </p>
        <div className="flex flex-col items-center sm:items-start font-normal text-sm sm:text-base xl:text-lg">
          <p className="text-gray-400">
            Wind: {weather.wind} kmph
          </p>
          <p className="text-gray-400">
            Precip: {Math.round(weather.precip)} mm
          </p>
          <p className="text-gray-400">
            Pressure: {weather.pressure} mb
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center sm:justify-between">
        {days.map((d) => (
          <DayTile
            key={d.date}
            day={d}
            active={selectedDate === d.date}
            onClick={() => onSetSelectedDate(d.date)}
          />
        ))}
      </div>
    </div>
  );
};
export default WeatherCard;
