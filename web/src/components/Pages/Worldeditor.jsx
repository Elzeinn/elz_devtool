import React, { useState, useEffect } from 'react';
import '../Style/Worldeditor.css';
import { fetchNui } from '../../utils/fetchNui';
import { useNuiEvent } from '../../hooks/useNuiEvent';


function WorldEditor({ presetData, updateObject}) {
    const [presets, setPresets] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPreset, setCurrentPreset] = useState(null);
    const [editingName, setEditingName] = useState(''); 
    const [propModel, setPropModel] = useState('prop_mp_cone_02');
    const [objects, setObjects] = useState([]);
    
    useEffect(() => {
    const presetArray = Object.entries(presetData).map(([key, value]) => ({
        id: key, 
        ...value
    }));
    setPresets(presetArray);
    }, [presetData]);
 
    const addNewPreset = () => {
        const newPreset = {
            id: presets.length + 1,
            name: `Preset ${presets.length + 1}`
        };
        setPresets([...presets, newPreset]);
        fetchNui('addPreset', newPreset);
    };

    const handleEdit = (preset) => {
        setObjects([]);

        fetchNui('getdataJson', preset.id).then((data) => {
           
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
        setPresets(presets.filter(preset => preset.id !== id));
        fetchNui('deletePreset', id);
    };

    const deleteObject = (id) => {
        setObjects(objects.filter(obj => obj.id !== id));
         fetchNui('deleteObject', {presetId: currentPreset.id, objectId: id, entity : updateObject} )
    };


    const scrollToHeader = () => {
        document.querySelector('.World-Editor-header').scrollIntoView({ behavior: 'smooth' });
    };

    const setObject = (prop, id) => {
        if (currentPreset) {
            fetchNui('setObject', {
                propModel: prop,
                objectId: id,
            });
        } else {
            console.error('No preset selected!');
        }
    };

    const copyToClipboard = (obj) => {
        fetchNui('setClipboard', obj);
    };

    const copyObject = (obj) => {
        const newObject = {
            id: objects.length + 1, 
            name: `${obj.name}`, 
            propModel: obj.propModel,
            // position: { ...obj.position },
            // rotation: { ...obj.rotation },
            updateObject: updateObject,
        };
        setObjects([...objects, newObject]); 
        // fetchNui('saveCopiedObject', { presetId: currentPreset.id, newObject })
    };

    const saveDataObject = () => {
        if (currentPreset) {
            fetchNui('saveDataObject', { 
                 object : objects,
                 id: objects.length + 1,
                 preset : currentPreset,
                 dataObjects : updateObject
         });
        } else {
            console.error('No preset selected!');
        }
    };

    return (
        <div className="World-Editor">
            <div className="World-Editor-header" onClick={scrollToHeader}>
                <i className="worldeditorPrimary fa-solid fa-globe"></i>
                <h1>{isEditing ? `Editing ${editingName}` : 'World Editor'}</h1> 
            </div>
            {!isEditing ? (
                <>
                    <div className="data-world">
                        {presets.map((preset) => (
                            <div className="card" key={preset.id}>
                                <h1>{preset.name}</h1>
                                <div className="card-icon">
                                    <i className="fa-solid fa-pen" onClick={() => handleEdit(preset)}></i>
                                    <i className="fa-solid fa-trash" onClick={() => deletePreset(preset.id)}></i>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="create-preset" onClick={addNewPreset}>
                        Create New Preset
                    </button>
                </>
            ) : (
                <div className="edit-container">
                    <div className="card CardEdit">
                        <input type="text"
                            placeholder='prop_mp_cone_02'
                            onChange={(e) => setPropModel(e.target.value)}
                        />
                    </div>
                    <div className="seperator"></div>
                    <div className="card cardEdit edit-title">
                        <h1>Object list</h1>
                        <i className="fa-solid fa-circle-plus" onClick={addObject}></i>
                    </div>
                    <div className="edit-card-container">
                        {objects.map((obj) => (
                            <div className="edit-card" key={obj.id}>
                                <h1>{obj.propModel || 'prop_mp_cone_02'}</h1>
                                <div className="edit-card-icon">
                                    <i className="fa-solid fa-clipboard" onClick={() => copyToClipboard(obj)}></i>
                                    <i className="fa-solid fa-copy" onClick={() => copyObject(obj)}></i>
                                    <i className="fa-solid fa-eye"></i>
                                    <i className="fa-solid fa-cube" onClick={() => setObject(obj.propModel || 'prop_mp_cone_02', obj.id)}></i>
                                    <i className="fa-solid fa-trash" onClick={() => deleteObject(obj.id)}></i>
                                </div>
                            </div>
                        ))}

                    </div>
                     <div className="editor-btn">
                        <button onClick={saveDataObject}>Save JSON</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                     </div>
                </div>
            )}
        </div>
    );
}

export default WorldEditor;
