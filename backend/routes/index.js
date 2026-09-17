import express from "express";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";
import postRouter from "./post.routes.js";
import vibeRouter from "./vibe.routes.js";
import storyRouter from "./story.routes.js";
import messageRouter from "./message.routes.js";
import notificationRouter from "./notification.routes.js";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/user", userRouter);
apiRouter.use("/posts", postRouter);
apiRouter.use("/vibes", vibeRouter);
apiRouter.use("/story", storyRouter);
apiRouter.use("/messages", messageRouter);
apiRouter.use("/notifications", notificationRouter);

export default apiRouter;
