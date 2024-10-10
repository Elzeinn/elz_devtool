import '../Style/Interor.css';
import SwitchButton from '../Elements/SwitchButton';
import { useEffect, useState } from 'react';
import { fetchNui } from '../../utils/fetchNui';

function Interior({ InteriorId, dataInterior, dataTimeCycle }) {
    const [portalOptions, setPortalOptions] = useState({
        portalInfos: false, 
        portalPoly: false,   
        portalLines: false,  
        portalCorners: false
    });

    // const [currentTimeCycleIndex, setCurrentTimeCycleIndex] = useState(0);

    const handleSwitchToggle = (key, state) => {
        const updatedOptions = { ...portalOptions, [key]: state };
        setPortalOptions(updatedOptions);
        fetchNui('setPortalBox', updatedOptions)};

    const handleLeftArrowClick = () => {
        // setCurrentTimeCycleIndex(prevIndex => 
        //     prevIndex > 0 ? prevIndex - 1 : dataTimeCycle.length - 1
        // );
    };


    const handleRightArrowClick = () => {
        // setCurrentTimeCycleIndex(prevIndex => 
        //     (prevIndex + 1) % dataTimeCycle.length 
        // );
    };

    const handleTimeCycleChange = (event) => {
        const selectedTimeCycle = event.target.value;
        fetchNui('setTimecycle', { timeCycle: selectedTimeCycle })};

    const copyToClipboard = (interiorId) => {
        fetchNui("copyInteriorData", interiorId);
    };

    return (
        <div className="interior-container">
            <div className="interior-container-header">
                <i className="worldeditorPrimary fa-solid fa-couch"></i>
                <h1>Interior Debugger</h1>
            </div>
            {dataInterior ? (
                <>
                    <div className="interior-card-container">
                        <div className="current-interior-id">
                            <label>Current Interior ID</label>
                            <div className="cuurent-interior-id-value">
                                {dataInterior.interiorId}
                                <i
                                    className="fa-regular fa-copy copy-icon"
                                    onClick={() => copyToClipboard(dataInterior.interiorId, "Interior ID")}
                                ></i>
                            </div>
                        </div>
                        <div className="current-interior-id">
                            <label>Current Room ID</label>
                            <div className="cuurent-interior-id-value">
                                {dataInterior.currentRoom.name || 'Unknown Room'}
                                <i
                                    className="fa-regular fa-copy copy-icon"
                                    onClick={() => copyToClipboard(dataInterior.currentRoom.name, "Room ID")}
                                ></i>
                            </div>
                        </div>
                    </div>
                    <div className="interior-portal-debugging">
                        <h1>Portal Debugging</h1>
                        <div className="interior-option-select">
                            <label>Infos</label>
                            <SwitchButton
                                isOn={portalOptions.portalInfos}
                                onToggle={(state) => handleSwitchToggle('portalInfos', state)}  // Handle button toggle for Infos
                            />
                        </div>
                        <div className="interior-option-select">
                            <label>Fill</label>
                            <SwitchButton
                                isOn={portalOptions.portalPoly}
                                onToggle={(state) => handleSwitchToggle('portalPoly', state)}  // Handle button toggle for Fill
                            />
                        </div>
                        <div className="interior-option-select">
                            <label>Outline</label>
                            <SwitchButton
                                isOn={portalOptions.portalLines}
                                onToggle={(state) => handleSwitchToggle('portalLines', state)}  // Handle button toggle for Outline
                            />
                        </div>
                        <div className="interior-option-select">
                            <label>Corners</label>
                            <SwitchButton
                                isOn={portalOptions.portalCorners}
                                onToggle={(state) => handleSwitchToggle('portalCorners', state)}  // Handle button toggle for Corners
                            />
                        </div>
                    </div>
                    <div className="interior-portal-timecycle">
                        <div className="interior-portal-card">
                            <select name="timeCycle" id="timeCycleSelect" onChange={handleTimeCycleChange}>
                                <option value="">Select Time Cycle</option>
                                {dataTimeCycle && dataTimeCycle.map((cycle, index) => (
                                    <option style={{ color: 'white' }} key={index} value={cycle.value}>
                                        {cycle.label}
                                    </option>
                                ))}
                            </select>
                            <i className="fa-solid fa-chevron-left" onClick={handleLeftArrowClick}></i>
                            <i className="fa-solid fa-chevron-right" onClick={handleRightArrowClick}></i>
                            <i className="fa-solid fa-gear"></i>
                        </div>
                        <div className="interior-portal-fitur"></div>
                    </div>
                </>
            ) : (
                <p>No valid Interior ID or data found.</p>
            )}
        </div>
    );
}

export default Interior;
