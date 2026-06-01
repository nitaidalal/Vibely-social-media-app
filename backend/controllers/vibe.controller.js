import User from "../models/user.model.js";
import Vibe from "../models/vibe.model.js";
import cloudinary from "../config/cloudinary.js";
import { io, getReceiverSocketId } from "../config/socket.js";
import Notification from "../models/notification.model.js";

export const uploadVibe = async (req, res) => {
  try {
    const userId = req.userId;
    const { caption } = req.body;

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("File mimetype:", file.mimetype);

    if (!file.mimetype.startsWith("video/")) {
      return res.status(400).json({
        message: "Only video files are allowed for vibes",
      });
    }

    const fileBase64 = file.buffer.toString("base64");
    const fileUri = `data:${file.mimetype};base64,${fileBase64}`;

    const uploadResult = await cloudinary.uploader.upload(fileUri, {
      folder: "vibogram/vibes",
      resource_type: "video",
    });

    const vibe = await Vibe.create({
      author: userId,
      caption,
      mediaUrl: uploadResult.secure_url,
    });

    await User.findByIdAndUpdate(userId, {
      $push: { vibes: vibe._id },
    });

    const userVibe = await Vibe.findById(vibe._id).populate(
      "author",
      "name username profileImage",
    );

    return res.status(200).json({
      message: "Vibe uploaded successfully",
      vibe: userVibe,
    });
  } catch (error) {
    console.error("Vibe Upload Error:", error);
    return res.status(500).json({
      message: "Vibe upload failed",
      error: error.message,
    });
  }
};


export const likeVibe = async (req, res) => {
    try {
        const userId = req.userId;
        const {vibeId} = req.params;

        const vibe = await Vibe.findById(vibeId);
        if(!vibe){
            return res.status(404).json({message:"Vibe not found"});
        }
        // Check if user already liked the vibe
        const alreadyLiked = vibe.likes.some(like => like.toString() === userId);
        console.log("Already liked:", alreadyLiked);
        if(alreadyLiked){
            vibe.likes.pull(userId);
        }else{
            vibe.likes.push(userId);
        }

        await vibe.save();
        await vibe.populate([
            { path: "author", select: "name username profileImage" },
            { path: "comments.author", select: "name username profileImage" }
        ]);

        //Emit real time like update to all clients
        io.emit("vibeLiked", { vibeId, likes: vibe.likes });

        //create notification for vibe author if someone else liked their vibe
        if(!alreadyLiked && vibe.author._id.toString() !== userId){
          const notification  = await Notification.create({
            recipient: vibe.author._id,
            sender: userId,
            type: "like",
            vibe: vibe._id,
            message: `liked your vibe`
          })
          await notification.populate([
            { path: "sender", select: "name username profileImage" },
            { path: "recipient", select: "name username profileImage" },
            { path: "vibe", select: "mediaUrl caption" }
          ]);
          const receiverSocketId = getReceiverSocketId(vibe.author._id.toString());
          if(receiverSocketId){
            io.to(receiverSocketId).emit("newNotification", notification);
          }
        }

        return res.status(200).json({message: alreadyLiked ? "Vibe unliked" : "Vibe liked", likes: vibe.likes});
        
    } catch (error) {
        console.error("Like Vibe Error:", error);
        return res.status(500).json({message:"Like vibe error", error});
    }
}


export const commentOnVibe = async (req,res) => {
    try {
       const userId = req.userId;
         const {vibeId} = req.params;
        const {content} = req.body;

        const vibe = await Vibe.findById(vibeId);
        if(!vibe){
            return res.status(404).json({message:"Vibe not found"});
        }
        
        const comment = {
            author: userId,
            content,
            parentCommentId: null,
            level: 0
        };
        vibe.comments.push(comment);
        await vibe.save();
        await vibe.populate([
            { path: "author", select: "name username profileImage" },
            { path: "comments.author", select: "name username profileImage" }
        ]);

        //Emit real time comment update to all clients
        io.emit("vibeCommented", { vibeId, comments: vibe.comments });

        const user = await User.findById(userId);
        //create notification for vibe author if someone else commented on their vibe
        if(vibe.author._id.toString() !== userId){
          const notification  = await Notification.create({
            recipient: vibe.author._id,
            sender: userId,
            type: "comment",
            vibe: vibe._id,
            message: `commented on your vibe!`
          });
          await notification.populate([
            { path: "sender", select: "name username profileImage" },
            { path: "recipient", select: "name username profileImage" },
            { path: "vibe", select: "mediaUrl caption" }
          ]);
          const receiverSocketId = getReceiverSocketId(vibe.author._id.toString());
          if(receiverSocketId){
            io.to(receiverSocketId).emit("newNotification", notification);
          }
        }

        return res.status(200).json({message:"Comment added successfully", vibe});
    } catch (error) {
        console.error("Comment Vibe Error:", error);
        return res.status(500).json({message:"Comment vibe error", error});
    }
}


export const getAllVibes = async (req,res) => {
    try {
        const vibes = await Vibe.find({})
            .populate([
                { path: "author", select: "name username profileImage" },
                { path: "comments.author", select: "name username profileImage" }
            ])
            .sort({createdAt:-1});
        return res.status(200).json({vibes});
    } catch (error) {
        console.error("Get All Vibes Error:", error);   
        return res.status(500).json({message:"Get all vibes error", error});
    }
}

