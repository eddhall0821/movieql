const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userSchema = new Schema({
  id: Number,
  title: String,
});

export const tests = mongoose.model("test", userSchema);