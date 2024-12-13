import mongoose from "mongoose";
import Periodical from "../articles/periodicalModel.js"; // Ensure correct path to Periodical model

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  text: { type: String, required: true },
  username: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: [String], required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  month: { type: Number, required: true },
  periodicalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Periodical",
    required: true,
  },
  relevence: { type: String, required: true },
  cite: { type: String, required: true },
  subscription: { type: String, required: true },
  author: { type: String, required: true },
  valueProposition: { type: String, required: true },
  year: { type: Number, required: true },
  contentUrl: { type: String, required: true },
  views: { type: Number, default: 0 }, // Number of views
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  tags: { type: [String], default: [], required: true },

  comments: [commentSchema],
  commentCount: { type: Number, default: 0 },
});

// Middleware to update the periodical's articles array when an article is added
articleSchema.post("save", async function (doc, next) {
  try {
    const periodical = await Periodical.findById(doc.periodicalId);
    if (!periodical) {
      throw new Error("Associated Periodical not found");
    }

    // Check for duplicate articles in the periodical's articles array
    const isDuplicate = periodical.articles.some(
      (article) => article.articleId.toString() === doc._id.toString()
    );

    if (!isDuplicate) {
      // Add the article to the periodical's articles array
      periodical.articles.push({
        articleId: doc._id,
        title: doc.title,
        image: doc.image,
        category: doc.category,
        month: doc.month,
        year: doc.year,
        author: doc.author,
        valueProposition: doc.valueProposition || "",
      });
      await periodical.save();
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Article = mongoose.model("Article", articleSchema, "articles");
export default Article;
