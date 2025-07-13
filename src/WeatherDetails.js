import React from 'react';

const WeatherDetails = ({ temperature, wind, visibility, humidity, pressure }) => {
  const formatVisibility = (vis) => {
    if (vis >= 1000) {
      return `${(vis / 1000).toFixed(1)} km`;
    }
    return `${vis} m`;
  };

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  const getPressureDescription = (pressure) => {
    if (pressure < 1000) return 'Low';
    if (pressure > 1020) return 'High';
    return 'Normal';
  };

  const getHumidityDescription = (humidity) => {
    if (humidity < 30) return 'Dry';
    if (humidity > 70) return 'Humid';
    return 'Comfortable';
  };

  return (
    <div className="weather-details">
      <div className="detail-item">
        <span className="detail-icon">💧</span>
        <div className="detail-label">Humidity</div>
        <div className="detail-value">{humidity}</div>
        <div className="detail-unit">%</div>
        <div className="detail-description" style={{ fontSize: '0.8em', color: 'rgba(255, 255, 255, 0.6)', marginTop: '5px' }}>{getHumidityDescription(humidity)}</div>
      </div>

      <div className="detail-item">
        <span className="detail-icon">🌪️</span>
        <div className="detail-label">Wind</div>
        <div className="detail-value">{Math.round(wind.speed * 3.6)}</div>
        <div className="detail-unit">km/h</div>
        <div className="detail-description" style={{ fontSize: '0.8em', color: 'rgba(255, 255, 255, 0.6)', marginTop: '5px' }}>{getWindDirection(wind.deg)}</div>
      </div>

      <div className="detail-item">
        <span className="detail-icon">🌡️</span>
        <div className="detail-label">Pressure</div>
        <div className="detail-value">{pressure}</div>
        <div className="detail-unit">hPa</div>
        <div className="detail-description" style={{ fontSize: '0.8em', color: 'rgba(255, 255, 255, 0.6)', marginTop: '5px' }}>{getPressureDescription(pressure)}</div>
      </div>

      <div className="detail-item">
        <span className="detail-icon">👁️</span>
        <div className="detail-label">Visibility</div>
        <div className="detail-value">{formatVisibility(visibility)}</div>
        <div className="detail-unit"></div>
        <div className="detail-description" style={{ fontSize: '0.8em', color: 'rgba(255, 255, 255, 0.6)', marginTop: '5px' }}>
          {visibility > 10000 ? 'Excellent' : visibility > 5000 ? 'Good' : 'Limited'}
        </div>
      </div>

      <div className="detail-item">
        <span className="detail-icon">🔥</span>
        <div className="detail-label">Heat Index</div>
        <div className="detail-value">{Math.round(temperature.feels_like)}</div>
        <div className="detail-unit">°C</div>
        <div className="detail-description" style={{ fontSize: '0.8em', color: 'rgba(255, 255, 255, 0.6)', marginTop: '5px' }}>
          {temperature.feels_like > temperature.temp + 2 ? 'Warmer' : 
           temperature.feels_like < temperature.temp - 2 ? 'Cooler' : 'Same'}
        </div>
      </div>

      <div className="detail-item">
        <span className="detail-icon">📊</span>
        <div className="detail-label">Temperature</div>
        <div className="detail-value">{Math.round(temperature.temp)}</div>
        <div className="detail-unit">°C</div>
        <div className="detail-description" style={{ fontSize: '0.8em', color: 'rgba(255, 255, 255, 0.6)', marginTop: '5px' }}>
          H: {Math.round(temperature.temp_max || temperature.temp)}° 
          L: {Math.round(temperature.temp_min || temperature.temp)}°
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;