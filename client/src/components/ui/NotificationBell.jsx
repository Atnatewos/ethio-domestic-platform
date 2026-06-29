// File path: /client/src/components/ui/NotificationBell.jsx
// Purpose: Modern notification bell with unread count and dropdown
// Architecture: Uses react-hot-toast instead of custom ToastContext

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

/**
 * Fetch notifications from API
 */
const fetchNotifications = async () => {
  const response = await fetch('/api/notifications', {
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }
  
  return response.json();
};

/**
 * Mark notification as read
 */
const markAsRead = async (notificationId) => {
  const response = await fetch(`/api/notifications/${notificationId}/read`, {
    method: 'PATCH',
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Failed to mark as read');
  }
  
  return response.json();
};

/**
 * NotificationBell Component
 * Displays unread notification count and dropdown list
 */
const NotificationBell = () => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    enabled: isAuthenticated,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
    onError: (error) => {
      toast.error('Failed to mark notification as read');
    },
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = data?.data || [];
  const unreadCount = notifications.filter(n => !n.read_at).length;

  const handleBellClick = () => {
    setIsOpen(!isOpen);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read_at) {
      markAsReadMutation.mutate(notification.id);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      {/* Bell Button */}
      <motion.button
        className="notification-bell-button"
        onClick={handleBellClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Notifications"
      >
        <span className="bell-icon">🔔</span>
        
        {/* Unread Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              className="notification-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="notification-dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="notification-dropdown-header">
              <h3>Notifications</h3>
              {unreadCount > 0 && (
                <span className="unread-count">{unreadCount} new</span>
              )}
            </div>

            {/* Notifications List */}
            <div className="notification-dropdown-list">
              {isLoading ? (
                <div className="notification-loading">
                  <div className="skeleton" style={{ height: '60px', width: '100%' }}></div>
                  <div className="skeleton" style={{ height: '60px', width: '100%' }}></div>
                  <div className="skeleton" style={{ height: '60px', width: '100%' }}></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="notification-empty">
                  <span className="empty-icon">📭</span>
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.slice(0, 10).map((notification) => (
                  <motion.div
                    key={notification.id}
                    className={`notification-item ${!notification.read_at ? 'unread' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                    whileHover={{ backgroundColor: 'var(--color-slate-50)' }}
                    transition={{ duration: 0.1 }}
                  >
                    <div className="notification-icon">
                      {notification.type === 'application_hired' && '✅'}
                      {notification.type === 'application_shortlisted' && '📋'}
                      {notification.type === 'verification_approved' && '🎉'}
                      {notification.type === 'payment_confirmed' && '💰'}
                      {!['application_hired', 'application_shortlisted', 'verification_approved', 'payment_confirmed'].includes(notification.type) && '🔔'}
                    </div>
                    
                    <div className="notification-content">
                      <div className="notification-title">{notification.title}</div>
                      <div className="notification-message">{notification.message}</div>
                      <div className="notification-time">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    {!notification.read_at && (
                      <div className="notification-unread-dot"></div>
                    )}
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="notification-dropdown-footer">
                <button 
                  className="view-all-button"
                  onClick={() => {
                    setIsOpen(false);
                    toast.success('View all notifications feature coming soon!');
                  }}
                >
                  View All Notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;