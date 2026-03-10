import {Schema,model} from "mongoose";

const notificationSchema = new Schema({
    recipient: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type:{
        type: String,
        enum: ["like", "comment", "follow"],
        required: true,
    },
    post:{
        type: Schema.Types.ObjectId,
        ref: "Post",
    },
    vibe:{
        type: Schema.Types.ObjectId,
        ref: "Vibe",
    },
    message:{
        type: String,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
},{ timestamps: true },);

const Notification = model("Notification",notificationSchema);
export default Notification;