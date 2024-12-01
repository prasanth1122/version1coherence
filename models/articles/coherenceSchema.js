import mongoose from "mongoose";

// Sub-schema for comments
const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Sub-schema for ratings
const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
});

// Main Article Schema
const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Nature", "Computers", "Economics", "General", "Medical"],
      required: true,
    },
    content: {
      introduction: { type: String, required: true },
      valueProposition: { type: String, required: true },
    },
    author: { type: String, required: true },
    isMonthlyEdition: { type: Boolean, default: false },
    parentArticle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      default: null,
      validate: {
        validator: async function (parentArticleId) {
          if (parentArticleId) {
            const parentArticle = await mongoose
              .model("Article")
              .findById(parentArticleId);
            if (!parentArticle) {
              throw new Error("Parent article does not exist.");
            }
          }
        },
        message: "Invalid parent article ID.",
      },
    },
    // Sub-articles array now includes more fields from the referenced sub-articles
    subArticles: [
      {
        articleId: { type: mongoose.Schema.Types.ObjectId, ref: "Article" },
        title: { type: String },
        category: { type: String },
        content: {
          introduction: { type: String },
          valueProposition: { type: String },
        },
      },
    ],
    subArticlesCount: { type: Number, default: 0 },
    month: { type: Number },
    year: { type: Number },
    views: { type: Number, default: 0 },
    comments: [commentSchema],
    commentCount: { type: Number, default: 0 },
    ratings: [ratingSchema],
    averageRating: { type: Number, default: 0 },
    accessLevel: {
      type: String,
      enum: ["free", "basic", "premium", "institutional"],
      default: "free",
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Pre-save middleware
articleSchema.pre("save", function (next) {
  if (this.isMonthlyEdition) {
    this.category = "General";
  }

  if (this.ratings.length > 0) {
    const total = this.ratings.reduce((sum, rate) => sum + rate.rating, 0);
    this.averageRating = total / this.ratings.length;
  } else {
    this.averageRating = 0;
  }

  this.commentCount = this.comments.length;

  if (this.parentArticle) {
    this.subArticlesCount = this.subArticles.length;
  }

  next();
});

articleSchema.post("save", async function (doc) {
  if (doc.parentArticle) {
    const subArticleData = {
      articleId: doc._id,
      title: doc.title,
      category: doc.category,
      content: doc.content,
    };

    // Find the parent article
    const parentArticle = await mongoose
      .model("Article")
      .findById(doc.parentArticle);

    if (parentArticle) {
      // Check if the sub-article already exists in the `subArticles` array
      const exists = parentArticle.subArticles.some(
        (subArticle) => subArticle.articleId.toString() === doc._id.toString()
      );

      // Add sub-article only if it doesn't exist
      if (!exists) {
        parentArticle.subArticles.push(subArticleData);
        parentArticle.subArticlesCount = parentArticle.subArticles.length;
        await parentArticle.save();
      }
    }
  }
});

const CoherenceArticles = mongoose.model(
  "Article",
  articleSchema,
  "coherenceArticles"
);

export default CoherenceArticles;
