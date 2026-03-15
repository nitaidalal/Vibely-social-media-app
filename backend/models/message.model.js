import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: "Conversation",
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    },
    seen: {
        type: Boolean,
        default: false
    },
    messageType: {
        type: String,
        enum: ["text", "image","text_image", "sharedPost", "sharedVibe", "sharedProfile"],
        default: "text"
    },
    sharedPost: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        default: null
    },
    sharedVibe: {
        type: Schema.Types.ObjectId,
        ref: "Vibe",
        default: null
    },
    sharedProfile: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
}, { timestamps: true });


messageSchema.index({ conversationId: 1, createdAt: 1 }); // For efficient retrieval of messages in a conversation

const Message = model("Message", messageSchema);
export default Message;