export const getVibeById = async (req, res) => {
    try {
        const { vibeId } = req.params;
        const vibe = await Vibe.findById(vibeId).populate([
            { path: "author", select: "name username profileImage" },
            { path: "comments.author", select: "name username profileImage" }
        ]);
        if (!vibe) return res.status(404).json({ message: "Vibe not found" });
        return res.status(200).json({ vibe });
    } catch (error) {
        console.error("Get Vibe By ID Error:", error);
        return res.status(500).json({ message: "Failed to fetch vibe", error: error.message });
    }
}

// Helper function to get comment depth
const getCommentDepth = (commentId, comments) => {
    const comment = comments.find(c => c._id.toString() === commentId.toString());
    if (!comment || !comment.parentCommentId) return 0;
    
    let depth = 0;
    let currentParentId = comment.parentCommentId;
    
    while (currentParentId) {
        const parentComment = comments.find(c => c._id.toString() === currentParentId.toString());
        if (!parentComment) break;
        depth++;
        currentParentId = parentComment.parentCommentId;
    }
    
    return depth;
};

export const replyToVibeComment = async (req, res) => {
    try {
        const { content } = req.body;
        const { vibeId, commentId } = req.params;
        
        const vibe = await Vibe.findById(vibeId);
        if (!vibe) {
            return res.status(404).json({ message: "Vibe not found" });
        }
        
        // Check if parent comment exists
        const parentComment = vibe.comments.find(c => c._id.toString() === commentId);
        if (!parentComment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        
        // Check depth - max level is 2 (comment -> reply -> nested reply)
        const depth = getCommentDepth(commentId, vibe.comments);
        if (depth >= 2) {
            return res.status(400).json({ message: "Maximum nesting level reached (2 levels)" });
        }
        
        const reply = {
            author: req.userId,
            content,
            parentCommentId: commentId,
            level: parentComment.level + 1
        };
        
        vibe.comments.push(reply);
        await vibe.save();
        await vibe.populate([
            { path: "author", select: "name username profileImage" },
            { path: "comments.author", select: "name username profileImage" }
        ]);
        
        // Real-time update
        io.emit("vibeCommentReplyAdded", { vibeId, comments: vibe.comments });
        
        // Create notification for comment author (not vibe author)
        if (parentComment.author._id.toString() !== req.userId) {
            const notification = await Notification.create({
                recipient: parentComment.author,
                sender: req.userId,
                type: "reply",
                vibe: vibe._id,
                message: `replied to your comment`
            });
            
            await notification.populate([
                { path: "sender", select: "name username profileImage" },
                { path: "recipient", select: "name username profileImage" },
                { path: "vibe", select: "mediaUrl caption" }
            ]);
            
            const receiverSocketId = getReceiverSocketId(parentComment.author._id.toString());
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newNotification", notification);
            }
        }
        
        return res.status(200).json({ message: "Reply added", vibe });
    } catch (error) {
        console.error("Reply to Vibe Comment Error:", error);
        return res.status(500).json({ message: "Failed to add reply", error: error.message });
    }
};

export const editVibeComment = async (req, res) => {
    try {
        const { content } = req.body;
        const { vibeId, commentId } = req.params;
        
        const vibe = await Vibe.findById(vibeId);
        if (!vibe) {
            return res.status(404).json({ message: "Vibe not found" });
        }
        
        const comment = vibe.comments.find(c => c._id.toString() === commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        
        // Check authorization - only comment author or vibe owner can edit
        if (comment.author._id.toString() !== req.userId && vibe.author._id.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized to edit this comment" });
        }
        
        comment.content = content;
        comment.editedAt = new Date();
        
        await vibe.save();
        await vibe.populate([
            { path: "author", select: "name username profileImage" },
            { path: "comments.author", select: "name username profileImage" }
        ]);
        
        // Real-time update
        io.emit("vibeCommentEdited", { vibeId, comments: vibe.comments });
        
        return res.status(200).json({ message: "Comment edited", vibe });
    } catch (error) {
        console.error("Edit Vibe Comment Error:", error);
        return res.status(500).json({ message: "Failed to edit comment", error: error.message });
    }
};

export const deleteVibeComment = async (req, res) => {
    try {
        const { vibeId, commentId } = req.params;
        
        const vibe = await Vibe.findById(vibeId);
        if (!vibe) {
            return res.status(404).json({ message: "Vibe not found" });
        }
        
        const comment = vibe.comments.find(c => c._id.toString() === commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        
        // Check authorization - only comment author or vibe owner can delete
        if (comment.author._id.toString() !== req.userId && vibe.author._id.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized to delete this comment" });
        }
        
        // Soft delete - mark as deleted
        comment.isDeleted = true;
        comment.content = "[deleted]";
        
        await vibe.save();
        await vibe.populate([
            { path: "author", select: "name username profileImage" },
            { path: "comments.author", select: "name username profileImage" }
        ]);
        
        // Real-time update
        io.emit("vibeCommentDeleted", { vibeId, comments: vibe.comments });
        
        return res.status(200).json({ message: "Comment deleted", vibe });
    } catch (error) {
        console.error("Delete Vibe Comment Error:", error);
        return res.status(500).json({ message: "Failed to delete comment", error: error.message });
    }
}