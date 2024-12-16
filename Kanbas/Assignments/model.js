import mongoose from "mongoose";
import AssignmentSchema from "./schema.js";

const Assignment = mongoose.model("Assignment", AssignmentSchema);
export default Assignment;
