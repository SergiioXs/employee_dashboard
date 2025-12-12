import React from 'react';
import {
    FaUmbrellaBeach, FaFileSignature, FaCreditCard,
    FaCalendarDay, FaGift, FaClock,
    FaFileDownload, FaCog, FaBolt
} from 'react-icons/fa';
import Card from './Card';
import '../styles/quickactions.css';

const quickActions = [
    { id: 1, icon: <FaUmbrellaBeach />, label: 'Pedir vacaciones' },
    { id: 2, icon: <FaFileSignature />, label: 'Pedir permiso' },
    { id: 3, icon: <FaCreditCard />, label: 'Pagos' },
    { id: 4, icon: <FaCalendarDay />, label: 'Crear eventos' },
    { id: 5, icon: <FaCalendarDay />, label: 'Agendar reunión' },
    { id: 6, icon: <FaFileDownload />, label: 'Documentos' },
    { id: 7, icon: <FaCog />, label: 'Configuración' },
];

const QuickActions = () => {
    const handleActionClick = (actionId) => {
        console.log(`Action clicked: ${actionId}`);
        // Implement navigation or modal opening here
    };

    return (
        <Card
            title="Acciones rapidas"
            icon={<FaBolt />}
            className="quick-actions-card"
        >
            <div className="quick-actions-grid">
                {quickActions.map(action => (
                    <button
                        key={action.id}
                        className="action-btn"
                        onClick={() => handleActionClick(action.id)}
                    >
                        {action.icon}
                        <span>{action.label}</span>
                    </button>
                ))}
            </div>
        </Card>
    );
};

export default QuickActions;