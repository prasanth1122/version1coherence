import Periodical from "../models/articles/periodicalModel.js";
import Article from "../models/articles/articlesModel.js";

// POST: Create a new periodical
export const createPeriodical = async (req, res) => {
  try {
    const periodicalData = req.body;
    const periodical = new Periodical(periodicalData);
    await periodical.save();
    res.status(201).json({ success: true, data: periodical });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET: Get a specific periodical by ID
export const getPeriodicalById = async (req, res) => {
  try {
    const { id } = req.params;
    const periodical = await Periodical.findById(id);
    if (!periodical) {
      return res
        .status(404)
        .json({ success: false, message: "Periodical not found" });
    }
    res.status(200).json({ success: true, data: periodical });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET: Get all periodicals
export const getAllPeriodicals = async (req, res) => {
  try {
    const periodicals = await Periodical.find().populate("articles.articleId");
    res.status(200).json({ success: true, data: periodicals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST: Create a new article
export const createArticle = async (req, res) => {
  try {
    const articleData = req.body;
    const article = new Article(articleData);
    await article.save();
    res.status(201).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET: Get a specific article by ID
export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);
    if (!article) {
      return res
        .status(404)
        .json({ success: false, message: "Article not found" });
    }

    // Increment views for the article
    article.views = (article.views || 0) + 1;
    await article.save();

    // Increment views for the parent periodical
    const periodical = await Periodical.findById(article.periodicalId);
    if (periodical) {
      periodical.views = (periodical.views || 0) + 1;
      await periodical.save();
    }

    res.status(200).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET: Get all articles
export const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().populate("periodicalId");
    res.status(200).json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
