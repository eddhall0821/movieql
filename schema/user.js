const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userSchema = new Schema({
  id: Number,
  userId: String,
  nickname: String,
  passwordHash: String,
  role: String,
  token: String,
});

export const users = mongoose.model("user", userSchema);
