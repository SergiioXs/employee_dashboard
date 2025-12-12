import React from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';

const Card = ({ title, icon, viewAllLink, children, className = '' }) => {
    return (
        <div className={`card ${className}`}>
            <div className="card-header">
                <h2 className="card-title">
                    {icon}
                    <span>{title}</span>
                </h2>
                {viewAllLink && (
                    <a href={viewAllLink} className="view-all">
                        Ver mas...
                    </a>
                )}
            </div>
            <div className="card-body">
                {children}
            </div>
        </div>
    );
};

export default Card;