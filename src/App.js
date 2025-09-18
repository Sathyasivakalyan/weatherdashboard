import React, { useState, useEffect, useCallback } from "react";
import Weather from "./Weather";
import Forecast from "./Forecast";
import SearchBar from "./SearchBar";
import { WEATHER_API_KEY, DEFAULT_CITY } from "./config";
import "./App.css";
import defaultVideo from "./assets/cloudy.mp4";
import WeatherAlert from "./WeatherAlert";

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alerts, setAlerts] = useState([]);

  // Fetch weather by city name
  const fetchWeatherData = useCallback(
    async (city) => {
      if (!city.trim()) return setError("Please enter a city name");
      setLoading(true);
      setError("");
      setAlerts([]);

      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            city
          )}&appid=${WEATHER_API_KEY}&units=metric`
        );

        if (res.status === 401) throw new Error("Invalid API Key");
        if (!res.ok) throw new Error("City not found");

        const weather = await res.json();
        setWeatherData(weather);

        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
            city
          )}&appid=${WEATHER_API_KEY}&units=metric`
        );
        if (!forecastRes.ok) throw new Error("Unable to fetch forecast");
        const forecast = await forecastRes.json();
        setForecastData(forecast);

        checkWeatherAlerts(weather);
      } catch (err) {
        setError(err.message);
        setWeatherData(null);
        setForecastData(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Fetch weather by coordinates
  const fetchWeatherByCoords = useCallback(
    async (lat, lon) => {
      setLoading(true);
      setError("");
      setAlerts([]);

      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
        );
        if (res.status === 401) throw new Error("Invalid API Key");
        if (!res.ok) throw new Error("Unable to fetch weather");
        const weather = await res.json();
        setWeatherData(weather);

        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
        );
        if (!forecastRes.ok) throw new Error("Unable to fetch forecast");
        const forecast = await forecastRes.json();
        setForecastData(forecast);

        checkWeatherAlerts(weather);
      } catch (err) {
        setError(err.message);
        setWeatherData(null);
        setForecastData(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Weather alerts
  const checkWeatherAlerts = (weather) => {
    const temp = weather.main?.temp;
    const windSpeed = weather.wind?.speed;
    const main = weather.weather?.[0]?.main;
    const humidity = weather.main?.humidity;

    const newAlerts = [];
    if (temp > 35)
      newAlerts.push({ type: "Severe Weather Alert", message: "🌡️ High temperature!" });
    if (windSpeed > 15)
      newAlerts.push({ type: "Weather Alert", message: "💨 Strong wind warning!" });
    if (main === "Rain" || main === "Drizzle")
      newAlerts.push({ type: "Weather Alert", message: "☔ Rain expected" });
    if (main === "Thunderstorm")
      newAlerts.push({ type: "Severe Weather Alert", message: "⛈️ Thunderstorm alert" });
    if (main === "Snow")
      newAlerts.push({ type: "Snow Alert", message: "❄️ Snow conditions" });
    if (humidity > 80)
      newAlerts.push({ type: "Weather Alert", message: "💧 High humidity detected" });

    setAlerts(newAlerts);
  };

  // Use geolocation on load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeatherData(DEFAULT_CITY)
      );
    } else {
      fetchWeatherData(DEFAULT_CITY);
    }
  }, [fetchWeatherData, fetchWeatherByCoords]);

  return (
    <div className="app">
      <video className="background-video" autoPlay loop muted playsInline>
        <source src={defaultVideo} type="video/mp4" />
      </video>

      <div className="content">
        <header className="header">
          <h1 className="title">🌤️ Weather Forecast Dashboard</h1>
          <SearchBar onSearch={fetchWeatherData} loading={loading} />
        </header>

        {alerts.map((alert, i) => (
          <WeatherAlert key={i} type={alert.type} message={alert.message} />
        ))}

       
        <div className="weather-content">
          {weatherData && <Weather weatherData={weatherData} />}
          {forecastData && <Forecast forecastData={forecastData} />}
        </div>

        {!weatherData && !loading && !error && (
          <div className="welcome-message">
            <h2
              style={{
                color: "#ffd700",
                textAlign: "center",
                fontSize: "150%",
                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              🌍 Welcome to Weather Forecast
            </h2>
            <p
              style={{
                color: "#4B5563",
                textAlign: "center",
                fontSize: "110%",
              }}
            >
              Enter a city to get current weather and forecast.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
