import Article from "../models/articles/coherenceSchema.js";

// Get all articles (public)
export const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch articles", error: err });
  }
};

// Get specific article (public)
export const getArticleById = async (req, res) => {
  const { id } = req.params;

  try {
    const article = await Article.findById(id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    // Increment the views count by 1
    article.views += 1;

    // Save the updated article document
    await article.save();
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({ message: "Error fetching article", error: err });
  }
};

// Create new article (admin-only)
export const createArticle = async (req, res) => {
  try {
    const newArticle = await Article.create(req.body);
    res.status(201).json(newArticle);
  } catch (err) {
    res.status(500).json({ message: "Error creating article", error: err });
  }
};

// Update article (admin-only)
// Update article (admin-only)
export const updateArticle = async (req, res) => {
  const { id } = req.params;

  try {
    // Find and update the article by ID
    const updatedArticle = await Article.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated article
      runValidators: true, // Enforce schema validation
    });

    if (!updatedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Handle sub-article updates if parentArticle changes
    if (req.body.parentArticle) {
      const subArticleData = {
        articleId: updatedArticle._id,
        title: updatedArticle.title,
        category: updatedArticle.category,
        content: updatedArticle.content,
      };

      await Article.findByIdAndUpdate(
        req.body.parentArticle,
        {
          $push: { subArticles: subArticleData },
          $inc: { subArticlesCount: 1 },
        },
        { new: true }
      );
    }

    res.status(200).json(updatedArticle);
  } catch (err) {
    res.status(500).json({ message: "Error updating article", error: err });
  }
};

// Delete article (admin-only)
export const deleteArticle = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the article to delete
    const articleToDelete = await Article.findById(id);
    if (!articleToDelete) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Delete all sub-articles if it's a monthly edition
    if (articleToDelete.isMonthlyEdition) {
      const subArticleIds = articleToDelete.subArticles.map(
        (subArticle) => subArticle.articleId
      );

      if (subArticleIds.length > 0) {
        await Article.deleteMany({ _id: { $in: subArticleIds } });
      }
    }

    // Delete the article itself
    await Article.findByIdAndDelete(id);

    // If it's a sub-article, update the parent article's subArticles array
    if (articleToDelete.parentArticle) {
      await Article.findByIdAndUpdate(articleToDelete.parentArticle, {
        $pull: { subArticles: { articleId: id } },
        $inc: { subArticlesCount: -1 },
      });
    }

    res.status(200).json({
      message: "Article and related sub-articles deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Error deleting article", error: err });
  }
};
