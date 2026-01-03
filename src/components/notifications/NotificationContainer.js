import "./notification.css";

const icons = {
    success: "✔️",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
};

const NotificationContainer = ({ notifications, onClose }) => {
    return (
        <div className="notification-container">
            {notifications.map((n) => (
                <div key={n.id} className={`toast ${n.type}`}>
                    <div className="icon">{n.icon || icons[n.type]}</div>

                    <div className="content">
                        <strong>{n.title}</strong>
                        <p>{n.message}</p>
                    </div>

                    <button onClick={() => onClose(n.id)}>×</button>
                </div>
            ))}
        </div>
    );
};

export default NotificationContainer;
