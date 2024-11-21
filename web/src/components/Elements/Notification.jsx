import React, { useEffect, useState } from 'react';
import '../Style/Notification.css';

const Notification = ({ message, onClose, duration = 3500 }) => {
    const [isHiding, setIsHiding] = useState(false);

    useEffect(() => {
        const hideTimeout = setTimeout(() => setIsHiding(true), duration - 500); 
        const closeTimeout = setTimeout(onClose, duration);

        return () => {
            clearTimeout(hideTimeout);
            clearTimeout(closeTimeout);
        };
    }, [onClose, duration]);

    return (
        <div className={`notification ${isHiding ? 'hide' : ''}`}>
            <span>{message}</span>
            <button onClick={onClose} className="close-button">✖</button>
        </div>
    );
};

export default Notification;
