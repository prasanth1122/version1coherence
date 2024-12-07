import express from "express";
import {
  likeArticle,
  dislikeArticle,
  checkArticleStatus,
  getLikedArticles,
} from "../controllers/likedislikeController.js";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
const router = express.Router();

// Like an article
router.post("/like", authenticateJWT, likeArticle);

// Dislike an article
router.post("/dislike", authenticateJWT, dislikeArticle);

// Check like/dislike status of an article
router.get("/status", authenticateJWT, checkArticleStatus);
router.get("/liked/:id", authenticateJWT, getLikedArticles);
export default router;
