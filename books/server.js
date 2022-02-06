const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const amqp = require("amqplib/callback_api");
const Video = require("./src/models/video_model");
const Image = require("./src/models/image_model");
const Book = require("./src/models/books_model");

const app = express();
app.use(bodyParser.json());

mongoose.connect(
  `mongodb://root:${process.env.SECRET_MONGODB_PASSWORD}@my-release-mymongo-mongodb.default.svc.cluster.local:27017`
);

const amqpServer = `amqps://xvholbwb:${process.env.SECRET_RABBITMQ_PASSWORD}@roedeer.rmq.cloudamqp.com/xvholbwb`;
//const amqpServer =
//  "amqp://user:jOKQTZe45D@my-release-rabbitmq.default.svc:5672";

amqp.connect(amqpServer, (err, connection) => {
  if (err) {
    throw err;
  }

  connection.createChannel((error, channel) => {
    if (error) {
      throw error;
    }

    channel.assertQueue("insert_video", { durable: false });
    channel.assertQueue("insert_image", { durable: false });
    channel.assertQueue("insert_book", { durable: false });

    channel.consume(
      "insert_video",
      async (msg) => {
        const result = JSON.parse(msg.content);
        const video = new Video({ ...result });
        const savedVideo = await video.save();
      },
      { noAck: true }
    );

    channel.consume(
      "insert_image",
      async (msg) => {
        const result = JSON.parse(msg.content);
        const image = new Image({ ...result });
        const savedImage = await image.save();
      },
      { noAck: true }
    );

    app.get("/", (req, res) => {
      res.json({ msg: "live" });
    });

    app.get("/api/books", async (req, res) => {
      const books = await Book.find({});
      res.json(books);
    });

    app.get("/api/video", async (req, res) => {
      const video = await Video.find({});
      res.json(video);
    });

    app.get("/api/image", async (req, res) => {
      const image = await Image.find({});
      res.json(image);
    });

    app.get("/api/book/:id", async (req, res) => {
      const books = await Book.findOne({ _id: req.params.id });
      res.json(books);
    });

    app.post("/api/books", async (req, res) => {
      const book = new Book({ ...req.body });
      const savedBook = await book.save();
      channel.sendToQueue(
        "insert_book",
        Buffer.from(JSON.stringify(savedBook))
      );
      res.json(savedBook);
    });

    app.put("/api/book/:id", async (req, res) => {
      const resp = await Book.findOneAndUpdate(
        { _id: req.params.id },
        { ...req.body }
      )
        .then(async (resp) => {
          const books = await Book.findOne({ _id: req.params.id });
          return res.json(books);
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

    app.listen(3000, () => {
      console.log("running on port 3000");
      console.log("--------------------------");
    });
  });
});
