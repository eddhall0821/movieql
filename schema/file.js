const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const Schema = mongoose.Schema;
const fileSchema = new Schema(
  {
    id: Number,
    filename: String,
    ai_worked: { type: Boolean, default: false },
    worked: { type: Boolean, default: false },
    checked: { type: Boolean, default: false },

    work_assigned: { type: Boolean, default: false },
    check_assigned: { type: Boolean, default: false },

    worker: { type: String, default: "" },
    checker: { type: String, default: "" },

    ai_data: [
      {
        x: Number,
        y: Number,
        width: Number,
        height: Number,
        rotate: Number,
        scaleX: Number,
        scaleY: Number,
        text: String
      },
    ],
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
