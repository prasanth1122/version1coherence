import User from "../models/userModel.js"; // Assuming you have a User schema
import Article from "../models/articles/coherenceSchema.js";
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, text } = req.body;

    if (!userId || !text) {
      return res
        .status(400)
        .json({ message: "User ID and comment text are required." });
    }

    // Validate if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ message: "Article not found." });
    }

    const newComment = {
      userId,
      userName: user.name,
      text,
      createdAt: new Date(),
    };
    article.comments.push(newComment);
    article.commentCount = article.comments.length;

    await article.save();

    res
      .status(201)
      .json({ message: "Comment added successfully.", comment: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res
      .status(500)
      .json({ message: "An error occurred while adding the comment." });
  }
};
