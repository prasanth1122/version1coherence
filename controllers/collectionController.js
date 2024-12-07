import Collection from "../models/collectionModel.js"; // Update the path based on your file structure
import Article from "../models/articles/articlesModel.js"; // Update the path based on your file structure

export const addArticleToCollection = async (req, res) => {
  try {
    const { userId, collectionName, articleId } = req.body;

    if (!userId || !collectionName || !articleId) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Find the user's collections
    let userCollections = await Collection.findOne({ userId });

    if (!userCollections) {
      // Create a new collection entry if none exists
      userCollections = new Collection({ userId, collections: [] });
    }

    // Check if the collection exists
    let collection = userCollections.collections.find(
      (col) => col.name === collectionName
    );

    if (!collection) {
      // Add a new collection if it doesn't exist
      collection = { name: collectionName, articles: [] };
      userCollections.collections.push(collection);

      // Save the collection after creation
      await userCollections.save();
    }

    // Fetch the article details
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Check if the article already exists in the collection
    const isArticleExists = collection.articles.some(
      (art) => art.articleId.toString() === articleId
    );

    if (isArticleExists) {
      return res
        .status(400)
        .json({ message: "Article already exists in the collection" });
    }

    // Populate article data into the collection
    collection.articles.push({
      articleId: article._id,
      title: article.title,
      category: article.category,
      month: article.month,
      year: article.year,
      addedAt: new Date(), // Current timestamp
    });

    // Update the collection
    await userCollections.save();

    res
      .status(200)
      .json({ message: "Article added to collection successfully" });
  } catch (error) {
    console.error("Error in addArticleToCollection:", error);
    res.status(500).json({ message: "Error adding article to collection" });
  }
};

// Get all collection data for a user
export const getAllCollectionsForUser = async (req, res) => {
  try {
    const { userId } = req.params; // Expect userId in params

    const userCollections = await Collection.findOne({ userId });

    if (!userCollections) {
      return res.status(200).json({ message: "No collections found for user" });
    }

    res.status(200).json(userCollections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving collections" });
  }
};

// Get specific collection data by collection name for a user
export const getCollectionByName = async (req, res) => {
  try {
    const { userId, collectionName } = req.params; // Expect userId and collectionName in params

    const userCollections = await Collection.findOne({ userId });

    if (!userCollections) {
      return res.status(404).json({ message: "No collections found for user" });
    }

    const collection = userCollections.collections.find(
      (col) => col.name === collectionName
    );

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    res.status(200).json(collection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving collection" });
  }
};

// Get all collection names for a user
export const getCollectionNamesForUser = async (req, res) => {
  try {
    const { userId } = req.params; // Expect userId in params

    const userCollections = await Collection.findOne({ userId });

    if (!userCollections) {
      return res.status(201).json({ message: "No collections found for user" });
    }

    // Extract collection names
    const collectionNames = userCollections.collections.map((col) => col.name);

    res.status(200).json({ collectionNames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving collection names" });
  }
};

// Check if an article is saved in any collection
export const isArticleSavedInAnyCollection = async (req, res) => {
  try {
    const { userId, articleId } = req.params; // Expect userId and articleId in params

    // Find the user's collections
    const userCollections = await Collection.findOne({ userId });

    if (!userCollections) {
      return res.status(404).json({ message: "No collections found for user" });
    }

    // Check if the article exists in any collection
    const isArticleSaved = userCollections.collections.some((collection) =>
      collection.articles.some(
        (article) => article.articleId.toString() === articleId
      )
    );

    if (isArticleSaved) {
      return res
        .status(200)
        .json({ message: "Article is saved in a collection", saved: true });
    } else {
      return res.status(200).json({
        message: "Article is not saved in any collection",
        saved: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error checking article status" });
  }
};



// Get collection data by collection _id for a specific user
export const getCollectionByIdForUser = async (req, res) => {
    try {
      const { userId, collectionId } = req.params; // Expect userId and collectionId in params
  
      // Find the user's collections
      const userCollections = await Collection.findOne({ userId });
  
      if (!userCollections) {
        return res.status(404).json({ message: "No collections found for user" });
      }
  
      // Find the specific collection by its _id
      const collection = userCollections.collections.find(
        (col) => col._id.toString() === collectionId
      );
  
      if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
      }
  
      res.status(200).json(collection);
    } catch (error) {
      console.error("Error fetching collection by ID for user:", error);
      res.status(500).json({ message: "Error retrieving collection" });
    }
  };
  