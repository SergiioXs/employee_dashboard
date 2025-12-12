import React from 'react';

const StatusBadge = ({ type = 'info', text, className = '' }) => {
    return (
        <span className={`status-badge status-${type} ${className}`}>
            {text}
        </span>
    );
};

export default StatusBadge;