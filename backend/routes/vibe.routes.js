import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import {videoUpload, handleMulterError} from "../middlewares/multer.middleware.js";
import { commentOnVibe, getAllVibes, getVibeById, likeVibe, uploadVibe, replyToVibeComment, editVibeComment, deleteVibeComment } from "../controllers/vibe.controller.js";


const vibeRouter = express.Router();

vibeRouter.post("/upload", authMiddleware, videoUpload.single("video"), handleMulterError, uploadVibe);
vibeRouter.get("/getAllVibes", authMiddleware, getAllVibes);
vibeRouter.get("/:vibeId", authMiddleware, getVibeById);
vibeRouter.post("/like/:vibeId", authMiddleware, likeVibe);
vibeRouter.post("/comment/:vibeId", authMiddleware, commentOnVibe);
vibeRouter.post("/comment/:vibeId/reply/:commentId", authMiddleware, replyToVibeComment);
vibeRouter.patch("/comment/:vibeId/:commentId", authMiddleware, editVibeComment);
vibeRouter.delete("/comment/:vibeId/:commentId", authMiddleware, deleteVibeComment);

export default vibeRouter;