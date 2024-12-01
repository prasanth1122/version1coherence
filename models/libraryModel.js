import mongoose from "mongoose";

const librarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // User who owns the library
    savedArticles: [
      {
        articleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Article",
          required: true,
        }, // Reference to the Article
        title: { type: String, required: true }, // Title of the saved article
        category: { type: String, required: true }, // Category of the saved article
        month: { type: Number, required: true }, // Month of the article (1-12)
        isMonthlyEdition: { type: Boolean, required: true },
        year: { type: Number, required: true }, // Year of the article
        savedAt: { type: Date, default: Date.now }, // Timestamp for when the article was saved
      },
    ],
    createdAt: { type: Date, default: Date.now }, // When the library was created
    updatedAt: { type: Date, default: Date.now }, // When the library was last updated
  },
  { timestamps: true }
);

// Method to add a saved article to the user's library
librarySchema.methods.saveArticle = async function (
  articleId,
  title,
  category,
  month,
  year,
  isMonthlyEdition
) {
  // Check if the article is already saved by the user
  const isAlreadySaved = this.savedArticles.some((a) =>
    a.articleId.equals(articleId)
  );

  if (!isAlreadySaved) {
    this.savedArticles.push({
      articleId,
      title,
      category,
      month,
      year,
      isMonthlyEdition,
    });
    await this.save();
  }
};

// Method to remove a saved article
librarySchema.methods.unsaveArticle = async function (articleId) {
  this.savedArticles = this.savedArticles.filter(
    (a) => !a.articleId.equals(articleId)
  );
  await this.save();
};

// Method to retrieve all saved articles for a user
librarySchema.methods.getSavedArticles = function () {
  return this.savedArticles;
};

const Library = mongoose.model("Library", librarySchema, "libraries");

export default Library;
