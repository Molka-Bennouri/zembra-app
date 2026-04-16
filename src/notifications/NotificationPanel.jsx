import { useState, useEffect, useCallback } from 'react';
import './NotificationPanel.css';
import { getAuthHeaders } from '../utils/auth';

const API_BASE = 'http://localhost:8000/api/notifications';

const getHeaders = () => ({
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
});

export default function NotificationPanel() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(API_BASE, { headers: getHeaders() });
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setNotifications(data.map(n => ({ ...n, read: n.seen })));
        } catch (err) {
            setError('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const markAsRead = async (id) => {
        await fetch(`${API_BASE}/${id}/seen`, { method: 'PATCH', headers: getHeaders() });
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = async () => {
        await fetch(`${API_BASE}/mark-all-seen`, { method: 'PATCH', headers: getHeaders() });
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = async (id) => {
        await fetch(`${API_BASE}/${id}`, { method: 'DELETE', headers: getHeaders() });
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const clearAll = async () => {
        await fetch(API_BASE, { method: 'DELETE', headers: getHeaders() });
        setNotifications([]);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const formatTime = (dateStr) => {
        const diff = (Date.now() - new Date(dateStr)) / 1000;
        if (diff < 60) return 'just now';
        if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
        return `${Math.floor(diff / 86400)} days ago`;
    };

    return (
        <div className="notification-panel">
            <div className="notification-header">
                <h3>Notifications {unreadCount > 0 && <span className="badge">{unreadCount}</span>}</h3>
                <div className="notification-actions">
                    {unreadCount > 0 && (
                        <button className="action-btn mark-all" onClick={markAllAsRead} title="Mark all as read">
                            <i className="fa-solid fa-check"></i>
                        </button>
                    )}
                    {notifications.length > 0 && (
                        <button className="action-btn clear-all" onClick={clearAll} title="Clear all notifications">
                            <i className="fa-solid fa-x"></i>
                        </button>
                    )}
                </div>
            </div>

            <div className="notification-list">
                {loading && <div className="empty-state"><p>Loading...</p></div>}
                {error && <div className="empty-state"><p>{error}</p></div>}
                {!loading && !error && notifications.length === 0 && (
                    <div className="empty-state">
                        <i className="fa-solid fa-bell"></i>
                        <p>No notifications</p>
                    </div>
                )}
                {!loading && notifications.map(n => (
                    <div
                        key={n.id}
                        className={`notification-item ${n.type} ${!n.read ? 'unread' : ''}`}
                        onClick={() => !n.read && markAsRead(n.id)}
                    >
                        <div className="notification-icon">
                            {n.type === 'success' && <i className="fa-solid fa-circle-check"></i>}
                            {n.type === 'warning' && <i className="fa-solid fa-triangle-exclamation"></i>}
                            {n.type === 'error' && <i className="fa-solid fa-circle-xmark"></i>}
                            {n.type === 'info' && <i className="fa-solid fa-circle-info"></i>}
                        </div>
                        <div className="notification-content">
                            <div className="notification-title">{n.title ?? n.type}</div>
                            <div className="notification-message">{n.message}</div>
                            <div className="notification-time">{formatTime(n.created_at)}</div>
                        </div>
                        {!n.read && <div className="unread-indicator" />}
                        <button
                            className="delete-btn"
                            onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                        >
                            <i className="fa-solid fa-x"></i>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}