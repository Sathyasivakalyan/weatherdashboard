// src/components/Forecast.jsx
import React from 'react';
import WeatherIcon from './WeatherIcon';

const Forecast = ({ forecastData }) => {
  if (!forecastData?.list) return null;

  // Group forecast data by date
  const dailyForecast = forecastData.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toDateString();

    if (!acc[dateKey]) {
      acc[dateKey] = {
        date,
        items: [],
        temps: [],
        conditions: {}
      };
    }

    acc[dateKey].items.push(item);
    acc[dateKey].temps.push(item.main?.temp ?? 0);

    const condition = item.weather?.[0]?.main || 'Unknown';
    acc[dateKey].conditions[condition] =
      (acc[dateKey].conditions[condition] || 0) + 1;

    return acc;
  }, {});

  const forecastDays = Object.values(dailyForecast).slice(0, 5);
  const hourlyForecast = forecastData.list.slice(0, 8); // Next 24 hrs (3h intervals)

  const getDominantCondition = (conditions) =>
    Object.keys(conditions).reduce((a, b) =>
      conditions[a] > conditions[b] ? a : b
    );

  const formatDate = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getChanceOfRain = (items) =>
    Math.max(...items.map((i) => i.pop || 0)) * 100;

  return (
    <div className="forecast-container glass">
      {/* Hourly Forecast */}
      <div className="hourly-forecast">
        <h3 className="text-center text-yellow-400 text-xl font-semibold drop-shadow">
          ⏰ Hourly Forecast
        </h3>

        <div className="hourly-grid">
          {hourlyForecast.map((hour, index) => {
            const time = new Date(hour.dt * 1000);
            const isNow = index === 0;
            const { id = 0, main = 'Unknown' } = hour.weather?.[0] || {};
            const temp = Math.round(hour.main?.temp ?? 0);
            const pop = Math.round((hour.pop ?? 0) * 100);
            const windSpeed = Math.round((hour.wind?.speed ?? 0) * 3.6);

            return (
              <div key={hour.dt} className="hourly-item">
                <div className="hourly-time">
                  {isNow
                    ? 'Now'
                    : time.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        hour12: true
                      })}
                </div>

                <WeatherIcon weatherMain={main} weatherId={id} size="small" />
                <div className="hourly-temp">{temp}°</div>
                <div className="hourly-detail">{pop}% 💧</div>
                <div className="hourly-detail">{windSpeed} km/h</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="forecast-header">
        <h2 className="text-center text-yellow-400 text-xl font-bold drop-shadow">
          🗓️ 5-Day Forecast
        </h2>
        <p className="text-center text-gray-500">Weather outlook for 5 days</p>
      </div>

      <div className="forecast-grid">
        {forecastDays.map((day, index) => {
          const maxTemp = Math.max(...day.temps);
          const minTemp = Math.min(...day.temps);
          const dominantCondition = getDominantCondition(day.conditions);
          const rainChance = getChanceOfRain(day.items);

          const firstItem = day.items[0] || {};
          const { id = 0, description = 'N/A' } =
            firstItem.weather?.[0] || {};
          const windSpeed = Math.round((firstItem.wind?.speed ?? 0) * 3.6);
          const humidity = firstItem.main?.humidity ?? 0;

          return (
            <div
              key={`${day.date}-${index}`}
              className={`forecast-item ${index === 0 ? 'highlight' : ''}`}
            >
              <div className="forecast-date">{formatDate(day.date)}</div>

              <WeatherIcon
                weatherMain={dominantCondition}
                weatherId={id}
                size="medium"
              />

              <div className="forecast-temps">
                <span className="forecast-temp-max">{Math.round(maxTemp)}°</span>
                <span className="forecast-temp-min">{Math.round(minTemp)}°</span>
              </div>

              <div className="forecast-desc">{description}</div>

              <div className="forecast-details">
                <div className="detail-item">
                  💧 Rain: <span>{Math.round(rainChance)}%</span>
                </div>
                <div className="detail-item">
                  🌪️ Wind: <span>{windSpeed} km/h</span>
                </div>
                <div className="detail-item">
                  💧 Humidity: <span>{humidity}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Forecast;
