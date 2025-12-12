import React from 'react';
import StatusBadge from './StatusBadge';

const ListItem = ({
    icon,
    title,
    meta,
    status,
    statusType,
    onClick,
    className = ''
}) => {
    return (
        <div className={`list-item ${className}`} onClick={onClick}>
            <div className="item-icon">
                {icon}
            </div>
            <div className="item-content">
                <div className="item-title">{title}</div>
                <div className="item-meta">{meta}</div>
            </div>
            {status && (
                <StatusBadge type={statusType} text={status} />
            )}
        </div>
    );
};

export default ListItem;