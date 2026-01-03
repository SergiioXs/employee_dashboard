import { useEffect, useState, useCallback, useRef } from "react";
import {
    GoogleMap,
    Marker,
    Circle,
    useJsApiLoader,
} from "@react-google-maps/api";

const DEFAULT_CENTER = {
    lat: 31.8667,
    lng: -116.6000, // Ensenada
};

const GeoMapPicker = ({
    value,
    radius = 20,
    onChange,
    height = 350,
}) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    });

    const [position, setPosition] = useState(null);
    const geocoderRef = useRef(null);
    const initialized = useRef(false);

    // Inicialización
    useEffect(() => {
        if (!isLoaded || initialized.current) return;

        geocoderRef.current = new window.google.maps.Geocoder();

        if (value?.lat && value?.lng && value?.radius) {
            setPosition({ lat: value.lat, lng: value.lng });
            initialized.current = true;
            return;
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setPosition({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    });
                    initialized.current = true;
                },
                () => {
                    setPosition(DEFAULT_CENTER);
                    initialized.current = true;
                }
            );
        } else {
            setPosition(DEFAULT_CENTER);
            initialized.current = true;
        }
    }, [isLoaded, value]);

    // 🔁 Reverse geocoding
    const resolveAddress = useCallback((coords) => {
        if (!geocoderRef.current) return Promise.resolve("");

        return new Promise((resolve) => {
            geocoderRef.current.geocode(
                { location: coords },
                (results, status) => {
                    if (status === "OK" && results?.length) {
                        resolve(results[0].formatted_address);
                    } else {
                        resolve("");
                    }
                }
            );
        });
    }, []);

    const emitChange = useCallback(
        async (coords) => {
            if (!onChange) return;

            //const address = await resolveAddress(coords);

            onChange({
                lat: coords.lat,
                lng: coords.lng,
                radius,
                address: "",
            });
        },
        [radius, onChange, resolveAddress]
    );

    const handleMapClick = useCallback(
        async (e) => {
            const coords = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
            };

            setPosition(coords);
            await emitChange(coords);
        },
        [emitChange]
    );

    if (!isLoaded || !position) return null;

    return (
        <GoogleMap
            mapContainerStyle={{ width: "100%", height }}
            center={position}
            zoom={18}
            onClick={handleMapClick}
            options={{
                streetViewControl: false,
                fullscreenControl: false,
                mapTypeControl: false,
            }}
        >
            <Marker position={position} />

            <Circle
                center={position}
                radius={radius}
                options={{
                    fillColor: "#2563eb",
                    fillOpacity: 0.25,
                    strokeColor: "#2563eb",
                    strokeOpacity: 0.9,
                    strokeWeight: 2,
                }}
            />
        </GoogleMap>
    );
};

export default GeoMapPicker;
