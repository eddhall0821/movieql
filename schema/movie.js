const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    id: { type: Number, default: 0 },
    title: String,
  },
  { collation: "License", versionKey: false }
);

userSchema.plugin(autoIncrement.plugin, {
  model: "hws",
  field: "id",
  startAt: 1,
  increment: 1,
});

export const movies = mongoose.model("movie", userSchema);
