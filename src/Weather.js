import React from "react";
import WeatherIcon from "./WeatherIcon";
import WeatherDetails from "./WeatherDetails";

const Weather = ({ weatherData }) => {
  if (!weatherData) return null;

  const {
    name,
    sys,
    main,
    weather,
    wind,
    visibility,
    dt,
  } = weatherData;

  const currentWeather = weather?.[0];
  const temperature = Math.round(main?.temp ?? 0);
  const feelsLike = Math.round(main?.feels_like ?? 0);
  const country = sys?.country ?? "";

  const currentTime = new Date(dt * 1000).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="weather-card glass">
      {/* Location Info */}
      <div className="location-info">
        <h2 className="city-name">📍 {name}, {country}</h2>
        <p className="current-date">{currentDate}</p>
        <p className="current-time">🕐 {currentTime}</p>
      </div>

      {/* Main Weather Info */}
      <div className="weather-main">
        <WeatherIcon
          weatherMain={currentWeather?.main}
          weatherId={currentWeather?.id}
          size="large"
        />

        <div className="temperature-section">
          <div className="current-temp">{temperature}°C</div>
          <div className="feels-like">Feels like {feelsLike}°C</div>
          <div className="weather-description">
            {currentWeather?.description
              ? currentWeather.description.charAt(0).toUpperCase() +
                currentWeather.description.slice(1)
              : ""}
          </div>
        </div>
      </div>

      {/* Weather Details */}
      <WeatherDetails
        temperature={main}
        wind={wind}
        visibility={visibility ?? 0}
        humidity={main?.humidity ?? 0}
        pressure={main?.pressure ?? 0}
      />
    </div>
  );
};

export default Weather;
