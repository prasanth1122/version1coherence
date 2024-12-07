// controllers/commentController.js
import Article from "../models/articles/articlesModel.js"; // Path to your article model
import User from "../models/userModel.js"; // Path to your user model

// controllers/commentController.js

export const addComment = async (req, res) => {
  try {
    const { articleId } = req.params; // Ensure articleId is coming from params
    const { userId, text } = req.body; // User ID and comment text

    // Debugging statements
    console.log("Request Params articleId:", articleId); // Debug
    console.log("Request Body:", req.body); // Debug

    if (!userId || !text) {
      return res
        .status(400)
        .json({ message: "User ID and comment text are required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found for ID:", userId); // Debug
      return res.status(404).json({ message: "User not found." });
    }

    const article = await Article.findById(articleId); // Ensure articleId is used here
    if (!article) {
      console.log("Article not found for ID:", articleId); // Debug
      return res.status(404).json({ message: "Article not found." });
    }

    const newComment = {
      articleId, // Ensure articleId is set here
      userId,
      username: user.name,
      text,
      createdAt: new Date(),
    };

    // Add comment to article
    article.comments.push(newComment);
    article.commentCount = article.comments.length; // Update comment count

    await article.save();

    // Send response with newly added comment
    res
      .status(201)
      .json({ message: "Comment added successfully.", comment: newComment });
  } catch (error) {
    console.error("Error adding comment:", error); // Debugging statement
    res
      .status(500)
      .json({ message: "An error occurred while adding the comment." });
  }
};
