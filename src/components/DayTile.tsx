import type { DaySummary } from "../types";

interface DayTileProps {
  day: DaySummary;
  active: boolean;
  onClick: () => void;
}

const DayTile = ({ day, active, onClick }: DayTileProps) => {
  return (
    <div
      data-testid="day-tile"
      className={`flex flex-col items-center mt-4 p-4 space-y-2 rounded-xl cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#507487]
        ${active ? "bg-[#507487] text-white shadow-lg scale-105" : ""}`}
      onClick={onClick}
    >
      <p>
        {new Date(day.date).toLocaleDateString(undefined, { weekday: "short" })}
      </p>
      {day.icon ? (
        <img
          src={day.icon}
          alt={day.description ?? "weather"}
          className="h-12 w-12"
        />
      ) : null}
      <p>{Math.round(day.avgtemp)}°</p>
    </div>
  );
};

export default DayTile;
