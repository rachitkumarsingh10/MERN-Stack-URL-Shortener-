const express = require("express");
const router = express.Router();

const Url = require("../models/Url");
const { nanoid } = require("nanoid");

router.post("/", async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: "originalUrl is required" });
  }

  try {
    new URL(originalUrl);
  } catch (_) {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  try {
    const shortCode = nanoid(6);
    const shortUrl = `${process.env.BASE_URL}/r/${shortCode}`;

    const newUrl = new Url({
      originalUrl,
      shortCode,
      shortUrl,
    });

    const savedUrl = await newUrl.save();

    res.status(201).json(savedUrl);
  } catch (err) {
    console.error("Error creating short URL:", err.message);
    res.status(500).json({ error: "Server error while creating URL" });
  }
});

router.get("/", async (req, res) => {
  try {
    const urls = await Url.find({}).sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    console.error("Error fetching URLs:", err.message);
    res.status(500).json({ error: "Server error while fetching URLs" });
  }
});

router.get("/:code", async (req, res) => {
  const { code } = req.params;

  try {
    const urlDoc = await Url.findOne({ shortCode: code });

    if (!urlDoc) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    urlDoc.clicks += 1;
    await urlDoc.save();

    res.redirect(urlDoc.originalUrl);
  } catch (err) {
    console.error("Error during redirect:", err.message);
    res.status(500).json({ error: "Server error during redirect" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Url.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "URL not found" });
    }

    res.json({ message: "URL deleted successfully" });
  } catch (err) {
    console.error("Error deleting URL:", err.message);
    res.status(500).json({ error: "Server error while deleting URL" });
  }
});

module.exports = router;
