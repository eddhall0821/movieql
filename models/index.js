const mongoose = require("mongoose");

const MONGO_URL = `mongodb://localhost:27017/test`;
// Connect to mongoDB
module.exports = () => {
  mongoose
    .connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("MongoDB Connected");
    })
    .catch((err) => {
      console.log(err);
    });
};
