import React, { useState, useEffect } from "react";
import "../Style/Worldeditor.css";
import { fetchNui } from "../../utils/fetchNui";
import eyeIcon from "../assets/eyeIcon.svg";
import editIcon from "../assets/editIcon.svg";
import trashIcon from "../assets/trash.svg";
import copyIcon from "../assets/copyIcon.svg";
import eyeIcon2 from "../assets/eyeIcon2.svg";
import eidtIcon2 from "../assets/editIcon2.svg";
import trashIcon2 from "../assets/trashIcon2.svg";
import world2 from "../assets/world2.svg";
import json from '../assets/save.svg'

function WorldEditor({ presetData, updateObject }) {
  const [presets, setPresets] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPreset, setCurrentPreset] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [propModel, setPropModel] = useState("prop_mp_cone_02");
  const [objects, setObjects] = useState([]);

  useEffect(() => {
    const presetArray = Object.entries(presetData).map(([key, value]) => ({
      id: key,
      ...value,
    }));
    setPresets(presetArray);
  }, [presetData]);

  useEffect(() => {}, [presets]);

  const addNewPreset = () => {
    const newPreset = {
      id: presets.length + 1,
      name: `Preset ${presets.length + 1}`,
    };
    setPresets([...presets, newPreset]);
    fetchNui("addPreset", newPreset);
  };

  const handleEdit = (preset) => {
    fetchNui("getdataJson", preset.id).then((data) => {
      setObjects(data || []);
    });
    setCurrentPreset(preset);
    setEditingName(preset.name);
    setIsEditing(true);
  };

  const addObject = () => {
    const newObject = {
      id: objects.length + 1,
      name: propModel,
    };
    setObjects([...objects, newObject]);
  };

  const deletePreset = (id) => {
    setPresets(presets.filter((preset) => preset.id !== id));
    fetchNui("deletePreset", id);
  };

  const deleteObject = (id, entity) => {
    const ObjectList = objects.filter((obj) => {
      console.log("Object ID:", obj.id);
      console.log("Deleting ID:", id);
      return obj.entity !== entity || obj.id !== id;
    });
    setObjects(ObjectList);
    fetchNui("deleteObject", {
      presetId: currentPreset.id,
      objectId: id,
      entity: entity,
      objects: objects,
    });
  };

  const scrollToHeader = () => {
    document
      .querySelector(".World-Editor-header")
      .scrollIntoView({ behavior: "smooth" });
  };

  const setObject = (prop, id) => {
    if (currentPreset) {
      fetchNui("setObject", {
        presetId: currentPreset.id,
        propModel: prop,
        objectId: id,
      });
    } else {
      console.error("No preset selected!");
    }
  };

  const copyToClipboard = (obj) => {
    fetchNui("setClipboard", {
      entity: obj,
      objects: objects,
      presetId: currentPreset.id,
    });
  };

  const saveDataObject = () => {
    if (currentPreset) {
      fetchNui("saveDataObject", {
        object: objects,
        id: objects.length,
        preset: currentPreset,
        dataObjects: updateObject,
      });
    } else {
      console.error("No preset selected!");
    }
  };

  const eyeToCoords = (obj) => {
    fetchNui("eyeToCoords", {
      entity: obj,
      presetId: currentPreset.id,
    });
  };

  return (
    <div className="World-Editor">
      <div className="World-Editor-header" onClick={scrollToHeader}>
        {!isEditing && <img src={world2} alt="" />}
        <h1 style={{ marginLeft: isEditing ? "1.7rem" : "1rem" }}>
          {isEditing ? `Editing ${editingName}` : "World Editor"}
        </h1>
      </div>
      {!isEditing ? (
        <>
          <div className="data-world">
            {presets.map((preset) => (
              <div className="card" key={preset.id}>
                <h1>{preset.name}</h1>
                <div className="card-icon">
                  <img src={eyeIcon} alt="" />
                  <img
                    src={editIcon}
                    onClick={() => handleEdit(preset)}
                    alt=""
                  />
                  <img
                    src={trashIcon}
                    onClick={() => deletePreset(preset.id)}
                    alt=""
                  />
                </div>
              </div>
            ))}
          </div>
          <button className="create-preset" onClick={addNewPreset}>
            <i class="fa-solid fa-circle-plus"></i> Create new preset
          </button>
        </>
      ) : (
        <div className="edit-container">
          <div className="CardEdit">
            <input
              type="text"
              placeholder="prop_mp_cone_02"
              onChange={(e) => setPropModel(e.target.value)}
            />
            <i
              className="plusEdit fa-solid fa-circle-plus"
              onClick={addObject}
            ></i>
          </div>
          <div className="seperator"></div>
          <div className="cardEdit edit-title">
            <h1>Object list</h1>
          </div>
          <div className="edit-card-container">
            {objects.map((obj) => (
              <div className="edit-card" key={obj.objectId || obj.id}>
                <h1>{obj.name || obj.propModel}</h1>
                <div className="edit-card-icon">
                  <img
                    src={copyIcon}
                    onClick={() => copyToClipboard(obj.entity)}
                    alt=""
                  />
                  <img
                    onClick={() => eyeToCoords(obj.entity)}
                    src={eyeIcon2}
                    alt=""
                  />
                  <img
                    src={eidtIcon2}
                    onClick={() =>
                      setObject(
                        obj.name || obj.propModel,
                        obj.id || obj.objectId
                      )
                    }
                    alt=""
                  />
                  <img
                    src={trashIcon2}
                    onClick={() => deleteObject(obj.id, obj.entity)}
                    alt=""
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="editor-btn">
            <button className="saveJson" onClick={saveDataObject}>
              <img src={json} alt="" />Save Json
            </button>
            <button className="cancel" onClick={() => setIsEditing(false)}>
              <i class="fa-solid fa-circle-xmark"></i>Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorldEditor;
