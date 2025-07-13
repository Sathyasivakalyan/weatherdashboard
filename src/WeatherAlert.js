import React, { useState, useEffect } from 'react';

const WeatherAlert = ({ type, message }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const getAlertIcon = (alertType) => {
    switch (alertType.toLowerCase()) {
      case 'severe weather alert':
        return '⚠️';
      case 'snow alert':
        return '❄️';
      case 'weather alert':
        return '🌧️';
      default:
        return '📢';
    }
  };

  const getAlertClass = (alertType) => {
    switch (alertType.toLowerCase()) {
      case 'severe weather alert':
        return 'alert severe-weather-alert';
      case 'snow alert':
        return 'alert snow-alert';
      case 'weather alert':
        return 'alert weather-alert';
      default:
        return 'alert weather-alert';
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <div className="alert-container">
      <div className={getAlertClass(type)}>
        <div className="alert-icon">
          {getAlertIcon(type)}
        </div>
        <div className="alert-content">
          <div className="alert-title">{type}</div>
          <div className="alert-message">{message}</div>
        </div>
        <button className="alert-close" onClick={handleClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default WeatherAlert;