import Notification from "../models/notification.model.js";

// GET /api/notifications — fetch all notifications for the logged-in user
export const getNotifications = async (req, res) => {
    try {
        const userId = req.userId;
        const notifications = await Notification.find({ recipient: userId })
            .populate("sender", "name username profileImage")
            .populate("post", "mediaUrl caption mediaType")
            .populate("vibe", "mediaUrl caption")
            .sort({ createdAt: -1 });

        const unreadCount = notifications.filter((n) => !n.isRead).length;

        return res.status(200).json({ notifications, unreadCount });
    } catch (error) {
        console.error("Get Notifications Error:", error);
        return res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
    }
};

// PUT /api/notifications/mark-all-read — mark all notifications as read
export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.userId;
        await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
        return res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
        console.error("Mark All Read Error:", error);
        return res.status(500).json({ message: "Failed to mark notifications as read", error: error.message });
    }
};

// PUT /api/notifications/:notificationId/read — mark single notification as read
export const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.userId;

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, recipient: userId },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        return res.status(200).json({ message: "Notification marked as read", notification });
    } catch (error) {
        console.error("Mark Read Error:", error);
        return res.status(500).json({ message: "Failed to mark notification as read", error: error.message });
    }
};

// DELETE /api/notifications/all — delete all notifications for the user
export const deleteAllNotifications = async (req, res) => {
    try {
        const userId = req.userId;
        await Notification.deleteMany({ recipient: userId });
        return res.status(200).json({ message: "All notifications deleted" });
    } catch (error) {
        console.error("Delete All Notifications Error:", error);
        return res.status(500).json({ message: "Failed to delete all notifications", error: error.message });
    }
};

// DELETE /api/notifications/:notificationId — delete a single notification
export const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.userId;

        const notification = await Notification.findOneAndDelete({ _id: notificationId, recipient: userId });
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        return res.status(200).json({ message: "Notification deleted" });
    } catch (error) {
        console.error("Delete Notification Error:", error);
        return res.status(500).json({ message: "Failed to delete notification", error: error.message });
    }
};
