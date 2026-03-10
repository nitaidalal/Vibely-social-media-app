import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
    getNotifications,
    markAllAsRead,
    markAsRead,
    deleteAllNotifications,
    deleteNotification,
} from "../controllers/notification.controller.js";

const notificationRouter = express.Router();

notificationRouter.get("/", authMiddleware, getNotifications);
notificationRouter.put("/mark-all-read", authMiddleware, markAllAsRead);
notificationRouter.put("/:notificationId/read", authMiddleware, markAsRead);
notificationRouter.delete("/all", authMiddleware, deleteAllNotifications);
notificationRouter.delete("/:notificationId", authMiddleware, deleteNotification);

export default notificationRouter;
