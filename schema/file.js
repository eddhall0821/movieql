const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const Schema = mongoose.Schema;
const fileSchema = new Schema(
  {
    // _id: mongoose.Schema.Types.ObjectId,
    id: Number,
    filename: String,
    ai_worked: { type: Boolean, default: false },
    worked: { type: Boolean, default: false },
    checked: { type: Boolean, default: false },

    original_width: { type: Number, default: 0 },
    original_height: { type: Number, default: 0 },

    work_assigned: { type: Boolean, default: false },
    check_assigned: { type: Boolean, default: false },

    worker: { type: String, default: "" },
    checker: { type: String, default: "" },

    ai_data: {
      type: [
        {
          x: Number,
          y: Number,
          width: Number,
          height: Number,
          rotate: Number,
          scaleX: Number,
          scaleY: Number,
          text: String,
        },
      ],
      default: [],
    },
    worker_data: {
      type: [
        {
          x: Number,
          y: Number,
          width: Number,
          height: Number,
          rotate: Number,
          scaleX: Number,
          scaleY: Number,
          text: String,
        },
      ],
      default: [],
    },
  },
  { collation: "License", versionKey: false }
);

export const files = mongoose.model("file", fileSchema);
