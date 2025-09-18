import React, { useState } from "react";
import { WEATHER_API_KEY } from "./config"; // import API key safely

const SearchBar = ({ onSearch, loading }) => {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchCitySuggestions = async (query) => {
    if (query.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          query
        )}&limit=5&appid=${WEATHER_API_KEY}`
      );

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      } else {
        console.error("Failed to fetch suggestions", response.status);
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setSuggestions([]);
    }
  };

  const handleSearch = () => {
    if (city.trim()) {
      onSearch(city);
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    const fullName = `${suggestion.name}, ${suggestion.country}`;
    setCity(fullName);
    onSearch(fullName);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="search-container" style={{ position: "relative" }}>
      <input
        className="city-input"
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => {
          const input = e.target.value;
          setCity(input);
          setShowSuggestions(true);
          fetchCitySuggestions(input);
        }}
        onFocus={() => {
          if (city.trim()) {
            setShowSuggestions(true);
            fetchCitySuggestions(city);
          }
        }}
      />
      <button className="search-btn" onClick={handleSearch} disabled={loading}>
        {loading ? "Loading..." : "Search"}
      </button>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestion-list glass">
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.name}-${suggestion.lat}-${suggestion.lon}-${index}`}
              className="suggestion-item"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion.name}, {suggestion.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
