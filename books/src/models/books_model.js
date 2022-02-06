const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: String,
  author: String,
  year: Number,
  type: { type: String, default: "book" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.connection.useDb("book").model("Book", BookSchema);
