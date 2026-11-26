import Notification from "../models/notification.model.js";

// GET CURRENT USER'S NOTIFICATIONS
export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });

    res.status(200).json({
      unreadCount,
      data: notifications,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// MARK NOTIFICATION AS READ
export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === "all") {
      await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
      return res.status(200).json({ message: "All notifications marked as read" });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: req.user._id },
      { isRead: true },
      { new: true }
    );

    res.status(200).json({ data: notification });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
