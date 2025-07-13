import React from 'react';
import WeatherAlert from './WeatherAlert';

const Alerts = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="alert-container">
      {alerts.map((alert, index) => (
        <WeatherAlert 
          key={index}
          type={alert.type === 'warning' ? 'Severe Weather Alert' : 'Weather Alert'}
          message={alert.message}
        />
      ))}
    </div>
  );
};

export default Alerts;
