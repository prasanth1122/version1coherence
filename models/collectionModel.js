import mongoose from "mongoose";

const articleInCollectionSchema = new mongoose.Schema({
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Article",
    required: true,
  },
  title: { type: String, required: true },
  category: { type: String, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  addedAt: { type: Date, default: Date.now }, // Timestamp when the article was added to the collection
});

const collectionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  collections: [
    {
      name: { type: String, required: true }, // Collection name
      articles: [articleInCollectionSchema], // Array of articles
      updatedTime: { type: Date, default: Date.now }, // Last updated time for this collection
    },
  ],
});

// Middleware to update `updatedTime` whenever articles are modified
collectionSchema.pre("save", function (next) {
  this.collections.forEach((collection) => {
    if (collection.isModified("articles")) {
      collection.updatedTime = Date.now(); // Update the time when articles are changed
    }
  });
  next();
});

const Collection = mongoose.model(
  "Collection",
  collectionSchema,
  "collections"
);

export default Collection;
