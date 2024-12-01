import Library from "../models/libraryModel.js";

// Save an article
export const saveArticle = async (req, res) => {
  const { userId } = req.params; // Extract from URL params
  const { articleId, title, category, month, year, isMonthlyEdition } =
    req.body;

  try {
    let library = await Library.findOne({ userId });

    if (!library) {
      library = new Library({ userId, savedArticles: [] });
    }

    await library.saveArticle(
      articleId,
      title,
      category,
      month,
      year,
      isMonthlyEdition
    );
    res.status(200).json({ message: "Article saved successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get saved articles
export const getSavedArticles = async (req, res) => {
  const { userId } = req.params;

  try {
    const library = await Library.findOne({ userId });

    if (!library) {
      return res.status(200).json({ message: "No saved articles found." });
    }

    res.status(200).json(library.getSavedArticles());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check if an article is saved by the user
export const isArticleSaved = async (req, res) => {
  const { userId, articleId } = req.params;

  try {
    const library = await Library.findOne({ userId });

    if (!library) {
      return res.status(200).json({ message: "Article not saved" });
    }

    // Check if the article is in the saved articles list
    const isSaved = library.savedArticles.some((article) =>
      article.articleId.equals(articleId)
    );

    if (isSaved) {
      return res.status(200).json({ message: "Article is saved." });
    } else {
      return res.status(200).json({ message: "Article is not saved." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Unsave an article
export const unsaveArticle = async (req, res) => {
  const { userId, articleId } = req.body;

  try {
    const library = await Library.findOne({ userId });

    if (!library) {
      return res.status(404).json({ message: "No saved articles found." });
    }

    await library.unsaveArticle(articleId);
    res.status(200).json({ message: "Article unsaved successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
