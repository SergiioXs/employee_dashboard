// components/notifications/NotificationProvider.js
import { createContext, useContext, useState, useCallback } from "react";
import NotificationContainer from "./NotificationContainer";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const notify = useCallback(
        ({ title, message, type = "info", icon, duration = 4000 }) => {
            const id = Date.now();

            setNotifications((prev) => [
                ...prev,
                { id, title, message, type, icon },
            ]);

            setTimeout(() => {
                setNotifications((prev) => prev.filter((n) => n.id !== id));
            }, duration);
        },
        []
    );

    const remove = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            <NotificationContainer
                notifications={notifications}
                onClose={remove}
            />
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
