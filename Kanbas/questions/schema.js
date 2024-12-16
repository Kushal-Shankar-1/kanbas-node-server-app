import mongoose from "mongoose";
const questionsSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: String,
    type: String,
    description: String,
    answer: [String],
    options: [String],
    quizId: String,
    points: Number,
  },
  { collection: "questions" }
);
export default questionsSchema;
