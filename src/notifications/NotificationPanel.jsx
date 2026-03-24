import { useState } from 'react';
import './NotificationPanel.css';

export default function NotificationPanel() {
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'success', title: 'Payment Received', message: 'Invoice INV-2026-050 has been paid successfully', timestamp: '2 minutes ago', read: false },
        { id: 2, type: 'warning', title: 'Invoice Overdue', message: 'Invoice INV-2026-045 is now 5 days overdue', timestamp: '1 hour ago', read: false },
        { id: 3, type: 'info', title: 'Plan Upgrade', message: 'Your Startup plan will expire in 7 days', timestamp: '3 hours ago', read: true },
        { id: 4, type: 'error', title: 'Failed Transaction', message: 'Payment attempt failed. Please update your payment method', timestamp: '1 day ago', read: true },
    ]);

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const clearAll = () => setNotifications([]);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="notification-panel">
            <div className="notification-header">
                <h3>Notifications</h3>
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
                {notifications.length === 0 ? (
                    <div className="empty-state">
                        <i className="fa-solid fa-bell"></i>
                        <p>No notifications</p>
                    </div>
                ) : (
                    notifications.map(n => (
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
                                <div className="notification-title">{n.title}</div>
                                <div className="notification-message">{n.message}</div>
                                <div className="notification-time">{n.timestamp}</div>
                            </div>

                            {!n.read && <div className="unread-indicator" />}

                            <button
                                className="delete-btn"
                                onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                                title="Delete notification"
                            >
                                <i className="fa-solid fa-x"></i>
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="notification-footer">
                <a href="/notifications" className="view-all-link">View all notifications</a>
            </div>
        </div>
    );
}