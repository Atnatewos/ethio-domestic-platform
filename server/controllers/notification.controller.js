// File path: /server/controllers/notification.controller.js
// Purpose: Notification request handlers - validates input and delegates to service.

const notificationService = require('../services/notification.service');

/**
 * Get notifications for current user
 */
const getNotifications = async (req, res) => {
  try {
    const { id: userId, type: userType, role } = req.user;
    const { limit, unreadOnly } = req.query;

    let result;
    
    // Admin users get admin notifications
    if (role || userType === 'admin') {
      result = await notificationService.getAdminNotifications(userId, {
        limit: parseInt(limit) || 20
      });
    } else {
      result = await notificationService.getNotifications(userType, userId, {
        limit: parseInt(limit) || 20,
        unreadOnly: unreadOnly === 'true'
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
};

/**
 * Mark a single notification as read
 */
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    await notificationService.markAsRead(id, userId);

    res.json({ 
      success: true, 
      message: 'Notification marked as read' 
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    });
  }
};

/**
 * Mark all notifications as read for current user
 */
const markAllAsRead = async (req, res) => {
  try {
    const { id: userId, type: userType, role } = req.user;

    if (role || userType === 'admin') {
      await notificationService.markAllAsRead('admin', userId);
    } else {
      await notificationService.markAllAsRead(userType, userId);
    }

    res.json({ 
      success: true, 
      message: 'All notifications marked as read' 
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read'
    });
  }
};

/**
 * Delete a notification
 */
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    await notificationService.deleteNotification(id, userId);

    res.json({ 
      success: true, 
      message: 'Notification deleted' 
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification'
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};