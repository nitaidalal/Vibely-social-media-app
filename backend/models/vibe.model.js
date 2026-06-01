import {Schema,model} from 'mongoose';

const VibeSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
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
      author:{
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      content:{
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
      }
    }
  ],
}, { timestamps: true });

const Vibe = model("Vibe", VibeSchema);
export default Vibe;