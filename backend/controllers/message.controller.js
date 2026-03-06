import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../config/socket.js";
import cloudinary from "../config/cloudinary.js";

// ─── Send a Message ───────────────────────────────────────────────────────────
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.userId;
        const { receiverId } = req.params;
        const { content } = req.body;

        let imageUrl = "";
        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;
            const uploadResult = await cloudinary.uploader.upload(dataURI, {
                folder: "messages",
                resource_type: "image",
            });
            imageUrl = uploadResult.secure_url;
        }

        if (!content && !imageUrl) {
            return res.status(400).json({ message: "Message cannot be empty" });
        }

        // Find existing conversation between the two users
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        // Create a new conversation if one doesn't exist
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        const messageType = imageUrl ? "image" : "text";

        const newMessage = await Message.create({
            conversationId: conversation._id,
            sender: senderId,
            content: content || "",
            image: imageUrl,
            messageType
        });

        // Update conversation's lastMessage & messages array
        conversation.lastMessage = newMessage._id;
        conversation.messages.push(newMessage._id);
        await conversation.save();

        // Populate sender details for the response
        await newMessage.populate("sender", "name username profileImage"); //currently not using this populated data in the frontend, but good to have for future features like notifications 

        // ── Real-time: emit to receiver if they are online ──
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("sendMessage error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ─── Get All Conversations of Logged-in User ──────────────────────────────────
export const getConversations = async (req, res) => {
    try {
        const userId = req.userId;

        const conversations = await Conversation.find({
            participants: { $in: [userId] }
        })
            .populate("participants", "name username profileImage")
            .populate({
                path: "lastMessage",
                // populate: { path: "sender", select: "name username profileImage" } 
            })
            .sort({ updatedAt: -1 });

        // Shape each conversation: show the OTHER participant only
        const formatted = conversations.map((conv) => {
            const otherUser = conv.participants.find(
                (p) => p._id.toString() !== userId
            );
            return {
                _id: conv._id,
                participant: otherUser,
                lastMessage: conv.lastMessage,
                updatedAt: conv.updatedAt
            };
        });

        res.status(200).json(formatted);
    } catch (error) {
        console.error("getConversations error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ─── Get All Messages in a Conversation ──────────────────────────────────────
export const getMessages = async (req, res) => {
    try {
        const userId = req.userId;
        const { conversationId } = req.params;

        // Ensure the requesting user is a participant
        const conversation = await Conversation.findOne({
            _id: conversationId,
            participants: { $in: [userId] }
        });

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        const messages = await Message.find({ conversationId })
            .populate("sender", "name username profileImage")
            .sort({ createdAt: 1 });

        // Mark all unread messages (from the other user) as seen
        const unseenMessages = await Message.find(
            { conversationId, sender: { $ne: userId }, seen: false }
        );

        if (unseenMessages.length > 0) {
            await Message.updateMany(
                { conversationId, sender: { $ne: userId }, seen: false },
                { seen: true }
            );

            // ── Real-time: notify ALL senders (in case of multi-sender future) ──
            const senderIds = [...new Set(unseenMessages.map(m => m.sender.toString()))];
            senderIds.forEach((senderId) => {
                const senderSocketId = getReceiverSocketId(senderId);
                if (senderSocketId) {
                    io.to(senderSocketId).emit("messagesSeen", { conversationId: conversationId.toString() });
                }
            });
        }

        res.status(200).json(messages);
    } catch (error) {
        console.error("getMessages error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ─── Delete a Message ─────────────────────────────────────────────────────────
export const deleteMessage = async (req, res) => {
    try {
        const userId = req.userId;
        const { messageId } = req.params;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        if (message.sender.toString() !== userId) {
            return res.status(403).json({ message: "You can only delete your own messages" });
        }

        const conversationId = message.conversationId;
        await Message.findByIdAndDelete(messageId);

        // Update the conversation's lastMessage if the deleted one was the last
        const conversation = await Conversation.findById(conversationId);
        if (conversation.lastMessage?.toString() === messageId) {
            const prevMessage = await Message.findOne({ conversationId }).sort({ createdAt: -1 });
            conversation.lastMessage = prevMessage?._id || null;
        }
        conversation.messages = conversation.messages.filter(
            (id) => id.toString() !== messageId
        );
        await conversation.save();

        // ── Real-time: notify the other participant ──
        const otherParticipantId = conversation.participants.find(
            (id) => id.toString() !== userId
        );
        const receiverSocketId = getReceiverSocketId(otherParticipantId?.toString());
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("messageDeleted", { messageId, conversationId });
        }

        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        console.error("deleteMessage error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
