const mongoose = require("mongoose");

const MONGO_URL = `mongodb+srv://admin:admin@cluster0.oxqrg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
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
