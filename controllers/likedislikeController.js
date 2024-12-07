import LikeDislike from "../models/likeDislikeModel.js";
import Article from "../models/articles/articlesModel.js";

export const likeArticle = async (req, res) => {
  try {
    const { userId, articleId } = req.body;

    // Fetch the article details
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Find or create LikeDislike document for the user
    let likeDislike = await LikeDislike.findOne({ userId });
    if (!likeDislike) {
      likeDislike = new LikeDislike({ userId, likes: [], dislikes: [] });
    }

    // Remove article from dislikes if present
    likeDislike.dislikes = likeDislike.dislikes.filter(
      (item) => item.articleId.toString() !== articleId
    );

    // Check if article is already liked
    const isAlreadyLiked = likeDislike.likes.some(
      (item) => item.articleId.toString() === articleId
    );

    if (!isAlreadyLiked) {
      // Add article to likes
      likeDislike.likes.push({
        articleId,
        title: article.title,
        category: article.category,
        month: article.month,
        year: article.year,
        likedAt: new Date(),
      });
    }

    await likeDislike.save();
    res.status(200).json({ message: "Article liked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const dislikeArticle = async (req, res) => {
  try {
    const { userId, articleId } = req.body;

    // Fetch the article details
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Find or create LikeDislike document for the user
    let likeDislike = await LikeDislike.findOne({ userId });
    if (!likeDislike) {
      likeDislike = new LikeDislike({ userId, likes: [], dislikes: [] });
    }

    // Remove article from likes if present
    likeDislike.likes = likeDislike.likes.filter(
      (item) => item.articleId.toString() !== articleId
    );

    // Check if article is already disliked
    const isAlreadyDisliked = likeDislike.dislikes.some(
      (item) => item.articleId.toString() === articleId
    );

    if (!isAlreadyDisliked) {
      // Add article to dislikes
      likeDislike.dislikes.push({
        articleId,
        title: article.title,
        category: article.category,
        month: article.month,
        year: article.year,
        dislikedAt: new Date(),
      });
    }

    await likeDislike.save();
    res.status(200).json({ message: "Article disliked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkArticleStatus = async (req, res) => {
  try {
    const { userId, articleId } = req.query;

    // Fetch the LikeDislike document for the user
    const likeDislike = await LikeDislike.findOne({ userId });

    if (!likeDislike) {
      return res.status(200).json({ status: "neither" });
    }

    // Check if article is liked or disliked
    const isLiked = likeDislike.likes.some(
      (item) => item.articleId.toString() === articleId
    );
    const isDisliked = likeDislike.dislikes.some(
      (item) => item.articleId.toString() === articleId
    );

    if (isLiked) {
      return res.status(200).json({ status: "liked" });
    }
    if (isDisliked) {
      return res.status(200).json({ status: "disliked" });
    }

    return res.status(200).json({ status: "neither" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLikedArticles = async (req, res) => {
  try {
    const userId = req.params.id; // Extract userId from params
    const likeDislike = await LikeDislike.findOne({ userId }).populate(
      "likes.articleId"
    );

    if (!likeDislike || likeDislike.likes.length === 0) {
      return res.status(200).json({ message: "No liked articles found" });
    }

    res.status(200).json({ likedArticles: likeDislike.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
