import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema({
  _id: String,
  user: String,
  course: String,
});

export default EnrollmentSchema;
