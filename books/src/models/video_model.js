const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VideoSchema = new Schema({
  title: String,
  url: String,
  length: Number,
  type: { type: String, default: "video" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.connection
  .useDb("videos")
  .model("Video", VideoSchema);
