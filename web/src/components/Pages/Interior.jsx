import "../Style/Interor.css";
import SwitchButton from "../Elements/SwitchButton";
import { useEffect, useState } from "react";
import { fetchNui } from "../../utils/fetchNui";
import copyIcon from "../assets/copyIcon.svg";
import interior2 from "../assets/interior2.svg";

function Interior({ InteriorId, dataInterior, dataTimeCycle }) {
  const [portalOptions, setPortalOptions] = useState({
    portalInfos: false,
    portalPoly: false,
    portalLines: false,
    portalCorners: false,
  });

  useEffect(() => {
    const savedOptions = localStorage.getItem("portalOptions");
    if (savedOptions) {
      setPortalOptions(JSON.parse(savedOptions));
    }
  }, []);

  const handleSwitchToggle = (key, state) => {
    const updatedOptions = { ...portalOptions, [key]: state };
    setPortalOptions(updatedOptions);
    localStorage.setItem("portalOptions", JSON.stringify(updatedOptions));
    fetchNui("setPortalBox", updatedOptions);
  };

  const handleTimeCycleChange = (event) => {
    const selectedTimeCycle = event.target.value;
    fetchNui("setTimecycle", { timeCycle: selectedTimeCycle });
  };

  const copyToClipboard = (interiorId) => {
    fetchNui("copyInteriorData", interiorId);
  };
  return (
    <div className="interior-container">
      <div className="interior-container-header">
        <img src={interior2} alt="" />
        <h1>Interior Debugger</h1>
      </div>

      {dataInterior ? (
        <>
          <div className="interior-card-container">
            <h1>Interior Information</h1>
            <div className="current-interior-id">
              <label>Current Interior ID</label>
              <div className="cuurent-interior-id-value">
                {dataInterior.interiorId || "Unknown Interior"}
                <img
                  src={copyIcon}
                  onClick={() => copyToClipboard(dataInterior.interiorId)}
                  alt="Copy Icon"
                />
              </div>
            </div>
            <div className="current-interior-id">
              <label>Current Room ID</label>
              <div className="cuurent-interior-id-value">
                {dataInterior.currentRoom.name || "Unknown Room"}
                <img
                  src={copyIcon}
                  onClick={() => copyToClipboard(dataInterior.currentRoom.name)}
                  alt="Copy Icon"
                />
              </div>
            </div>
          </div>

          <div className="interior-portal-debugging">
            <h1>Portals Debugging</h1>

            <div className="interior-option-select">
              <label>Infos</label>
              <SwitchButton
                isOn={portalOptions.portalInfos}
                onToggle={(state) => handleSwitchToggle("portalInfos", state)}
                switchKey="portalInfosSwitch"
              />
            </div>
            <div className="interior-option-select">
              <label>Fill</label>
              <SwitchButton
                isOn={portalOptions.portalPoly}
                onToggle={(state) => handleSwitchToggle("portalPoly", state)}
                switchKey="portalPolySwitch"
              />
            </div>
            <div className="interior-option-select">
              <label>Outline</label>
              <SwitchButton
                isOn={portalOptions.portalLines}
                onToggle={(state) => handleSwitchToggle("portalLines", state)}
                switchKey="portalLinesSwitch"
              />
            </div>
            <div className="interior-option-select">
              <label>Corners</label>
              <SwitchButton
                isOn={portalOptions.portalCorners}
                onToggle={(state) => handleSwitchToggle("portalCorners", state)}
                switchKey="portalCornersSwitch"
              />
            </div>
          </div>

          <div className="interior-portal-timecycle">
            <div className="interior-portal-card">
              <h1>Room Timecycle</h1>
              <select
                name="timeCycle"
                id="timeCycleSelect"
                onChange={handleTimeCycleChange}
              >
                <option value="">Select a timecycle</option>
                {dataTimeCycle &&
                  dataTimeCycle.map((cycle, index) => (
                    <option
                      style={{ color: "white" }}
                      key={index}
                      value={cycle.value}
                    >
                      {cycle.label}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </>
      ) : (
        <p className="no-data">No valid Interior ID or data found.</p>
      )}
    </div>
  );
}

export default Interior;
