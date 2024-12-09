import mongoose from "mongoose";
import ModuleSchema from "./schema.js";

const Module = mongoose.model("Module", ModuleSchema);
export default Module;
