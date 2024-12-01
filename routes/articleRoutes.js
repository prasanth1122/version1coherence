import express from "express";
import {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/articlesController.js";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { checkSubscription } from "../middleware/subscriptionCheck.js";
import CoherenceArticles from "../models/articles/coherenceSchema.js";
const router = express.Router();

// Public Routes
router.get("/", authenticateJWT, getAllArticles); // Public articles endpoint

// Protected Routes for Article Viewing
router.get(
  "/:id",
  authenticateJWT,
  async (req, res, next) => {
    try {
      const articleId = req.params.id;
      const article = await CoherenceArticles.findById(articleId);

      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      // Skip the subscription check for now
      req.article = article; // Pass the article to the next handler
      next();
    } catch (err) {
      res.status(500).json({
        message: "Error validating article access level.",
        error: err.message,
      });
    }
  },
  authenticateJWT,
  getArticleById // This will now run without `checkSubscription`
);

// Protected Routes (Admin Only)
router.post("/", authenticateJWT, authorizeRoles(["admin"]), createArticle);
router.put("/:id", authenticateJWT, authorizeRoles(["admin"]), updateArticle);

router.delete(
  "/:id",
  authenticateJWT,
  authorizeRoles(["admin"]),
  deleteArticle
);

export default router;
