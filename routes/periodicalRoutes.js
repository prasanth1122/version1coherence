import express from "express";
import {
  createPeriodical,
  getPeriodicalById,
  getAllPeriodicals,
  createArticle,
  getArticleById,
  getAllArticles,
} from "../controllers/periodicalsController.js";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
const router = express.Router();

// Periodical routes
router.post(
  "/periodicals",
  authenticateJWT,
  authorizeRoles(["admin"]),
  createPeriodical
);
router.get("/periodicals/:id", authenticateJWT, getPeriodicalById);
router.get("/periodicals", authenticateJWT, getAllPeriodicals);

// Article routes
router.post(
  "/editorial",
  authenticateJWT,
  authorizeRoles(["admin"]),
  createArticle
);
router.get("/editorial/:id", authenticateJWT, getArticleById);
router.get("/editorial", authenticateJWT, getAllArticles);

export default router;
