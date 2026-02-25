import Story from "../models/story.model.js";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const uploadStory = async (req, res) => {
    let filePath = null;
    try {
        const user = await User.findById(req.userId);
        if(user.story){
            await Story.findByIdAndDelete(user.story);
            user.story = null;
        }

        if(req.file){
            // Check if file is on disk or in memory
            let fileUri;
            if (req.file.path) {
                // File is on disk
                filePath = req.file.path;
                fileUri = filePath;
            } else {
                // File is in memory (buffer)
                const fileBase64 = req.file.buffer.toString("base64");
                fileUri = `data:${req.file.mimetype};base64,${fileBase64}`;
            }

            const uploadResult = await cloudinary.uploader.upload(fileUri, {
                folder: "vibogram/stories",
                resource_type: "auto",
                transformation: [
                    { width: 1080, crop: "limit" },
                    { quality: "auto" },
                    { fetch_format: "auto" },
                ],
            });
            let mediaUrl = uploadResult.secure_url;

            // Automatically determine mediaType from Cloudinary's resource_type
            const mediaType = uploadResult.resource_type === "video" ? "video" : "image";

            // Delete temporary file if it exists
            if (filePath && fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                filePath = null;
            }
                
            const story = await Story.create({
                author: user._id,
                mediaType,
                mediaUrl
            });
            user.story = story._id;
            await user.save();
            const populatedStory = await Story.findById(story._id).populate([
                { path: "author", select: "name username profileImage" },
                { path: "viewers", select: "name username profileImage" }
            ]);
            res.status(201).json({ message: "Story uploaded successfully", story: populatedStory });
        }
    } catch (error) {
        // Delete temporary file if upload fails
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        console.error("Upload Story Error:", error);
        res.status(500).json({ message: error.message });
    }
}

// View a story
// export const viewStory = async(req,res) => {
//     try {
//         const {storyId} = req.params;
//         console.log("Attempting to view story with ID:", storyId);
        
//         const story = await Story.findById(storyId);
//         console.log("Story found:", story ? "Yes" : "No");

//         if(!story){
//             return res.status(404).json({message:"Story not found or expired"});
//         }

//         const viewersIds = story.viewers.map(viewer => viewer.toString());
//         if(!viewersIds.includes(req.userId)){
//             story.viewers.push(req.userId);
//             await story.save();
//         }

//         const populatedStory = await Story.findById(storyId).populate([
//             { path: "author", select: "name username profileImage" },
//             { path: "viewers", select: "name username profileImage" }
//         ]);
//         return res.status(200).json({story: populatedStory});
//     } catch (error) {
//         console.error("View Story Error:", error);
//         console.error("Story ID that failed:", req.params.storyId);
//         res.status(500).json({message:error.message});
//     }
// }

export const getStoryByUsername = async(req,res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({username});
        if(!user || !user.story){
            return res.status(404).json({message:"Story not found"});
        }

        const story = await Story.findById(user.story);

        // Handle expired story (TTL deleted it but reference remains)
        if(!story){
            return res.status(404).json({message:"Story not found or expired"});
        }

        // Track viewer if not the owner
        const isOwner = story.author.toString() === req.userId;
        if(!isOwner){
            const viewersIds = story.viewers.map(viewer => viewer.toString());
            if(!viewersIds.includes(req.userId)){
                story.viewers.push(req.userId);
                await story.save();
            }
        }

        // Populate and return story with viewers
        const populatedStory = await Story.findById(story._id).populate([
            { path: "author", select: "name username profileImage" },
            { path: "viewers", select: "name username profileImage" }
        ]);

        return res.status(200).json({story: populatedStory});

    } catch (error) {
        console.error("Get My Story Error:", error);
        res.status(500).json({message:error.message});
    }
}

export const getAllStory = async(req,res) => {
    try {
        const stories = await Story.find().populate("author", "name username profileImage").sort({createdAt:-1});
        return res.status(200).json({stories});        
    } catch (error) {
        console.error("Get All Stories Error:", error);
        res.status(500).json({message:error.message});
        
    }
}
