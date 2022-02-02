const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const Schema = mongoose.Schema;
const movieSchema = new Schema(
  {
    id: { type: Number, default: 0 },
    title: String,
  },
  { collation: "License", versionKey: false }
);

movieSchema.plugin(autoIncrement.plugin, {
  model: "hws",
  field: "id",
  startAt: 1,
  increment: 1,
});

export const movies = mongoose.model("movie", movieSchema);
