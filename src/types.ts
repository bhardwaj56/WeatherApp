  export type WeatherCondition = {
    text?: string;
    icon?: string;
    code?: number;
  };

  export type Location ={
    name: string;
    country: string;
    region: string;
  }

  export type Weather = {
    location: Location;
    historical?: Record<string, DaySummary>;
    forecast?: Record<string, DaySummary>;
    current?: CurrentWeather;
  }
  
  export type CurrentWeather = {
    temperature: number;
    feelslike: number;
    weather_descriptions: string[];
    weather_icons: string[];
    wind_speed: number;
    wind_dir: string;
    humidity: number;
    pressure: number;
    precip: number;
    uv_index: number;
    visibility: number;
  };
  
  export type DaySummary = {
    date: string; // ISO
    avgtemp: number;
    precip: number;
    description?: string;
    icon?: string;
    wind?: number;
    pressure?: number;
    hourly?: CurrentWeather[];
  };
  
  export type CombinedWeather = {
    location: string;
    current: CurrentWeather | null;
    days: DaySummary[]; // history (-3,-2,-1), today (0), forecast (+1,+2)
  };
  