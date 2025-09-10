import { useState } from "react";

interface SearchBarProps {
  onClickSearch: (city: string) => void;
}

const SearchBar = ({ onClickSearch }: SearchBarProps) => {
  const [cityName, setCityName] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cityName.trim()) {
      onClickSearch(cityName);
    }
  };

  return (
    <form className="flex p-8 w-3/4" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter city name"
        className="flex-1 p-2 border border-gray-300 rounded-l-lg outline-none border-r-0"
        value={cityName}
        onChange={(e) => setCityName(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 cursor-pointer border p-2 hover:bg-[#507487] boredr-l-0 rounded-r-lg"
      >
        Search
      </button>
    </form>
  );
};
export default SearchBar;
