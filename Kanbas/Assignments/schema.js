import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema({
  _id: String,
  title: String,
  course: String,
  description: String,
  points: Number,
  dueDate: String,
  availableDate: String,
  availableFrom: String,
  availableUntil: String,
  module: { type: String, default: null },
});

export default AssignmentSchema;
