import React, { useState, useEffect } from "react";
import { fetchNui } from "../../utils/fetchNui";
import { useNuiEvent } from "../../hooks/useNuiEvent";
import "../Style/PedSpawner.css";
import InputForm from "../Elements/InputForm";
import pedIcon from "../assets/pedSpawner.svg";
import pedIcon2 from "../assets/pedSpawnColor.svg";
import trashIcon2 from "../assets/trashIcon2.svg";
import copyIcon from "../assets/copyIcon.svg";

function PedSpawner({ pedCoords }) {
  const [showInputForm, setShowInputForm] = useState(false);
  const [peds, setPeds] = useState(() => {
    const savedPeds = localStorage.getItem("peds");
    return savedPeds ? JSON.parse(savedPeds) : [];
  });

  useEffect(() => {
    localStorage.setItem("peds", JSON.stringify(peds));
  }, [peds]);

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
          dict: ped.animationDict,
          clip: ped.animationClip,
        },
      },
    });
  };

  const handleInputFormSubmit = (data) => {
    const newPed = {
      model: data.model,
      name: data.name,
      coordinates: data.position,
      animationDict: "",
      animationClip: "",
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
    fetchNui("showGizmo", data);
  };

  useEffect(() => {
    if (pedCoords) {
      const data = pedCoords;
      const updatedPeds = peds.map((ped) => {
        if (ped.model === data.model) {
          return {
            ...ped,
            coordinates: {
              coords: {
                x: data.position.x.toFixed(4),
                y: data.position.y.toFixed(4),
                z: data.position.z.toFixed(4),
              },
              entity: data.handle,
              rotation: {
                x: data.rotation.x.toFixed(4),
                y: data.rotation.y.toFixed(4),
                z: data.rotation.z.toFixed(4),
              },
            },
          };
        }
        return ped;
      });

      setPeds(updatedPeds);
    }
  }, [pedCoords]);

  const handleAnimationChange = (index, dict, clip) => {
    const updatedPeds = peds.map((ped, idx) => {
      if (idx === index) {
        return { ...ped, animationDict: dict, animationClip: clip };
      }
      return ped;
    });
    setPeds(updatedPeds);
  };

  return (
    <div className="ped-spawner">
      <div className="ped-spawner-header">
        <img src={pedIcon} alt="" />
        <h1>Ped Spawner</h1>
      </div>

      {showInputForm && (
        <div className="input-form-container">
          <InputForm onSubmit={handleInputFormSubmit} />
        </div>
      )}

      {peds.map((ped, index) => (
        <div
          key={index}
          className="data-ped-container"
          onClick={() => toggleCoordinateMenu(index)}
        >
          <div className="ped-spawner-header">
            <img src={pedIcon2} alt="" />
            <h1>{ped.name}</h1>
            <img
              className="pedTrash"
              src={trashIcon2}
              onClick={(e) => {
                e.stopPropagation();
                handleDeletePed(index);
              }}
              alt=""
            />
            <i
              className={`pedArrow fa-solid ${
                ped.isCoordinateOpen ? "fa-chevron-up" : "fa-chevron-down"
              }`}
            />
          </div>

          {ped.isCoordinateOpen && (
            <div className="ped-data-info">
              <div className="ped-data-item">
                <label>Model Id</label>
                <div className="modelDataValue">
                  <p>{ped.model}</p>
                </div>
              </div>

              <div className="ped-data-info">
                <div className="ped-data-item">
                  <label>Coordinates</label>
                  <div className="ped-data-value">
                    {`X: ${ped.coordinates.coords.x}, Y: ${ped.coordinates.coords.y}, Z: ${ped.coordinates.coords.z}`}

                    <img
                      src={copyIcon}
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(
                          `{"x": ${ped.coordinates.coords.x}, "y": ${ped.coordinates.coords.y}, "z": ${ped.coordinates.coords.z}}`
                        );
                      }}
                      alt=""
                    />
                  </div>
                </div>
              </div>

              <div className="ped-data-info">
                <div className="ped-data-item">
                  <label>Rotation</label>
                  <div className="rotation-ped-value">
                    <div className="rotation-value">
                      <div className="rotation">
                        <p>
                          {" "}
                          {`X: ${Math.floor(ped.coordinates.rotation.x)} °`}
                        </p>
                        <img
                          src={copyIcon}
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(
                              `{"x": ${Math.floor(
                                ped.coordinates.rotation.x
                              )}°, "y": ${Math.floor(
                                ped.coordinates.rotation.y
                              )}, "z": ${Math.floor(
                                ped.coordinates.rotation.z
                              )}}`
                            );
                          }}
                          alt=""
                        />
                      </div>
                      <div className="rotation">
                        <p>
                          {" "}
                          {`Y: ${Math.floor(ped.coordinates.rotation.y)} °`}
                        </p>
                        <img
                          src={copyIcon}
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(
                              `{"x": ${Math.floor(
                                ped.coordinates.rotation.x
                              )}°, "y": ${Math.floor(
                                ped.coordinates.rotation.y
                              )}, "z": ${Math.floor(
                                ped.coordinates.rotation.z
                              )}}`
                            );
                          }}
                          alt=""
                        />
                      </div>
                      <div className="rotation">
                        <p>
                          {" "}
                          {`Z: ${Math.floor(ped.coordinates.rotation.z)} °`}
                        </p>
                        <img
                          src={copyIcon}
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(
                              `{"x": ${Math.floor(
                                ped.coordinates.rotation.x
                              )}, "y": ${Math.floor(
                                ped.coordinates.rotation.y
                              )}, "z": ${Math.floor(
                                ped.coordinates.rotation.z
                              )}}`
                            );
                          }}
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="prop-tools-model-animation">
                <label className="animation-label">Animation</label>
                <input
                  type="text"
                  placeholder="Animation dict"
                  onChange={(e) =>
                    handleAnimationChange(
                      index,
                      e.target.value,
                      ped.animationClip
                    )
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                />
                <input
                  type="text"
                  placeholder="Animation clip"
                  onChange={(e) =>
                    handleAnimationChange(
                      index,
                      ped.animationDict,
                      e.target.value
                    )
                  }
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="ped-spawner-buttons">
                <button
                  className="apply-changes-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApplyChanges(ped);
                  }}
                >
                  <i class="iSaveJson fa-solid fa-floppy-disk"></i>Apply Changes
                </button>
                <button
                  className="show-gizmo-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    showGizmo(ped);
                  }}
                >
                  <i class="fa-solid fa-cube"></i>Show Gismo
                </button>
              </div>
              <div className="seperator"></div>
            </div>
          )}
        </div>
      ))}

      <button id="create-ped" onClick={handleCreatePedClick}>
        <i class="fa-solid fa-circle-plus crtPed"></i> Create New One
      </button>
    </div>
  );
}

export default PedSpawner;
