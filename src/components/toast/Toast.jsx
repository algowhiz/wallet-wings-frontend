import React from 'react';
import './Toast.css';

const Toast = ({ message, description, onClose, color }) => {
    const toastStyles = {
        backgroundColor: color === 'green' ? '#4CAF50' : color === 'red' ? '#f44336' : '#333',
        // You can add more colors as needed
    };

    return (
        <div className="toast" style={toastStyles}>
            <div className="toast-content">
                <button className="close-btn" onClick={onClose}>×</button>
                <p className="toast-message">{message}</p>
                <p className="toast-description">{description}</p>
            </div>
        </div>
    );
};

export default Toast;
