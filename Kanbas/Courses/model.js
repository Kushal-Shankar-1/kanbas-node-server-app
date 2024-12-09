import mongoose from "mongoose";
import CourseSchema from "./schema.js";

const Course = mongoose.model("Course", CourseSchema);
export default Course;
