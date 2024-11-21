import React, { useState, useEffect } from "react";
import "../Style/DaySelector.css";

function DaySelector({ onWeatherChange }) {
  const days = [
    "BLIZZARD",
    "CLEAR",
    "CLEARING",
    "CLOUDS",
    "EXTRASUNNY",
    "XMAS",
    "FOGGY",
    "NEUTRAL",
    "OVERCAST",
    "RAIN",
    "SMOG",
    "SNOW",
    "SNOWLIGHT",
    "THUNDER",
  ];
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  const previousDay = () => {
    setCurrentDayIndex((prevIndex) =>
      prevIndex === 0 ? days.length - 1 : prevIndex - 1
    );
  };

  const nextDay = () => {
    setCurrentDayIndex((prevIndex) =>
      prevIndex === days.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    if (onWeatherChange) {
      onWeatherChange(days[currentDayIndex]);
    }
  }, [currentDayIndex, onWeatherChange]);

  return (
    <div className="day-selector">
      <button className="arrow-btn" onClick={previousDay}>
        <i className="fa-solid fa-chevron-left"></i>
      </button>
      <span className="selected-day">{days[currentDayIndex]}</span>
      <button className="arrow-btn" onClick={nextDay}>
        <i className="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  );
}

export default DaySelector;
