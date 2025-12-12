import React, { createElement, useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import '../styles/facedetector.css';

function FaceDetector({ onScanSuccess, onScanError }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const ctx = useRef(null);
    const [distance, setDistance] = useState(0.5);
    const [checked, setChecked] = useState(false);

    const detectionIntervalRef = useRef(null);
    const streamRef = useRef(null);

    const [knownFaces, setKnownFaces] = useState(new Map());
    const faceMatcherRef = useRef(null);
    const [faceMatcher, setFaceMatcher] = useState(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [loadingError, setLoadingError] = useState(null);
    const [loadingProgress, setLoadingProgress] = useState(0);

    let contador = 0;

    const initializeApp = async () => {
        contador++;
        console.log('Inicializando aplicacion... ' + contador);

        // Cargar rostros guardados
        await loadSavedFaces();

        // Cargar modelos de face-api.js

        await loadModels();

        await startVideo();

        console.log('Aplicación inicializada');
    }

    const loadModels = async () => {
        try {
            console.log("Loading face detection models...");
            setLoadingProgress(50);
            // Create an array of model loading promises
            const modelPromises = [
                faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
                faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
                faceapi.nets.faceRecognitionNet.loadFromUri("/models")
            ];

            // Wait for all models to load
            await Promise.all(modelPromises);

            setLoadingProgress(75);

            await updateFaceMatcher();
            console.log("✅ All models loaded successfully");

        } catch (error) {
            console.error("❌ Failed to load models:", error);
            setLoadingError(error.message);
        }
    };

    const startVideo = async () => {
        console.log("Starting video...");
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {

                console.log("Video started");
                videoRef.current.srcObject = stream;
                streamRef.current = stream;

                videoRef.current.onloadedmetadata = () => {
                    setLoadingProgress(100);
                    console.log("Video metadata loaded");
                    videoRef.current.play();
                    runDetection();
                };
            })
            .catch(err => console.error("Camera error:", err));
    };

    const stopVideo = () => {
        try {
            // ❌ Stop face detection loop
            if (detectionIntervalRef.current) {
                clearInterval(detectionIntervalRef.current);
                detectionIntervalRef.current = null;
            }

            // ❌ Stop camera tracks
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
            }

            // Remove video source
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }

            console.log("FaceDetector: Video and detection stopped");
        } catch (err) {
            console.error("Error stopping video:", err);
        }
    };

    const runDetection = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        ctx.current = canvas.getContext('2d');

        console.log("Running detection...");

        detectionIntervalRef.current = setInterval(async () => {

            if (!video || video.readyState !== 4) return;

            const detections = await faceapi
                .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptors();

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            if (!modelsLoaded) {
                setModelsLoaded(true);
            }

            ctx.current.clearRect(0, 0, canvas.width, canvas.height);


            if (detections.length > 0 && !checked) {
                recognizeFaces(detections);
                faceapi.draw.drawDetections(canvas, detections);
                //faceapi.draw.drawFaceLandmarks(canvas, detections);
            }
        }, 500);
    };

    const recognizeFaces = (detections) => {

        if (!faceMatcherRef.current) return;

        const results = detections.map(detection => {
            const bestMatch = faceMatcherRef.current.findBestMatch(detection.descriptor);
            return {
                detection,
                bestMatch
            };
        });

        displayResults(results);
    }

    const displayResults = (results) => {

        results.forEach(result => {
            const { detection, bestMatch } = result;
            const box = detection.detection.box;

            // Dibujar nombre
            ctx.current.fillStyle = bestMatch.distance < distance ? 'green' : 'red';
            ctx.current.font = '16px Arial';
            ctx.current.fillText(
                `${bestMatch.label} (${bestMatch.distance < distance ? '✅ Reconocido' : '❌ Desconocido'})`,
                box.x + 20,
                box.y - 10
            );

            if (bestMatch.distance < distance) {
                //setChecked(true);
                onScanSuccess(bestMatch.label);

            }
        });
    }

    const registerFace = async () => {
        const name = document.getElementById('faceName').value.trim();
        if (!name) {
            alert('Por favor ingresa un nombre');
            return;
        }

        try {
            // Obtener descriptor facial actual
            const detection = await faceapi
                .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (detection) {
                // Guardar descriptor
                setKnownFaces(prev => new Map(prev.set(name, detection.descriptor)));
                updateFaceMatcher();
                saveFaces();
                alert(`Rostro "${name}" registrado correctamente`);
            } else {
                alert('No se detectó ningún rostro. Por favor, colócate frente a la cámara.');
            }
        } catch (error) {
            console.error('Error registrando rostro:', error);
            alert('Error al registrar el rostro');
        }
    }

    /*
    useEffect(() => {
        console.log("faceMatcher CHANGED:", faceMatcher);
    }, [faceMatcher]);
    */

    const updateFaceMatcher = async () => {
        console.log("updateFaceMatcher", knownFaces);
        try {
            // 1. Verificar que faceapi esté disponible
            if (!faceapi || !faceapi.FaceMatcher) {
                console.log('Cargando faceapi...');
                //await loadModels();
            }


            // 2. Verificar que knownFaces tenga datos
            if (!knownFaces || knownFaces.size === 0) {
                console.warn('No hay caras conocidas para crear FaceMatcher');
                return null;
            }

            console.log(`Creando FaceMatcher con ${knownFaces.size} caras conocidas`);

            // 3. Crear labeledDescriptors
            const labeledDescriptors = [];

            for (const [label, descriptor] of knownFaces.entries()) {
                console.log(`Procesando cara: ${label}`);

                if (!descriptor) {
                    console.warn(`Descriptor para ${label} es null, omitiendo`);
                    continue;
                }

                // Verificar que el descriptor tenga la forma correcta
                if (!Array.isArray(descriptor) && typeof descriptor !== 'object') {
                    console.warn(`Descriptor para ${label} no es válido:`, descriptor);
                    continue;
                }

                try {
                    const labeledDescriptor = new faceapi.LabeledFaceDescriptors(
                        label,
                        [descriptor]
                    );
                    labeledDescriptors.push(labeledDescriptor);
                    console.log(`Added descriptor for: ${label}`);
                } catch (error) {
                    console.error(`Error creando LabeledFaceDescriptors para ${label}:`, error);
                }
            }

            // 4. Verificar que haya labeledDescriptors válidos
            if (labeledDescriptors.length === 0) {
                console.error('No se pudieron crear labeledDescriptors válidos');
                return null;
            }

            console.log(`Se crearon ${labeledDescriptors.length} labeledDescriptors`);

            // 5. Crear FaceMatcher
            try {
                const newMatcher = new faceapi.FaceMatcher(labeledDescriptors, distance);
                console.log('FaceMatcher creado exitosamente:', newMatcher);
                if (newMatcher) {
                    setFaceMatcher(newMatcher);
                    faceMatcherRef.current = newMatcher;
                    console.log('FaceMatcher creado exitosamente:', newMatcher);
                    return true;
                } else {
                    console.error('No se pudo crear FaceMatcher');
                    return false;
                }
            } catch (error) {
                console.error('Error creando FaceMatcher:', error);
                return false;
            }

        } catch (error) {
            console.error('Error en createFaceMatcher:', error);
            return null;
        }
    };



    const saveFaces = () => {
        const facesData = {};
        knownFaces.forEach((descriptor, name) => {
            facesData[name] = Array.from(descriptor);
        });
        localStorage.setItem('knownFaces', JSON.stringify(facesData));
    }

    const loadSavedFaces = async () => {
        console.log("Loading saved faces...");
        setLoadingProgress(25);
        const savedFaces = await localStorage.getItem('knownFaces');
        if (savedFaces) {
            try {
                const facesData = JSON.parse(savedFaces);
                Object.entries(facesData).forEach(([name, descriptorArray]) => {
                    const descriptor = new Float32Array(descriptorArray);
                    setKnownFaces(prev => new Map(prev.set(name, descriptor)));
                });

                console.log(`Cargados ${knownFaces.size} rostros guardados`);
            } catch (error) {
                console.error('Error cargando rostros guardados:', error);
            }
        }
    }

    useEffect(() => {
        if (contador === 0) initializeApp();

        // 🛑 Cleanup when component unmounts (modal closes)
        return () => {
            stopVideo();
            //if (contador === 0) initializeApp();
        };

    }, []);

    /*
    // Loading UI
    if (!modelsLoaded && !loadingError) {
        return (
            <div className="loading-screen">
                <div className="loading-content">
                    <div className="spinner"></div>
                    <h2>Cargando modelos...</h2>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${loadingProgress}%` }}
                        ></div>
                    </div>
                    <p>{loadingProgress}%</p>
                    <small>Esto puede tardar un momentos...</small>
                </div>
            </div>
        );
    }
    */

    // Error UI
    if (loadingError) {
        return (
            <div className="error-screen">
                <div className="error-content">
                    <h2>⚠️ Error al cargar los modelos</h2>
                    <p>{loadingError.message}</p>
                    <p className="suggestion">{loadingError.suggestion}</p>
                    <button onClick={loadModels} className="retry-btn">
                        Intentar de nuevo
                    </button>
                </div>
            </div>
        );
    }

    // Main UI
    return (
        <div>

            <div className="face-detection-container">
                <div className="video-container">
                    <video ref={videoRef} autoPlay muted className="facedetector-video" />
                    <canvas ref={canvasRef} className="facedetector-canvas" />
                </div>
            </div>

            {!modelsLoaded ? (
                <div className="loading-screen">
                    <div className="loading-content">
                        <div className="spinner"></div>
                        <h2>Cargando modelos...</h2>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${loadingProgress}%` }}
                            ></div>
                        </div>
                        <p>{loadingProgress}%</p>
                        <small>Esto puede tardar un momentos...</small>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default FaceDetector;
