const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  name: String,
  url: String,
  type: { type: String, default: "image" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.connection
  .useDb("images")
  .model("Image", ImageSchema);
