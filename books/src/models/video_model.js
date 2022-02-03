const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VideoSchema = new Schema({
  title: String,
  url: String,
  type: { type: String, default: "book" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.connection
  .useDb("videos")
  .model("Video", VideoSchema);
