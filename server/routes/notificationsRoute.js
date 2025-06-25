import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import Notification from "../models/notificationModel.js";

const router = express.Router();

// add a new notification
router.post("/notify", authMiddleware, async (req, res) => {
  try {
    const newNotification = new Notification(req.body);
    await newNotification.save();
    res.send({
      success: true,
      message: "Notification added successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get all notifications by user
router.get("/get-all-notifications", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.userId,
    }).sort({ createdAt: -1 });
    res.send({
      success: true,
      data: notifications,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// delete a notification
router.delete("/delete-notification/:id", authMiddleware, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.send({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// raed all notifications by user
router.put("/read-all-notifications", authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.userId, read: false },
      { $set: { read: true } }
    );
    res.send({
      success: true,
      message: "All notificcations marked as read",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

export default router;
