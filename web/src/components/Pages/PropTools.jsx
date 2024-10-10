import React, { useState } from "react";
import "../Style/Proptools.css";
import { fetchNui } from "../../utils/fetchNui";
import { useNuiEvent } from "../../hooks/useNuiEvent";

function PropTools() {
  // State untuk toggle tampilan kontainer
  const [isPropToolsOpen, setIsPropToolsOpen] = useState(false);
  const [propModel, setPropModel] = useState('prop_mp_cone_02'); 
  const [selectedBone, setSelectedBone] = useState('SKELL_ROOT'); 
  const [offSet, setOffSet] = useState(null);

  // Fungsi untuk toggle kontainer
  const togglePropTools = () => {
    setIsPropToolsOpen(!isPropToolsOpen);
  };

  // Fungsi untuk mengirim data menggunakan fetchNui
  const sendDataToNui = () => {
    const data = {
      propModel,
      selectedBone,
    };
    fetchNui('editOffset',data)
  };
  
  useNuiEvent('getOffset', (data) => {
    setOffSet(data)
  })

      const sendOffsetClip = () => {
      if (offSet) {
          fetchNui('clipOffset', { offSet }).then((response) => {
              if (response) {
                  setOffSet(null);
              }
          });
      } else {
          console.error("Offset data is null or undefined!");
      }
  };


  return (
    <>
      <div className="prop-tools">
        <div className="prop-tools-header header" onClick={togglePropTools}>
          <i className="propPrimary fa-solid fa-cube"></i>
          <h1>Prop Tools</h1>
          <i
            className={`fa-solid ${
              isPropToolsOpen ? "fa-chevron-up" : "fa-chevron-down"
            }`}
          />
        </div>
        {isPropToolsOpen && (
          <div className="prop-tools-container">
            <div className="prop-tools-content"></div>
            <div className="prop-tools-model">
              <label>Prop Model</label>
              <input
                type="text"
                placeholder="prop_tool_fireaxe"
                value={propModel}
                onChange={(e) => setPropModel(e.target.value)} 
              />
            </div>
            <div className="prop-tools-model">
              <label>Target Entity</label>
              <select name="" id="">
                <option value="">Select</option>
                <option value="Player">Player</option>
                <option value="Vehicle">Vehicle</option>
              </select>
            </div>
            <div className="prop-tools-model">
              <label>Animation</label>
              <input type="text" placeholder="Animation dict" />
              <input type="text" placeholder="Animation clip" />
            </div>
            <div className="prop-tools-model">
              <label>Bones</label>
              <select
                value={selectedBone}
                onChange={(e) => setSelectedBone(e.target.value)} 
              >
                <option value="SKELL_ROOT">SKELL_ROOT</option>
                {/* Tambahkan opsi lain sesuai kebutuhan */}
              </select>
            </div>
            <div className="btn">
              <button className="copy" onClick={sendOffsetClip}>Copy native</button>
              <button className="editOffset" onClick={sendDataToNui}>Edit offset</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default PropTools;
