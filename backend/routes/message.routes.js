import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { imageUpload } from "../middlewares/multer.middleware.js";
import {
    sendMessage,
    getConversations,
    getMessages,
    deleteMessage
} from "../controllers/message.controller.js";

const messageRouter = express.Router();

// Send a message to a user
messageRouter.post("/send/:receiverId", authMiddleware, imageUpload.single("image"), sendMessage);

// Get all conversations of the logged-in user
messageRouter.get("/conversations", authMiddleware, getConversations);

// Get all messages in a specific conversation
messageRouter.get("/:conversationId", authMiddleware, getMessages);

// Delete a specific message
messageRouter.delete("/:messageId", authMiddleware, deleteMessage);

export default messageRouter;
