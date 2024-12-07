import express from "express";
import { addComment } from "../controllers/commentController.js";
import { authenticateJWT } from "../middleware/authenticateJWT.js";

const router = express.Router();

router.post("/:articleId", authenticateJWT, addComment); // Protect route with authentication

export default router;
