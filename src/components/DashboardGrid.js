import React, { useState, useEffect } from 'react';
import {
    FaBullhorn, FaComments, FaCalendarAlt,
    FaInfoCircle, FaCalendar, FaGift,
    FaUser, FaUsers, FaChartLine, FaLightbulb
} from 'react-icons/fa';
import Card from './Card';
import ListItem from './ListItem';
import '../styles/dashboard.css';

const DashboardGrid = ({ onMessageRead }) => {
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
        onMessageRead();
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
        updateMeetingStatuses();
        const interval = setInterval(updateMeetingStatuses, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
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
    );
};

export default DashboardGrid;