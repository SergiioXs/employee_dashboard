export const getCurrentLocation = () => {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve({
                status: false,
                message: "Tu navegador no soporta geolocalización",
            });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    status: true,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                });
            },
            (error) => {
                let message = "No se pudo obtener la ubicación";

                if (error.code === error.PERMISSION_DENIED) {
                    message =
                        "Permiso de ubicación denegado. Actívalo en la configuración del navegador.";
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    message = "Ubicación no disponible";
                } else if (error.code === error.TIMEOUT) {
                    message = "Tiempo de espera agotado";
                }

                resolve({
                    status: false,
                    message,
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            }
        );
    });
};