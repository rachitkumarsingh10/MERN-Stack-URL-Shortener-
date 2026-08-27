require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("dns");

// Use Google DNS for this Node.js application
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const urlRoutes = require("./routes/urlRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/urls", urlRoutes);

// Redirect routes
app.use("/r", urlRoutes);

app.get("/", (req, res) => {
  res.json({ message: "URL Shortener API is running 🚀" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });