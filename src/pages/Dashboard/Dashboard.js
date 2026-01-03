import React, { useState, useEffect } from 'react';
import { FaQrcode } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import DashboardGrid from './DashboardGrid';
import QuickActions from '../../components/QuickActions';
import './Dashboard.css';
import { httpPost } from '../../services/http';
import {
    FaBullhorn, FaComments, FaCalendarAlt,
    FaInfoCircle, FaCalendar, FaGift,
    FaUser, FaUsers, FaChartLine, FaLightbulb
} from 'react-icons/fa';
import Card from '../../components/Card';
import ListItem from '../../components/ListItem';

import { useHeader } from '../../context/HeaderContext';

import QRScannerModal from '../../components/QRScannerModal';
const Dashboard = () => {
    const { setTitle, setDescription } = useHeader();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [checkinTime, setCheckinTime] = useState(null);
    const [notificationCount, setNotificationCount] = useState(5);
    const [checkinHistory, setCheckinHistory] = useState([]);

    // Estado para el modal QR y parámetro check
    const [showQRScanner, setShowQRScanner] = useState(false);
    const [checkParamValue, setCheckParamValue] = useState(null);

    const [announcements, setAnnouncements] = useState([
        {
            id: 1,
            icon: <FaInfoCircle />,
            title: 'Nueva Politica de Trabajo Remoto',
            meta: 'hoy • Dep. de Recursos Humanos',
            status: 'Nuevo',
            statusType: 'info'
        },
        {
            id: 2,
            icon: <FaCalendar />,
            title: 'Reunion Trimestral',
            meta: 'hace 2 dias • Management',
            status: null,
            statusType: 'info'
        },
        {
            id: 3,
            icon: <FaGift />,
            title: 'Actualizacion de Beneficios',
            meta: 'hace 3 dias • Equipo de Beneficios',
            status: null,
            statusType: 'info'
        }
    ]);

    const [messages, setMessages] = useState([
        {
            id: 1,
            icon: <FaUser />,
            title: 'Ana Robles',
            meta: 'Ya te envie las observaciones del webClient',
            status: 'Nuevo',
            statusType: 'danger',
            read: false
        },
        {
            id: 2,
            icon: <FaUser />,
            title: 'Laura Judith',
            meta: 'Tu solicitud de vacaciones ha sido aprobada',
            status: null,
            statusType: 'success',
            read: true
        },
        {
            id: 3,
            icon: <FaUser />,
            title: 'Manuel Guillen',
            meta: 'Te la rifas hijo mio!',
            status: null,
            statusType: 'success',
            read: true
        }
    ]);

    const [meetings, setMeetings] = useState([
        {
            id: 1,
            icon: <FaUsers />,
            title: 'Reunion diaria (Scrum)',
            meta: '10:00 AM • Conference Room A',
            status: 'Upcoming',
            statusType: 'success',
            time: '10:00'
        },
        {
            id: 2,
            icon: <FaChartLine />,
            title: 'El Mejor Pan (Avances)',
            meta: '2:30 PM • Zoom Meeting',
            status: 'In 1 hour',
            statusType: 'warning',
            time: '14:30'
        },
        {
            id: 3,
            icon: <FaLightbulb />,
            title: 'GN - App Asistencia',
            meta: '4:00 PM • Google Meet',
            status: 'Upcoming',
            statusType: 'success',
            time: '16:00'
        }
    ]);

    const handleMessageClick = (messageId) => {
        setMessages(messages.map(msg =>
            msg.id === messageId ? { ...msg, status: null, read: true } : msg
        ));
    };

    const updateMeetingStatuses = () => {
        const now = new Date();
        const updatedMeetings = meetings.map(meeting => {
            const [time, period] = meeting.time.split(' ');
            let hours = parseInt(time.split(':')[0]);
            const minutes = parseInt(time.split(':')[1]);

            if (period === 'PM' && hours < 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;

            const meetingTime = new Date();
            meetingTime.setHours(hours, minutes, 0, 0);

            const diffMs = meetingTime - now;
            const diffMins = Math.floor(diffMs / 60000);

            let status = 'Upcoming';
            let statusType = 'success';

            if (diffMins <= 0) {
                status = 'Started';
                statusType = 'info';
            } else if (diffMins <= 60) {
                status = `In ${diffMins} min`;
                statusType = 'warning';
            }

            return { ...meeting, status, statusType };
        });

        setMeetings(updatedMeetings);
    };

    useEffect(() => {
        setTitle("Dashboard");
        setDescription("Bienvenido al sistema");

        updateMeetingStatuses();
        const interval = setInterval(updateMeetingStatuses, 60000);
        return () => clearInterval(interval);
    }, []);

    /*
    // Función para obtener parámetros de la URL
    const getUrlParam = (param) => {
        if (typeof window === 'undefined') return null;
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    };

    // Efecto para verificar parámetro check al cargar
    useEffect(() => {
        const checkParam = getUrlParam('check');
        if (checkParam) {
            console.log(`✅ Parámetro "check" detectado: ${checkParam}`);
            setCheckParamValue(checkParam);

            // Abrir automáticamente el modal del scanner después de un breve delay
            // Esto permite que la UI se cargue completamente primero
            const timer = setTimeout(() => {
                console.log('🔓 Abriendo modal QR automáticamente...');
                setShowQRScanner(true);
            }, 500); // 500ms delay para asegurar que todo esté cargado

            return () => clearTimeout(timer);
        }
    }, []);
    */

    // Función para escanear QR cuando viene con parámetro check
    const handleQRScanWithCheck = (result) => {
        try {
            const qrData = JSON.parse(result);
            console.log('QR Data with check param:', qrData);

            // Agregar el parámetro check al objeto QR
            const enhancedQrData = {
                ...qrData,
                checkParam: checkParamValue
            };

            // Validar QR
            if (validateQRCode(enhancedQrData)) {
                setShowQRScanner(false);

                setTimeout(() => {
                    handleCheckIn(enhancedQrData);
                }, 500);

                showNotification('QR scanned successfully with check parameter!', 'success');
            } else {
                showNotification('Invalid QR code. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error parsing QR code:', error);
            showNotification('Invalid QR format. Please scan a valid code.', 'error');
        }
    };

    const validateQRCode = (qrData) => {
        // Validar que tenga los campos requeridos
        return qrData && qrData.type === 'checkin' && qrData.location;
    };

    const handleMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Función para manejar el check-in se cambia a header.js
    const handleCheckIn = async (qrData = null) => {
        if (!isCheckedIn) {
            // Check in
            const now = new Date();
            setIsCheckedIn(true);
            setCheckinTime(now);

            // Add to history
            const checkinRecord = {
                type: 'checkin',
                time: now,
                location: qrData?.location || 'Office',
                method: qrData ? 'QR Code' : 'Manual'
            };

            const check = {
                numero_empleado: qrData.numero_empleado || "1992115",
                nombre: qrData.nombre || "Sergio Cruz",
                id_apuntador: qrData.id_apuntador || "1",
                datetime: now,
                datetime_out: null,
                lat_e: qrData.lat_e || "19.427126",
                long_e: qrData.long_e || "-99.167222",
                lat_s: qrData.lat_s || "19.427126",
                long_s: qrData.long_s || "-99.167222",
            };

            const response = await httpPost('registroAsistencia.php', check);
            console.log(response);

            setCheckinHistory(prev => [checkinRecord, ...prev]);
            showNotification(`Successfully checked in at ${now.toLocaleTimeString()}`, 'success');

            // You would typically send this to your backend
            console.log('Check-in recorded:', checkinRecord);

            setCheckinHistory(prev => [checkinRecord, ...prev]);
            showNotification(`Successfully checked in at ${now.toLocaleTimeString()}`, 'success');

            // You would typically send this to your backend
            console.log('Check-in recorded:', checkinRecord);
        } else {
            // Check out
            const checkoutTime = new Date();
            const hoursWorked = checkinTime
                ? ((checkoutTime - checkinTime) / (1000 * 60 * 60)).toFixed(2)
                : 0;

            setIsCheckedIn(false);

            // Add checkout to history
            const checkoutRecord = {
                type: 'checkout',
                time: checkoutTime,
                hoursWorked: hoursWorked
            };

            setCheckinHistory(prev => [checkoutRecord, ...prev]);
            showNotification(`Checked out. Worked ${hoursWorked} hours today.`, 'info');

            // You would typically send this to your backend
            console.log('Check-out recorded:', checkoutRecord);
        }
    };

    const handleMessageRead = () => {
        setNotificationCount(prev => Math.max(0, prev - 1));
    };

    const showNotification = (message, type = 'info') => {
        // This is a simple notification system
        // In production, you might want to use a proper notification library
        console.log(`${type.toUpperCase()}: ${message}`);

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `app-notification notification-${type}`;
        notification.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideInUp 0.3s ease;
        max-width: 300px;
      ">
        ${message}
      </div>
    `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    };

    return (
        <div className="dashboard-container">

            <div className="dashboard-grid">
                <Card
                    title="Anuncios"
                    icon={<FaBullhorn />}
                    viewAllLink="#announcements"
                >
                    {announcements.map(item => (
                        <ListItem
                            key={item.id}
                            icon={item.icon}
                            title={item.title}
                            meta={item.meta}
                            status={item.status}
                            statusType={item.statusType}
                        />
                    ))}
                </Card>

                <Card
                    title="Mensajes recientes"
                    icon={<FaComments />}
                    viewAllLink="#messages"
                >
                    {messages.map(item => (
                        <ListItem
                            key={item.id}
                            icon={item.icon}
                            title={item.title}
                            meta={item.meta}
                            status={item.status}
                            statusType={item.statusType}
                            onClick={() => handleMessageClick(item.id)}
                        />
                    ))}
                </Card>

                <Card
                    title="Proximas reuniones"
                    icon={<FaCalendarAlt />}
                    viewAllLink="#calendar"
                >
                    {meetings.map(item => (
                        <ListItem
                            key={item.id}
                            icon={item.icon}
                            title={item.title}
                            meta={item.meta}
                            status={item.status}
                            statusType={item.statusType}
                        />
                    ))}
                </Card>
            </div>

            <QuickActions />

            {/* Check-in History (optional section) */}
            {checkinHistory.length > 0 && (
                <div className="card" style={{ marginTop: '1.5rem' }}>
                    <div className="card-header">
                        <h2 className="card-title">
                            <FaQrcode />
                            <span>Recent Check-ins</span>
                        </h2>
                    </div>
                    <div className="card-body">
                        {checkinHistory.slice(0, 3).map((record, index) => (
                            <div key={index} className="list-item">
                                <div className="item-icon">
                                    {record.type === 'checkin' ? '📱' : '🚪'}
                                </div>
                                <div className="item-content">
                                    <div className="item-title">
                                        {record.type === 'checkin' ? 'Checked In' : 'Checked Out'}
                                        {record.location && ` at ${record.location}`}
                                    </div>
                                    <div className="item-meta">
                                        {record.time.toLocaleTimeString()} • {record.method || 'Manual'}
                                        {record.hoursWorked && ` • ${record.hoursWorked} hours`}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}




            {/* QR Scanner Modal */}
            <QRScannerModal
                isOpen={showQRScanner}
                onClose={() => {
                    setShowQRScanner(false);
                    // Opcional: limpiar parámetro de la URL después de cerrar
                    if (checkParamValue && window.history.replaceState) {
                        const newUrl = window.location.pathname;
                        window.history.replaceState({}, document.title, newUrl);
                    }
                }}
                onScanSuccess={handleQRScanWithCheck}
                onScanError={(error) => {
                    console.error('Scanner error:', error);
                    showNotification('Scanner error. Please try again.', 'error');
                }}
            />
        </div>
    );
};

export default Dashboard;