import React, { useRef, useState } from 'react';
import { QrScanner } from '@yudiel/react-qr-scanner';
import FaceDetector from "../components/FaceDetector";
import { FaTimes, FaCamera, FaQrcode } from 'react-icons/fa';
import '../styles/qrScanner.css';

const QRScannerModal = ({ isOpen, onClose, onScanSuccess, onScanError }) => {
    const [cameraError, setCameraError] = useState(null);
    const [selectedCamera, setSelectedCamera] = useState('environment');
    const [devices, setDevices] = useState([]);
    const [step, setStep] = useState(0);

    const handleScan = (result) => {
        if (result) {
            const result = JSON.stringify({
                type: 'checkin',
                location: 'Office A1',
                employeeId: 'EMP123',
                timestamp: '2024-01-15T09:00:00Z'
            });
            console.log('QR Code scanned:', result);

            setStep(1);
        }
    };

    const handleOnClose = () => {
        onClose();
    };

    const handleError = (error) => {
        console.error('QR Scanner error:', error);
        setCameraError(error.message);
        onScanError(error);
    };

    const handleCameraChange = (event) => {
        setSelectedCamera(event.target.value);
    };

    const handleDevices = (mediaDevices) => {
        const videoDevices = mediaDevices.filter(({ kind }) => kind === 'videoinput');
        setDevices(videoDevices);
    };

    const handleRetryCamera = () => {
        setCameraError(null);
    };

    const handleFaceScanSuccess = (employeeId) => {
        console.log('Employee ID scanned:', employeeId);
        onScanSuccess(JSON.stringify({
            type: 'checkin',
            location: 'Office A1',
            employeeId: 'EMP123',
            timestamp: '2024-01-15T09:00:00Z'
        }));
        onClose();
    };

    const handleFaceScanError = (error) => {
        console.error('Face detection error:', error);
        onScanError(error);
    };

    if (!isOpen) return null;

    return (
        <div className="qr-modal-overlay">
            <div className="qr-modal">
                <div className="qr-modal-header">
                    <h3>
                        Registro de asistencia
                    </h3>
                    <button className="close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="qr-scanner-container">
                    {cameraError ? (
                        <div className="camera-error">
                            <div className="error-icon">📷</div>
                            <h4>Camera Error</h4>
                            <p>{cameraError}</p>
                            <button className="retry-btn" onClick={handleRetryCamera}>
                                Retry Camera
                            </button>
                            <div className="manual-fallback">
                                <p>Or enter code manually:</p>
                                <input
                                    type="text"
                                    placeholder="Enter QR code manually"
                                    className="manual-input"
                                />
                                <button className="submit-btn">
                                    Submit
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="scanner-wrapper">
                                <FaceDetector
                                    onScanSuccess={handleFaceScanSuccess}
                                    onScanError={handleFaceScanError}
                                />

                                {/*
                                {step === 1 && (
                                    <FaceDetector
                                        onScanSuccess={handleFaceScanSuccess}
                                        onScanError={handleFaceScanError}
                                    />
                                )}
                                {step === 0 && (
                                    <QrScanner
                                        onDecode={handleScan}
                                        onError={handleError}
                                        constraints={{
                                            facingMode: selectedCamera,
                                        }}
                                        scanDelay={500}
                                        className="qr-scanner"
                                    />
                                )}
                                */}
                                {/* 
                                
                                
                                <QrScanner
                                    onDecode={handleScan}
                                    onError={handleError}
                                    constraints={{
                                        facingMode: selectedCamera,
                                    }}
                                    scanDelay={500}
                                    className="qr-scanner"
                                />
                                */}
                            </div>

                            {devices.length > 1 && (
                                <div className="camera-selector">
                                    <label htmlFor="camera-select">
                                        <FaCamera /> Select Camera:
                                    </label>
                                    <select
                                        id="camera-select"
                                        value={selectedCamera}
                                        onChange={handleCameraChange}
                                    >
                                        <option value="environment">Back Camera</option>
                                        <option value="user">Front Camera</option>
                                    </select>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="qr-modal-footer">
                    <p className="instructions">
                        {step === 0 ? 'Posiciona el QR dentro del frame para escanear' : 'Posiciona tu rostro de frente para escanear'}
                    </p>
                    <div className="modal-actions">
                        <button className="secondary-btn" onClick={onClose}>
                            Cancelar
                        </button>
                        <button className="flash-btn" onClick={handleScan}>
                            Ativar Flash
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRScannerModal;