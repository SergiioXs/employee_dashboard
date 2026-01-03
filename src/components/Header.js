import React, { useState, useEffect } from 'react';
import { FaBars, FaBell, FaSignInAlt, FaSignOutAlt, FaQrcode } from 'react-icons/fa';
import QRScannerModal from './QRScannerModal';
import StatusBadge from './StatusBadge';
import '../styles/header.css';
import { httpPost } from '../services/http';
import { getCurrentLocation } from "../services/geolocation";
import { useHeader } from '../context/HeaderContext';

const Header = ({ onMenuClick }) => {
    const { title, description, setTitle, setDescription } = useHeader();
    const [notificationCount, setNotificationCount] = useState(5);
    const [showQRScanner, setShowQRScanner] = useState(false);
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [checkinTime, setCheckinTime] = useState(null);
    const [checkinHistory, setCheckinHistory] = useState([]);
    const [checkParamValue, setCheckParamValue] = useState(null);

    // Función para obtener parámetros de la URL
    const getUrlParam = (param) => {
        if (typeof window === 'undefined') return null;
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    };

    // Efecto para verificar parámetro check al cargar
    useEffect(() => {

        setTitle("Dashboard");
        setDescription("Bienvenido al sistema");

        const checkParam = getUrlParam('check');
        if (checkParam) {
            console.log(`✅ Parámetro "check" detectado: ${checkParam}`);
            setCheckParamValue(checkParam);

            // Abrir automáticamente el modal del scanner después de un breve delay
            // Esto permite que la UI se cargue completamente primero
            const timer = setTimeout(() => {
                console.log('🔓 Abriendo modal QR automáticamente...');
                handleCheckInClick();
            }, 500); // 500ms delay para asegurar que todo esté cargado

            return () => clearTimeout(timer);
        }
    }, []);

    const getFormattedDateTime = () => {
        const now = new Date(); // Gets the current date and time

        // Helper function to add leading zeros to single digits
        const pad = (num) => num.toString().padStart(2, '0');

        const year = now.getFullYear();
        const month = pad(now.getMonth() + 1); // Months are 0-indexed
        const day = pad(now.getDate());
        const hours = pad(now.getHours());
        const minutes = pad(now.getMinutes());
        const seconds = pad(now.getSeconds());

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleNotificationClick = () => {
        setNotificationCount(0);
    };

    const handleCheckInClick = async () => {
        const currentLocation = await getCurrentLocation();


        if (!currentLocation.status) {
            showNotification(currentLocation.message, 'error');
            return;
        }
        console.log(currentLocation);
        if (!isCheckedIn) {
            // Show QR scanner modal for check-in
            setShowQRScanner(true);
        } else {
            // Direct check-out
            handleCheckIn();
        }
    };

    const handleQRScanSuccess = (result) => {
        console.log('QR Scan Result:', result);

        // Parse QR code data (assuming it contains location/employee info)
        try {
            const qrData = JSON.parse(result);
            console.log('Parsed QR Data:', qrData);

            // Here you would typically validate the QR code
            // and send the data to your backend

            // For demo purposes, simulate a successful check-in
            const isValidQR = validateQRCode(qrData);

            if (isValidQR) {
                // Close QR scanner
                //setShowQRScanner(false);

                // Trigger check-in
                setTimeout(() => {
                    handleCheckIn(qrData); // Pass QR data to check-in
                    showNotification('QR scanned successfully! Checked in.', 'success');
                }, 500);
            } else {
                showNotification('Invalid QR code. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error parsing QR code:', error);
            showNotification('Invalid QR format. Please scan a valid code.', 'error');
        }
    };

    const handleQRScanError = (error) => {
        console.error('QR Scan Error:', error);
        showNotification('Scanner error. Please try again.', 'error');
    };

    const handleCheckIn = async (qrData = null) => {
        if (!isCheckedIn) {
            // Check in
            const now = new Date();
            setIsCheckedIn(true);
            setCheckinTime(now);

            // Add to history
            const checkinRecord = {
                type: 'checkin',
                time: getFormattedDateTime(),
                location: qrData?.location || 'Office',
                method: qrData ? 'QR Code' : 'Manual'
            };

            const check = {
                numero_empleado: qrData.numero_empleado || "1992115",
                nombre: qrData.nombre || "Sergio Cruz",
                id_apuntador: qrData.id_apuntador || "1",
                datetime: getFormattedDateTime(),
                event_type: "Entrada",
                datetime_out: null,
                lat_entrada: qrData.lat_e || "19.427126",
                long_entrada: qrData.long_e || "-99.167222",
                lat_salida: qrData.lat_s || "19.427126",
                long_salida: qrData.long_s || "-99.167222",
            };

            const response = await httpPost('registroAsistencia.php', check);
            console.log(response);

            setCheckinHistory(prev => [checkinRecord, ...prev]);
            showNotification(`Haz check-in a las ${now.toLocaleTimeString()}`, 'success');


            // You would typically send this to your backend
            console.log('Check-in recorded:', checkinRecord);

            /*
            setCheckinHistory(prev => [checkinRecord, ...prev]);
            showNotification(`Successfully checked in at ${now.toLocaleTimeString()}`, 'success');

            // You would typically send this to your backend
            console.log('Check-in recorded:', checkinRecord);
            */
        } else {
            // Check out
            const checkoutTime = new Date();
            const hoursWorked = checkinTime
                ? ((checkoutTime - checkinTime) / (1000 * 60 * 60)).toFixed(2)
                : 0;

            const check = {
                numero_empleado: "1992115",
                nombre: "Sergio Cruz",
                id_apuntador: "1",
                event_type: "Salida",
                datetime: getFormattedDateTime(),
                datetime_out: null,
                lat_entrada: "19.427126",
                long_entrada: "-99.167222",
            };

            const response = await httpPost('registroAsistencia.php', check);
            console.log(response);

            setIsCheckedIn(false);

            // Add checkout to history
            const checkoutRecord = {
                type: 'checkout',
                time: checkoutTime,
                hoursWorked: hoursWorked
            };

            setCheckinHistory(prev => [checkoutRecord, ...prev]);
            showNotification(`Haz checado salida, ${hoursWorked} horas trabajadas.`, 'info');


            // You would typically send this to your backend
            console.log('Check-out recorded:', checkoutRecord);
        }
    };





    const validateQRCode = (qrData) => {
        // Implement your QR validation logic here
        // For demo, accept any QR with required fields

        return true;

        //return qrData && qrData.type === 'checkin' && qrData.location;
    };

    const showNotification = (message, type = 'info') => {
        // Create a temporary notification element
        const notification = document.createElement('div');
        notification.className = `qr-notification qr-notification-${type}`;
        notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10001;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        animation: slideIn 0.3s ease;
        max-width: 300px;
      ">
        ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
        <span>${message}</span>
      </div>
    `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    };

    const formatTime = (date) => {
        if (!date) return '';
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            <header className="header">
                <div className="page-title">
                    <h1>{title}</h1>
                    <p>{description}</p>
                </div>

                <div className="header-actions">
                    <button className="mobile-menu-btn" onClick={onMenuClick}>
                        <FaBars />
                    </button>

                    <button className="notification-btn" onClick={handleNotificationClick}>
                        <FaBell />
                        {notificationCount > 0 && (
                            <span className="notification-count">{notificationCount}</span>
                        )}
                    </button>

                    <StatusBadge
                        type={isCheckedIn ? 'success' : 'danger'}
                        text={isCheckedIn ? `Checked In ${checkinTime ? formatTime(checkinTime) : ''}` : 'No haz checado'}
                    />

                    <button
                        className={`checkin-btn ${isCheckedIn ? 'checked-in' : ''}`}
                        onClick={handleCheckInClick}
                    >
                        {isCheckedIn ? (
                            <>
                                <FaSignOutAlt />
                                <span>Checar salida</span>
                            </>
                        ) : (
                            <>
                                <FaQrcode />
                                <span>Checar entrada</span>
                            </>
                        )}
                    </button>
                </div>
            </header>

            <QRScannerModal
                isOpen={showQRScanner}
                onClose={() => setShowQRScanner(false)}
                onScanSuccess={handleQRScanSuccess}
                onScanError={handleQRScanError}
            />
        </>
    );
};

export default Header;