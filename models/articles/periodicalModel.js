import mongoose from "mongoose";

const periodicalSchema = new mongoose.Schema({
  image: { type: String, required: true }, // Cloud storage link
  title: { type: String, required: true }, // Title of the periodical
  category: { type: String, required: true }, // Category the periodical belongs to
  month: { type: Number, required: true }, // Publishing month
  year: { type: Number, required: true }, // Publishing year
  views: { type: Number, default: 0 }, // Number of views
  subscription: { type: String, required: true },
  author: { type: String, required: true },
  introduction: { type: String, required: true }, // Introduction of the periodical
  valueProposition: { type: String, required: true }, // Value proposition statement
  articles: [
    {
      articleId: { type: mongoose.Schema.Types.ObjectId, ref: "Article" }, // Reference to the Article schema
      title: { type: String, required: true }, // Title of the article
      image: { type: String, required: true }, // Image link for the article
      category: { type: String, required: true }, // Area or category of the article
      month: { type: Number, required: true }, // Month of the article
      year: { type: Number, required: true }, // Year of the article
      author: { type: String, required: true },
      valueProposition: { type: String, required: true }, // Value proposition statement of the article
    },
  ],
});

const Periodical = mongoose.model(
  "Periodical",
  periodicalSchema,
  "Periodicals"
);
export default Periodical; // ES6 export
