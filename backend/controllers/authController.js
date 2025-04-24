const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "Eyal0509596599Koubi!@#";
const ADMIN_EMAIL = "eyal4845@gmail.com";
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ fullName, email, password });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔍 Attempting login for:", email);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found!");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("✅ User found:", user.email);
    console.log("🔐 Hashed password in DB:", user.password);
    console.log("🔑 Password provided:", password);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, fullName: user.fullName },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, role: user.role, userId: user._id });
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const updateNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { notificationsEnabled } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { notificationsEnabled },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `Notifications have been ${
        notificationsEnabled ? "enabled" : "disabled"
      } successfully.`,
      user,
    });
  } catch (error) {
    console.error("❌ Error updating notifications:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      _id: user._id,
      notificationsEnabled: user.notificationsEnabled || false,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const newPassword = Math.floor(100000 + Math.random() * 900000).toString();
    user.password = newPassword;
    await user.save();

    const msg = {
      to: email,
      from: process.env.SENDGRID_EMAIL,
      subject: "Your new temporary password",
      html: `
        <h2>Hello ${user.fullName || ""},</h2>
        <p>You requested a password reset.</p>
        <p>Your new temporary password is:</p>
        <h3>${newPassword}</h3>
        <p>Please log in and change your password if needed.</p>
      `,
    };

    // ✨ הכי חשוב:
    try {
      await sgMail.send(msg);
      console.log("📨 Email sent to:", email);
    } catch (sendErr) {
      console.error("❌ SendGrid failed:", sendErr.response?.body || sendErr);
    }

    res.status(200).json({ message: "Temporary password sent to email." });
  } catch (error) {
    console.error("❌ Error in forgotPassword:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateNotifications,
  getUserProfile,
  forgotPassword,
};
