import React, { useState } from 'react';
import '../Style/InputForm.css';
import { fetchNui } from '../../utils/fetchNui';

function InputForm({ onSubmit }) {  
    const [formData, setFormData] = useState({
        name: 'Elzein',
        model: 'mp_m_freemode_01'
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchNui('addPedData', formData).then((response) => {
            onSubmit(response); 
        }); 
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={formData.name}
                        required 
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="model">Model</label>
                    <input
                        type="text"
                        id="model"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        placeholder={formData.model}
                        required 
                    />
                </div>
                <button type="submit">Add New Ped</button>
            </form>
        </div>
    );
}

export default InputForm;
