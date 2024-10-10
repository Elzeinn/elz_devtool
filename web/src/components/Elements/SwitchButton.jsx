import React, { useState } from 'react';
import '../Style/SwitchButton.css';

const SwitchButton = ({ onToggle }) => {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => {
    const newStatus = !isOn;
    setIsOn(newStatus);
    onToggle(newStatus);
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
      <span className="switch-text"></span>
    </div>
  );
};

export default SwitchButton;
