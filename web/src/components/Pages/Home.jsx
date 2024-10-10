import React, { useState, useEffect } from "react";
import "../Style/Home.css"; // Assume custom styles
import DaySelector from "./DaySelector";
import SwitchButton from "../Elements/SwitchButton";
import { fetchNui } from "../../utils/fetchNui";
import { useNuiEvent } from "../../hooks/useNuiEvent";

function CoordinatesDisplay() {
  {
    /* Coordinates Display */
  }
  const [isCoordinateOpen, setIsCoordinateOpen] = useState(false);
  const [isTimeWeatherOpen, setIsTimeWeatherOpen] = useState(false);

  const [isFrozen, setIsFrozen] = useState(false);

  {
    /* State Coord */
  }
  const [coordinates] = useState({
    x: -803.717,
    y: 176.49,
    z: 72.841,
    heading: 213.635,
  });

  {
    /* State Time */
  }
  const [time, setTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  {
    /* State Weather */
  }
  const [weather, setWeather] = useState("CLEAR"); // CLEAR | EXTRASUNNY | CLOUDS | SMOG | FOGGY | OVERCAST | RAIN | THUNDER | CLEARING | NEUTRAL | SNOW | BLIZZARD | SNOWLIGHT | XMAS | HALLOWEEN

  {
    /* Handle Time Change */
  }
  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setTime((prevTime) => ({
      ...prevTime,
      [name]: value,
    }));
  };

  {
    /* Send To Client */
  }
  const handleApply = () => {
    fetchNui("setTimeWeather", {
      time: {
        hours: time.hours,
        minutes: time.minutes,
        seconds: time.seconds,
      },
    });
  };

  const handleSendWeather = () => {
    fetchNui("setWeather", {
      weather: weather,
    });
  };

  {
    /* Handle State Weather */
  }
  const handleWeatherChange = (newWeather) => {
    setWeather(newWeather);
  };

  {
    /* Get Data Coord From Client */
  }
  useNuiEvent("getCordinate", (data) => {
    coordinates.x = data.x;
    coordinates.y = data.y;
    coordinates.z = data.z;
    coordinates.heading = data.heading;
  });



  {
    /* Send Coord to Clipboard */
  }
  const copyToClipboard = (text, type) => {
    fetchNui("getCoords", {
      cordinat: text,
      type: type,
    });
  };

  {
    /* State Open */
  }

  const toggleCoordinateMenu = () => {
    setIsCoordinateOpen(!isCoordinateOpen);
  };

  {
    /* Weather Open */
  }

  const toggleTimeWeatherMenu = () => {
    setIsTimeWeatherOpen(!isTimeWeatherOpen);
  };

  {
    /* Send Data Freeze Time And Freeze Weather */
  }
  const handleFreezeTimeToggle = (newState) => {
    setIsFrozen(newState);
  };
  
  useEffect(() => {
    fetchNui("setFreezeTime", {
      freeze: isFrozen,
      time: {
        hours: time.hours,
        minutes: time.minutes,
        seconds: time.seconds,
      },
    });
  }, [isFrozen, time]); // Akan memicu setiap kali isFrozen atau time berubah

  const handleFreezeWeatherToggle = (isFrozen) => {
    fetchNui("setFreezeWeather", { freeze: isFrozen, weather: weather });
  };

  return (
    <div className="menu-container">
      {/* Menu Coordinates */}
      <div className="home-header header" onClick={toggleCoordinateMenu}>
        <i className="fa-solid fa-location-dot home-primary"></i>
        <h1>Current Coordinates</h1>
        <i
          className={`arrow fa-solid ${
            isCoordinateOpen ? "fa-chevron-up" : "fa-chevron-down"
          }`}
        />
      </div>
      {isCoordinateOpen && (
        <div className="coordinates-info">
          <div className="coordinate-item">
            <label>Coordinates</label>
            <div className="coordinate-value">
              X: {coordinates.x}, Y: {coordinates.y}, Z: {coordinates.z}
              <i
                className="fa-regular fa-copy copy-icon"
                onClick={() =>
                  copyToClipboard(
                    `${coordinates.x},${coordinates.y},${coordinates.z}`,
                    "coordinates"
                  )
                }
              ></i>
            </div>
          </div>
          <div className="coordinate-item">
            <label>Heading</label>
            <div className="coordinate-value">
              {coordinates.heading}
              <i
                className="fa-regular fa-copy copy-icon"
                onClick={() => copyToClipboard(coordinates.heading, "heading")}
              ></i>
            </div>
          </div>
        </div>
      )}

      {/* Menu Time and Weather */}
      <div className="home-header header" onClick={toggleTimeWeatherMenu}>
        <i className="fa-solid fa-cloud home-primary icnCloud"></i>
        <h1>Time and Weather Configuration</h1>
        <i
          className={`arrow fa-solid ${
            isTimeWeatherOpen ? "fa-chevron-up" : "fa-chevron-down"
          }`}
        />
      </div>
      {isTimeWeatherOpen && (
        <div className="time-weather-info">
          <div className="time-weather-item">
            <label>Set Time</label>
            <div className="time-setting">
              <input
                type="number"
                placeholder="housrs"
                max="24"
                min="0"
                name="hours"
                value={time.hours}
                onChange={handleTimeChange}
              />
              <input
                type="number"
                placeholder="minute"
                max="60"
                min="0"
                name="minutes"
                value={time.minutes}
                onChange={handleTimeChange}
              />
              <input
                type="number"
                placeholder="seconds"
                max="60"
                min="0"
                name="seconds"
                value={time.seconds}
                onChange={handleTimeChange}
              />
              <button className="apply-button" onClick={handleApply}>
                Apply
              </button>
            </div>
          </div>
          <div className="time-weather-item">
            <label>Weather</label>
            <div className="weather-setting">
              <DaySelector onWeatherChange={handleWeatherChange} />
              <button className="apply-button" onClick={handleSendWeather}>
                Apply
              </button>
            </div>
          </div>
          <div className="time-weather-item">
            <label>Freeze Time</label>
            <SwitchButton onToggle={handleFreezeTimeToggle} />
          </div>
          <div className="time-weather-item">
            <label>Freeze Weather Status</label>
            <SwitchButton onToggle={handleFreezeWeatherToggle} />
          </div>
        </div>
      )}
    </div>
  );
}

export default CoordinatesDisplay;
