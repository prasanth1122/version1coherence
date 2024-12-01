import express from "express";
import {
  saveArticle,
  getSavedArticles,
  unsaveArticle,
  isArticleSaved,
} from "../controllers/libraryController.js";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
const router = express.Router();

router.post("/:userId/save", authenticateJWT, saveArticle);

// Route to get all saved articles
router.get("/:userId/savedarticles", authenticateJWT, getSavedArticles);

// Route to unsave an article
router.delete("/:userId/unsave", authenticateJWT, unsaveArticle);
router.get(
  "/checkSavedArticle/:userId/:articleId",
  authenticateJWT,
  isArticleSaved
);
export default router;
