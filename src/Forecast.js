import React from 'react';
import WeatherIcon from './WeatherIcon';

const Forecast = ({ forecastData }) => {
  if (!forecastData || !forecastData.list) return null;

  const dailyForecast = forecastData.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toDateString();

    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: date,
        items: [],
        temps: [],
        conditions: {}
      };
    }

    acc[dateKey].items.push(item);
    acc[dateKey].temps.push(item.main?.temp || 0);

    const condition = item.weather?.[0]?.main || 'Unknown';
    acc[dateKey].conditions[condition] = (acc[dateKey].conditions[condition] || 0) + 1;

    return acc;
  }, {});

  const forecastDays = Object.values(dailyForecast).slice(0, 5);
  const hourlyForecast = forecastData.list.slice(0, 8); // Next 24 hours (3-hour intervals)

  const getDominantCondition = (conditions) => {
    return Object.keys(conditions).reduce((a, b) =>
      conditions[a] > conditions[b] ? a : b
    );
  };

  const formatDate = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getChanceOfRain = (items) => {
    const rainChances = items.map(item => item.pop || 0);
    return Math.max(...rainChances) * 100;
  };

  return (
    <div className="forecast-container glass">

      {/* Hourly Forecast */}
      <div className="hourly-forecast">
        <h3 style={{
          color: '#ffd700',
          textAlign: 'center',
          fontSize: '150%',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
        }}>
          ⏰ Hourly Forecast
        </h3>

        <div className="hourly-grid">
          {hourlyForecast.map((hour, index) => {
            const time = new Date(hour.dt * 1000);
            const isNow = index === 0;
            const weatherId = hour.weather?.[0]?.id || 0;
            const weatherMain = hour.weather?.[0]?.main || 'Unknown';
            const temp = hour.main?.temp || 0;
            const pop = hour.pop || 0;
            const windSpeed = hour.wind?.speed || 0;

            return (
              <div key={hour.dt} className="hourly-item">
                <div className="hourly-time">
                  {isNow ? 'Now' : time.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    hour12: true
                  })}
                </div>

                <WeatherIcon weatherMain={weatherMain} weatherId={weatherId} size="small" />

                <div className="hourly-temp">{Math.round(temp)}°</div>

                <div className="hourly-detail">{Math.round(pop * 100)}% 💧</div>
                <div className="hourly-detail">{Math.round(windSpeed * 3.6)} km/h</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="forecast-header">
        <h2 style={{
          color: '#ffd700',
          textAlign: 'center',
          fontSize: '150%',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
        }}>
          🗓️ 5-Day Forecast
        </h2>
        <p style={{
          color: '#4B5563',
          textAlign: 'center',
          fontSize: '110%'
        }}>
          Weather outlook for the next 5 days
        </p>
      </div>

      <div className="forecast-grid">
        {forecastDays.map((day, index) => {
          const maxTemp = Math.max(...day.temps);
          const minTemp = Math.min(...day.temps);
          const dominantCondition = getDominantCondition(day.conditions);
          const rainChance = getChanceOfRain(day.items);
          const isToday = index === 0;

          const firstItem = day.items[0] || {};
          const weatherId = firstItem.weather?.[0]?.id || 0;
          const weatherDesc = firstItem.weather?.[0]?.description || 'N/A';
          const windSpeed = firstItem.wind?.speed || 0;
          const humidity = firstItem.main?.humidity || 0;

          return (
            <div key={`${day.date.toDateString()}-${index}`} className={`forecast-item ${isToday ? 'highlight' : ''}`}>
              <div className="forecast-date">{formatDate(day.date)}</div>

              <WeatherIcon weatherMain={dominantCondition} weatherId={weatherId} size="medium" />

              <div className="forecast-temps">
                <span className="forecast-temp-max">{Math.round(maxTemp)}°</span>
                <span className="forecast-temp-min">{Math.round(minTemp)}°</span>
              </div>

              <div className="forecast-desc">{weatherDesc}</div>

              {/* Details aligned neatly */}
              <div className="forecast-details">
                <div className="detail-item">
                  <span className="detail-label">💧 Rain<span className="detail-value">
                    {Math.round(rainChance)}
                    <span className="detail-unit">%</span>
                  </span></span>
                  
                </div>

                <div className="detail-item">
                  <span className="detail-label">🌪️ Wind<span className="detail-value">
                    {Math.round(windSpeed * 3.6)}
                    <span className="detail-unit"> km/h</span>
                  </span></span>
                  
                </div>

                <div className="detail-item">
                  <span className="detail-label">💧 Humidity<span className="detail-value">
                    {humidity}
                    <span className="detail-unit">%</span>
                  </span></span>
                  
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
