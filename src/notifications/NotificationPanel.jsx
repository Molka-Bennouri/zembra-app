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
            setNotifications(data.map(n => ({ ...n, seen: n.seen })));
        } catch (err) {
            setError('Could not load notifications');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const markAsRead = async (id) => {
        await fetch(`${API_BASE}/${id}/seen`, { method: 'PATCH', headers: getHeaders() });
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, seen: true } : n)
        );
    };

    const markAllAsRead = async () => {
        await fetch(`${API_BASE}/mark-all-seen`, { method: 'PATCH', headers: getHeaders() });
        setNotifications(prev => 
    prev.map(n => ({ ...n, seen: true }))
);
    };

    const deleteNotification = async (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        await fetch(`${API_BASE}/${id}`, { method: 'DELETE', headers: getHeaders() });
    };

    const clearAll = async () => {
        setNotifications([]);
        await fetch(API_BASE, { method: 'DELETE', headers: getHeaders() });
    };

    const unreadCount = notifications.filter(n => !n.seen).length;

    const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    const diff = (Date.now() - date) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

    return (
        <div className="notification-panel">
            <div className="notification-header">
                <div className="header-title">
                    <h3>Notifications</h3>

                    {unreadCount > 0 && (
                        <span className="unread-badge">
                            {unreadCount} new
                        </span>
                    )}
                </div>

                <div className="notification-actions">
                    {unreadCount > 0 && (
                        <button
                            className="icon-btn"
                            onClick={markAllAsRead}
                            title="Mark all as read"
                        >
                            <i className="fa-solid fa-check-double"></i>
                        </button>
                    )}

                    {notifications.length > 0 && (
                        <button
                            className="icon-btn delete"
                            onClick={clearAll}
                            title="Clear all"
                        >
                            <i className="fa-solid fa-trash-can"></i>
                        </button>
                    )}
                </div>
            </div>

            <div className="notification-list">

                {loading && (
                    <div className="status-container">
                        <div className="spinner"></div>
                    </div>
                )}

                {error && (
                    <div className="status-container error-text">
                        {error}
                    </div>
                )}

                {!loading && !error && notifications.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <i className="fa-solid fa-bell-slash"></i>
                        </div>

                        <p>No notifications yet</p>
                    </div>
                )}

                {!loading && notifications.map((n) => (
                    <div
                        key={n.id}
                        className={`notification-item ${n.type} ${!n.seen ? 'unread' : ''}`}
                        onClick={() => !n.seen && markAsRead(n.id)}
                    >

                        <div className="notification-icon-wrapper">

                            {n.type === 'success' && (
                                <i className="fa-solid fa-circle-check"></i>
                            )}

                            {n.type === 'warning' && (
                                <i className="fa-solid fa-triangle-exclamation"></i>
                            )}

                            {n.type === 'error' && (
                                <i className="fa-solid fa-circle-xmark"></i>
                            )}

                            {n.type === 'info' && (
                                <i className="fa-solid fa-circle-info"></i>
                            )}

                        </div>

                        <div className="notification-content">

                            <div className="notification-top">

                                <span className="notification-title">
                                    {n.title ?? n.type}
                                </span>

                                <span className="notification-time">
                                    {formatTime(n.created_at)}
                                </span>

                            </div>

                            <p className="notification-message">
                                {n.message}
                            </p>

                        </div>

                        <button
                            className="item-delete-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(n.id);
                            }}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>

                    </div>
                ))}
            </div>

            <div className="notification-footer"></div>
        </div>
    );
}