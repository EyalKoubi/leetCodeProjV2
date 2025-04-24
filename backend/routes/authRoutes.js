const express = require("express");
const {
  registerUser,
  loginUser,
  updateNotifications,
  getUserProfile,
  forgotPassword,
} = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.put("/notifications/:userId", updateNotifications);
authRouter.get("/user/profile", authMiddleware, getUserProfile);
authRouter.post("/reset-password", forgotPassword);

module.exports = authRouter;
