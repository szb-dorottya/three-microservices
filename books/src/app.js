const express = require("express");
const Book = require("./models/books_model");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ msg: "ejasjdajdjhsbdjahdbasj" });
});

app.get("/api/books", async (req, res) => {
  const books = await Book.find({});
  res.json(books);
});

app.get("/api/book/:id", async (req, res) => {
  const books = await Book.findOne({ _id: req.params.id });
  res.json(books);
});

app.post("/api/books", async (req, res) => {
  const book = new Book({ ...req.body });
  const savedBook = await book.save();
  res.json(savedBook);
});

app.put("/api/book/:id", async (req, res) => {
  const resp = await Book.findOneAndUpdate(
    { _id: req.params.id },
    { ...req.body }
  )
    .then((resp) => {
      return res.json("ok");
    })
    .catch((err) => {
      return res.json(err);
    });
});

app.delete("/api/books", async (req, res) => {
  return await Book.deleteMany({}, (err, result) => {
    if (err) {
      return res.json(err);
    }
    return res.json(result);
  });
});

module.exports = app;
