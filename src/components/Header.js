import React, { useState } from 'react';
import { FaBars, FaBell, FaSignInAlt, FaSignOutAlt, FaQrcode } from 'react-icons/fa';
import QRScannerModal from './QRScannerModal';
import StatusBadge from './StatusBadge';
import '../styles/header.css';

const Header = ({ onMenuClick, onCheckIn, isCheckedIn, checkinTime }) => {
    const [notificationCount, setNotificationCount] = useState(5);
    const [showQRScanner, setShowQRScanner] = useState(false);

    const handleNotificationClick = () => {
        setNotificationCount(0);
    };

    const handleCheckInClick = () => {
        if (!isCheckedIn) {
            // Show QR scanner modal for check-in
            setShowQRScanner(true);
        } else {
            // Direct check-out
            onCheckIn();
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
                    onCheckIn(qrData); // Pass QR data to check-in
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
                    <h1>Mi Dashboard</h1>
                    <p>Bienvenido Sergio Antonio! Aquí está lo que está sucediendo hoy.</p>
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