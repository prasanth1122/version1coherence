import mongoose from "mongoose";

const likeDislikeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        articleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Article",
          required: true,
        },
        title: { type: String, required: true },
        category: { type: String, required: true },
        month: { type: Number, required: true },
        year: { type: Number, required: true },
        likedAt: { type: Date, default: Date.now }, // Time when liked
      },
    ],
    dislikes: [
      {
        articleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Article",
          required: true,
        },
        title: { type: String, required: true },
        category: { type: String, required: true },
        month: { type: Number, required: true },
        year: { type: Number, required: true },
        dislikedAt: { type: Date, default: Date.now }, // Time when disliked
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const LikeDislike = mongoose.model(
  "LikeDislike",
  likeDislikeSchema,
  "likeDislike"
);
export default LikeDislike;
