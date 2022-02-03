const app = require("./src/app");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL);

app.listen(3000, () => {
  console.log("running on port 3000");
  console.log("--------------------------");
});
