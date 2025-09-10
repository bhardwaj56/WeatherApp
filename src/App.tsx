import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import { useWeather } from './hooks/useWeather';

function App() {
  const {
    setQuery,
    data,
    loading,
    error,
    selectedDate,
    setSelectedDate,
    selected,
  } = useWeather('');

  const handleSearch = (cityName: string) => {
    if (cityName.trim()) 
      setQuery(cityName);
  };

  const handleSetSelectedDate = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center bg-[#204d62] pb-8">
      <header className="text-4xl font-bold text-center mb-6">
        Weather App
      </header>
      <SearchBar onClickSearch={handleSearch}/>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      <WeatherCard data={data} weather={selected} selectedDate={selectedDate} onSetSelectedDate={handleSetSelectedDate}/>
    </div>
  );
}

export default App;
