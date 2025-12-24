import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearSession } from '../services/session';
import {
    FaBriefcase, FaHome, FaCalendarAlt, FaBullhorn,
    FaComments, FaClock, FaUmbrellaBeach, FaFileSignature,
    FaCreditCard, FaGift, FaCalendarDay, FaUser, FaSignOutAlt
} from 'react-icons/fa';
import StatusBadge from './StatusBadge';
import '../styles/sidebar.css';
import logo from '../assets/logo_blanco.png';

/* PAGES */
import Attendance from '../pages/Attendance/Attendance';

const navItems = [
    { id: 1, icon: <FaHome />, label: 'Dashboard', active: true, route: '/' },
    { id: 2, icon: <FaCalendarAlt />, label: 'Reuniones' },
    { id: 3, icon: <FaBullhorn />, label: 'Anuncios' },
    { id: 4, icon: <FaComments />, label: 'Mensajes', badge: 3, badgeType: 'danger' },
    { id: 5, icon: <FaClock />, label: 'Checadas', route: '/attendance' },
    { id: 6, icon: <FaUmbrellaBeach />, label: 'Vacaciones' },
    { id: 7, icon: <FaFileSignature />, label: 'Permisos' },
    { id: 8, icon: <FaCreditCard />, label: 'Pagos' },
    { id: 9, icon: <FaGift />, label: 'Beneficios' },
    { id: 10, icon: <FaCalendarDay />, label: 'Eventos' },
    { id: 11, icon: <FaSignOutAlt />, label: 'Cerrar Sesión' },
];

const Sidebar = ({ isMobileOpen, onClose }) => {
    const [activeItem, setActiveItem] = useState(1);
    const navigate = useNavigate();

    const handleNavClick = (id) => {

        if (id === 11) {
            clearSession();
            navigate('/login', { replace: true });
            return;
        }

        setActiveItem(id);
        if (navItems[id - 1].route) {
            navigate(navItems[id - 1].route, { replace: true });
        }

        if (window.innerWidth <= 768) {
            onClose();
        }
    };

    return (
        <>
            <nav className={`sidebar ${isMobileOpen ? 'active' : ''}`}>
                <div className="sidebar-header">
                    <a href="#" className="company-logo">
                        <img src={logo} style={{ width: '80%' }} alt="Logo" />
                    </a>
                </div>

                <div className="nav-menu">
                    {navItems.map((item) => (
                        <a
                            key={item.id}
                            href="#"
                            className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
                            onClick={() => handleNavClick(item.id)}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                            {item.badge && (
                                <StatusBadge type={item.badgeType} text={item.badge} />
                            )}
                        </a>
                    ))}
                </div>

                <div className="user-profile">
                    <div className="user-avatar">
                        <FaUser />
                    </div>
                    <div className="user-info">
                        <h4>Sergio Cruz</h4>
                        <p>Software Engineer</p>
                    </div>
                </div>
            </nav>

            {isMobileOpen && (
                <div className="sidebar-overlay" onClick={onClose} />
            )}
        </>
    );
};

export default Sidebar;