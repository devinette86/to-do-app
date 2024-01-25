import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  complete: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Task", TaskSchema);
