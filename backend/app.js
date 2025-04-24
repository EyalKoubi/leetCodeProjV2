const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRouter = require("./routes/authRoutes");
const adminRouter = require("./routes/adminRoutes");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/admin", adminRouter);

const dbURI = process.env.MONGO_URI;

const connectToDb = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log("✅ Connected to MongoDB");
    app.listen(3002, () => console.log("🚀 Server running on port 3002"));
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
  }
};

connectToDb();
