import React, { useState, useEffect } from 'react';
import '../Style/SwitchButton.css';

const SwitchButton = ({ onToggle, switchKey }) => {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem(switchKey);
    if (savedState !== null) {
      setIsOn(JSON.parse(savedState));
    }
  }, [switchKey]);

  const toggleSwitch = () => {
    const newStatus = !isOn;
    setIsOn(newStatus);
    onToggle(newStatus);
    localStorage.setItem(switchKey, JSON.stringify(newStatus));
  };

  return (
    <div className={`switch-container ${isOn ? 'on' : 'off'}`}>
      <input
        type="checkbox"
        className="switch"
        checked={isOn}
        onChange={toggleSwitch}
      />
      <label className="switch-label" onClick={toggleSwitch}>
        <span className="switch-button" />
      </label>
    </div>
  );
};

export default SwitchButton;
