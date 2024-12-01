import express from "express";
import {
  adminLogin,
  deleteUser,
  getAllUsers,
  login,
} from "../controllers/users/login.js";
import { logout } from "../controllers/users/logoutController.js";
import { checkEmail, signup } from "../controllers/users/signup.js";
import { refreshToken } from "../controllers/users/refreshTokenController.js"; // Import the refresh token controller
import { authenticateRefreshToken } from "../middleware/refreshTokenAuth.js"; // Import the refresh token middleware
import {
  requestPasswordReset,
  resetPassword,
} from "../controllers/users/passwordController.js";
import { authenticateJWT } from "../middleware/authenticateJWT.js"; // Middleware for JWT
import { authorizeRoles } from "../middleware/authorizeRoles.js"; // Middleware for role-based access

const router = express.Router();

// User routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/adminlogin", adminLogin);
router.delete("/:userId", authenticateJWT, deleteUser);
router.post("/checkemail", checkEmail);

// Refresh token route
router.post("/refreshtoken", authenticateRefreshToken, refreshToken);
router.get(
  "/allusers",
  authenticateJWT,
  authorizeRoles(["admin"]),
  getAllUsers
);
// Password reset routes
router.post("/request-password-reset", requestPasswordReset); // Route to request password reset
router.post("/reset-password", resetPassword); // Route to reset password

export default router;
