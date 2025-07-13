import React from 'react';

const WeatherIcon = ({ weatherMain, weatherId, size = 'medium', data }) => {
  const getWeatherIcon = (main, id) => {
    // Map weather conditions to emojis
    const iconMap = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Smoke': '🌫️',
      'Haze': '🌫️',
      'Dust': '🌫️',
      'Fog': '🌫️',
      'Sand': '🌫️',
      'Ash': '🌫️',
      'Squall': '💨',
      'Tornado': '🌪️'
    };

    // More specific icons based on weather ID ranges
    if (id >= 200 && id < 300) return '⛈️'; // Thunderstorm
    if (id >= 300 && id < 400) return '🌦️'; // Drizzle
    if (id >= 500 && id < 600) {
      if (id === 511) return '🌨️'; // Freezing rain
      return '🌧️'; // Rain
    }
    if (id >= 600 && id < 700) return '🌨️'; // Snow
    if (id >= 700 && id < 800) return '🌫️'; // Atmosphere conditions
    if (id === 800) return '☀️'; // Clear sky
    if (id > 800) {
      if (id === 801) return '🌤️'; // Few clouds
      if (id === 802) return '⛅'; // Scattered clouds
      return '☁️'; // Broken/overcast clouds
    }

    return iconMap[main] || '🌤️';
  };

  const getSizeClass = (size) => {
    switch (size) {
      case 'small': return 'weather-icon small';
      case 'medium': return 'weather-icon medium';
      case 'large': return 'weather-icon large';
      default: return 'weather-icon medium';
    }
  };

  const icon = getWeatherIcon(weatherMain, weatherId);

  return (
    <div className={getSizeClass(size)}>
      <span role="img" aria-label={weatherMain}>
        {icon}
      </span>
    </div>
  );
};

export default WeatherIcon;