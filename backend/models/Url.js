const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
      trim: true,
    },

    shortCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    shortUrl: {
      type: String,
      required: true,
    },

    clicks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Url", UrlSchema);