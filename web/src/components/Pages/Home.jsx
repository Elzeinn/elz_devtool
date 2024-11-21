import React, { useState, useEffect } from "react";
import "../Style/Home.css";
import DaySelector from "./DaySelector";
import SwitchButton from "../Elements/SwitchButton";
import { fetchNui } from "../../utils/fetchNui";
import iconWeather from "../assets/weather.svg";
import iconMaps from "../assets/maps.svg";
import copyIcon from "../assets/copyIcon.svg";

function CoordinatesDisplay({ coordinates }) {
  const [isCoordinateOpen, setIsCoordinateOpen] = useState(false);
  const [isTimeWeatherOpen, setIsTimeWeatherOpen] = useState(false);
  const [isFrozenTime, setIsFrozenTime] = useState(false);
  const [isFrozenWeather, setIsFrozenWeather] = useState(false);
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [weather, setWeather] = useState("CLEAR");

  const loadSettings = () => {
    const savedSettings = localStorage.getItem("coordinatesSettings");
    if (savedSettings) {
      const { isFrozenTime, isFrozenWeather } = JSON.parse(savedSettings);
      setIsFrozenTime(isFrozenTime);
      setIsFrozenWeather(isFrozenWeather);
    }
  };

  const saveSettings = () => {
    const settings = { isFrozenTime, isFrozenWeather };
    localStorage.setItem("coordinatesSettings", JSON.stringify(settings));
  };

  const handleFreezeToggle = (state, key) => {
    if (key === "freezeTime") {
      setIsFrozenTime(state);
      fetchNui("setFreezeTime", { freeze: state, time });
    } else if (key === "freezeWeather") {
      setIsFrozenWeather(state);
      fetchNui("setFreezeWeather", { freeze: state, weather });
    }
  };

  const copyToClipboard = (text, type) => {
    fetchNui("getCoords", { cordinat: text, type });
  };

  const handleTimeChange = ({ target: { name, value } }) =>
    setTime((prev) => ({ ...prev, [name]: value }));

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    saveSettings();
  }, [isFrozenTime, isFrozenWeather]);

  return (
    <div className="menu-container">
      <MenuHeader
        type="coordinates"
        icon={iconMaps}
        title="Current coordinates"
        isOpen={isCoordinateOpen}
        onClick={() => setIsCoordinateOpen(!isCoordinateOpen)}
      />
      {isCoordinateOpen && (
        <div className={`coordinates-info ${isCoordinateOpen ? "open" : ""}`}>
          <CoordinateItem
            label="Coordinates"
            value={`X: ${coordinates.x} Y: ${coordinates.y} Z: ${coordinates.z}`}
            onCopy={() =>
              copyToClipboard(
                `${coordinates.x},${coordinates.y},${coordinates.z}`,
                "coordinates"
              )
            }
            className="setBackground"
          />
          <CoordinateItem
            className="setHeading"
            label="Heading"
            value={coordinates.heading}
            onCopy={() => copyToClipboard(coordinates.heading, "heading")}
          />
        </div>
      )}
      <MenuHeader
        type="timeWeather"
        icon={iconWeather}
        title="Time and weather configurations"
        isOpen={isTimeWeatherOpen}
        onClick={() => setIsTimeWeatherOpen(!isTimeWeatherOpen)}
      />
      <div className={`time-weather-info ${isTimeWeatherOpen ? "open" : ""}`}>
        <TimeSetting
          time={time}
          onTimeChange={handleTimeChange}
          onApply={() => fetchNui("setTimeWeather", { time })}
        />
        <WeatherSetting
          weather={weather}
          onWeatherChange={(newWeather) => setWeather(newWeather)}
          onApply={() => fetchNui("setWeather", { weather })}
        />
        <FreezeToggle
          label="Freeze time"
          type="freezeTime"
          isFrozen={isFrozenTime}
          onToggle={(state) => handleFreezeToggle(state, "freezeTime")}
        />
        <FreezeToggle
          label="Freeze weather status"
          type="freezeWeather"
          isFrozen={isFrozenWeather}
          onToggle={(state) => handleFreezeToggle(state, "freezeWeather")}
        />
      </div>
    </div>
  );
}

const MenuHeader = ({ icon, title, isOpen, onClick, type }) => (
  <div className="home-header" onClick={onClick}>
    <img src={icon} alt="" />
    <h1 className={type}>{title}</h1>
    {type !== "timeWeather" && (
      <i
        className={`arrow fa-solid ${
          isOpen ? "fa-chevron-up open" : "fa-chevron-down"
        }`}
      />
    )}
  </div>
);

const CoordinateItem = ({ label, value, onCopy, className }) => (
  <div className={`coordinate-item ${className}`}>
    <label>{label}</label>
    <div className={`coordinate-value`}>
      {value}
      <img src={copyIcon} onClick={onCopy} alt="" />
    </div>
  </div>
);

const TimeSetting = ({ time, onTimeChange, onApply }) => (
  <div className="time-weather-item setTime">
    <label>Set Time</label>
    <div className="time-setting">
      {["hours", "minutes", "seconds"].map((unit) => (
        <input
          key={unit}
          type="number"
          name={unit}
          placeholder={unit}
          max={unit === "hours" ? "24" : "60"}
          min="0"
          value={time[unit]}
          onChange={onTimeChange}
        />
      ))}
      <button
        className="apply-button"
        onClick={() => {
          onApply();
        }}
      >
        Apply
      </button>
    </div>
  </div>
);

const WeatherSetting = ({ weather, onWeatherChange, onApply }) => (
  <div className="time-weather-item">
    <label>Weather</label>
    <div className="weather-setting">
      <DaySelector onWeatherChange={onWeatherChange} />
      <button className="apply-button" onClick={onApply}>
        Apply
      </button>
    </div>
  </div>
);

const FreezeToggle = ({ label, onToggle, type }) => (
  <div className={type}>
    <label className={type}>{label}</label>
    <SwitchButton switchKey={type} onToggle={onToggle} />
  </div>
);

export default CoordinatesDisplay;
