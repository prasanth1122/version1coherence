import express from "express";
import {
  addArticleToCollection,
  getAllCollectionsForUser,
  getCollectionByIdForUser,
  getCollectionByName,
  getCollectionNamesForUser,
  isArticleSavedInAnyCollection,
} from "../controllers/collectionController.js";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
const router = express.Router();

// Routes
router.post("/addarticle", authenticateJWT, addArticleToCollection);
router.get(
  "/allcollections/:userId",
  authenticateJWT,
  getAllCollectionsForUser
);
router.get(
  "/collections/:userId/:collectionName",
  authenticateJWT,
  getCollectionByName
);
router.get(
  "/collectionnames/:userId",
  authenticateJWT,
  getCollectionNamesForUser
);
router.get(
  "/is-article-saved/:userId/:articleId",
  authenticateJWT,
  isArticleSavedInAnyCollection
);
router.get("/:userid/:collectionid", authenticateJWT, getCollectionByIdForUser);
export default router;
