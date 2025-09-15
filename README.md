# 🌦️ React Weather App

A simple, modern weather app built with **React + TypeScript + Tailwind CSS**.  
It fetches weather data from the [WeatherStack API](https://weatherstack.com/) and displays current, historical, and forecast weather in an interactive card view.  

✨ Features end-to-end tests with Playwright.

---

## 🚀 Features

- 🔍 **Search by City** – enter a location and fetch real-time weather
- 📊 **Combined Weather View** – current, past 3 days, and forecast days in one timeline
- 📅 **Interactive Day Tiles** – select a day to view detailed weather info
- 🎨 **Modern UI** – styled with Tailwind, responsive layout
- ⚡ **Caching** – localStorage caching with TTL for faster loads
- ✅ **Testing** – Playwright + Jest-style assertions for UI flow

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript
- **Styling:** Tailwind CSS
- **Data Fetching:** WeatherStack API
- **State Management:** React Hooks (`useState`, `useEffect`)
- **Testing:** Playwright (with API mocking support)

---

⚙️ Setup & Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/weather-app.git
   cd weather-app

2. **Install dependencies**
    npm install

3. **Setup the environment variables**
    VITE_API_KEY=your_weatherstack_api_key
    VITE_API_URL=http://api.weatherstack.com

4. **Run the dev server**
    npm run dev

----

🧪 Testing

We use Playwright for end-to-end testing.

Run Tests
npx playwright test

Example Covered Tests
  1. Searching for a city and rendering weather card
  2. Clicking a DayTile to change active weather
  3. Handling API error gracefully
  4. Verifying animations and UI states

