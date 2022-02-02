const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const Schema = mongoose.Schema;
const fileSchema = new Schema(
  {
    // id: { type: Number, default: 0 },
    filename: String,
  },
  { collation: "License", versionKey: false }
);

// fileSchema.plugin(autoIncrement.plugin, {
//   model: "hws",
//   field: "id",
//   startAt: 1,
//   increment: 1,
// });

export const files = mongoose.model("file", fileSchema);
