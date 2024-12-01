import express from "express";
import { addComment } from "../controllers/commentsController.js";
import { authenticateJWT } from "../middleware/authenticateJWT.js";
const router = express.Router();

// Route to add a comment to an article
router.post("/:id", authenticateJWT, addComment);

export default router;
