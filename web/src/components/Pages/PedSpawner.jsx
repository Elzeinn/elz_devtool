import React, { useState } from "react";
import "../Style/Home.css"; 
import { fetchNui } from "../../utils/fetchNui";
import { useNuiEvent } from "../../hooks/useNuiEvent";
import '../Style/PedSpawner.css'
import InputForm from "../Elements/InputForm";

function PedSpawner() {
  const [showInputForm, setShowInputForm] = useState(false);
  const [peds, setPeds] = useState([]);
  const [gizmoData, setGizmoData] = useState(null); // State untuk menyimpan data gizmo

  const copyToClipboard = (data) => {
    fetchNui("copyDataPed", data);
  };

  const handleCreatePedClick = () => {
    setShowInputForm(true); 
  };

  const handleApplyChanges = (ped) => {
    fetchNui("applyPedChanges", {
      ped: {
        model: ped.model,
        name: ped.name,
        coordinates: ped.coordinates,
        animation: {
          dict: ped.animationDict,  // Ambil dari state ped
          clip: ped.animationClip    // Ambil dari state ped
        }
      }
    });
    console.log("Apply Changes clicked for", ped.model);
  };

  const handleInputFormSubmit = (data) => {
    const newPed = {
      model: data.model,
      name: data.name,
      coordinates: data.position,
      animationDict: "", // State untuk dictionary animasi
      animationClip: "", // State untuk clip animasi
      isCoordinateOpen: false, 
    };
    setPeds([...peds, newPed]); 
    setShowInputForm(false); 
  };

  const toggleCoordinateMenu = (index) => {
    const updatedPeds = peds.map((ped, idx) => {
      if (idx === index) {
        return { ...ped, isCoordinateOpen: !ped.isCoordinateOpen }; 
      }
      return ped;
    });
    setPeds(updatedPeds);
  };

  const handleDeletePed = (index) => {
    const updatedPeds = [...peds];
    updatedPeds.splice(index, 1); 
    setPeds(updatedPeds);
  };

  const showGizmo = (data) => {
    fetchNui("showGizmo", data)};

  useNuiEvent('getPedPosition', (data) => {
         setGizmoData(data);
        console.log(JSON.stringify(data, null, 2));
        // Update coordinates of the specific ped if needed
        const updatedPeds = peds.map((ped) => {
            if (ped.model === data.model) { // Sesuaikan kriteria pencarian sesuai kebutuhan
                return {
                    ...ped,
                    coordinates: {
                        coords: {
                            x: data.position.x,
                            y: data.position.y,
                            z: data.position.z,
                        },
                        entity : data.handle,
                        rotation: {
                            x: data.rotation.x,
                            y: data.rotation.y,
                            z: data.rotation.z,
                        },
                    }
                };
            }
            return ped;
        });

        setPeds(updatedPeds); // Update state peds dengan koordinat baru
  })

  const handleAnimationChange = (index, dict, clip) => {
    const updatedPeds = peds.map((ped, idx) => {
      if (idx === index) {
        return { ...ped, animationDict: dict, animationClip: clip }; // Update animasi
      }
      return ped;
    });
    setPeds(updatedPeds);
  };

  return (
    <div className="ped-spawner">
      <div className="ped-spawner-header header">
        <i className="fa-solid fa-paw home-primary"></i>
        <h1>Ped Spawner</h1>
      </div>

      {showInputForm && (
        <div className="input-form-container">
          <InputForm onSubmit={handleInputFormSubmit} /> 
        </div>
      )}

      {peds.map((ped, index) => ( 
        <div key={index} className="data-ped-container" onClick={() => toggleCoordinateMenu(index)}>
          <h1>{ped.name}</h1>
          <i
            className={`pedArrow fa-solid ${ped.isCoordinateOpen ? "fa-chevron-up" : "fa-chevron-down"}`}
          />
          <i
            className="pedTrash fa-solid fa-trash"
            onClick={(e) => {
              e.stopPropagation(); 
              handleDeletePed(index); 
            }}
          />
          {ped.isCoordinateOpen && (
            <div className="ped-data-info">
              <div className="ped-data-item">
                <label>Model Id</label>
                <div className="coordinate-value">
                  {ped.model}
                  <i
                    className="fa-regular fa-copy copy-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(ped.model);
                    }}
                  ></i>
                </div>
              </div>

              <div className="ped-data-info">
                <div className="ped-data-item">
                  <label>Coordinates</label>
                  <div className="coordinate-value">
                    {`{"x": ${ped.coordinates.coords.x}, "y": ${ped.coordinates.coords.y}, "z": ${ped.coordinates.coords.z}}`}
                    <i
                      className="fa-regular fa-copy copy-icon"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        copyToClipboard(`{"x": ${ped.coordinates.coords.x}, "y": ${ped.coordinates.coords.y}, "z": ${ped.coordinates.coords.z}}`);
                      }}
                    ></i>
                  </div>
                </div>
              </div>

              <div className="ped-data-info">
                <div className="ped-data-item">
                  <label>Rotation</label>
                  <div className="coordinate-value">
                    {`{"x": ${ped.coordinates.rotation.x}, "y": ${ped.coordinates.rotation.y}, "z": ${ped.coordinates.rotation.z}}`}
                    <i
                      className="fa-regular fa-copy copy-icon"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        copyToClipboard(`{"x": ${ped.coordinates.rotation.x}, "y": ${ped.coordinates.rotation.y}, "z": ${ped.coordinates.rotation.z}}`);
                      }}
                    ></i>
                  </div>
                </div>
              </div>

              <div className="prop-tools-model">
                <label>Animation</label>
                <input 
                  type="text" 
                  placeholder="Animation dict" 
                  onChange={(e) => handleAnimationChange(index, e.target.value, ped.animationClip)} 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                  }}
                />
                <input 
                  type="text" 
                  placeholder="Animation clip" 
                  onChange={(e) => handleAnimationChange(index, ped.animationDict, e.target.value)} 
                  onClick={(e) => e.stopPropagation()} 
                />
              </div>

              <div className="ped-spawner-buttons">
                <button onClick={(e) => { 
                  e.stopPropagation(); 
                  handleApplyChanges(ped); // Apply Changes
                }}>
                  Apply Changes
                </button>
                <button onClick={(e) => { 
                  e.stopPropagation(); 
                  showGizmo(ped); 
                }}>
                  Show Gizmo
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      
      <button id="create-ped" onClick={handleCreatePedClick}>
        Create New One
      </button>
    </div>
  );
}

export default PedSpawner;
