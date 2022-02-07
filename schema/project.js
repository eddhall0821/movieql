const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const Schema = mongoose.Schema;
const projectSchema = new Schema({
  id: Number,
  project_name: String,
  project_content: String,
  start_date: String,
  end_date: String,
  progress: { type: Number, default: 0 },
});

export const projects = mongoose.model("project", projectSchema);
