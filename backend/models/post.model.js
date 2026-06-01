import {Schema, model} from "mongoose";

const postSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      require: true,
    },
    mediaUrl: {
      type: String,
      require: true,
    },
    caption: {
      type: String,
      default: "",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          auto: true,
        },
        author: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        content: {
          type: String,
          require: true,
        },
        parentCommentId: {
          type: Schema.Types.ObjectId,
          default: null,
        },
        level: {
          type: Number,
          default: 0,
          enum: [0, 1, 2],
        },
        editedAt: {
          type: Date,
          default: null,
        },
        isDeleted: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    reports: [
      {
        reportedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        reason: {
          type: String,
          enum: ["Spam", "Nudity or Sexual Content", "Harassment or Bullying", "Violence or Dangerous Content", "Misinformation", "Hate Speech", "Other"],
          required: true,
        },
        description: {
          type: String,
          default: "",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

postSchema.index({ createdAt: -1, _id: -1 });

const Post = model("Post",postSchema);
export default Post;

