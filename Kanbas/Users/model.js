import mongoose from "mongoose";
import schema from "./schema.js";

// Create a Mongoose model from the user schema
const model = mongoose.model("UserModel", schema);

// Export the model
export default model;
