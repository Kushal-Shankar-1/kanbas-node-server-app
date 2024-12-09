import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    description: String,
    module: String,
  },
  { _id: false }
);
// _id is included in the document, but since we define it as String, no need for _id: false.
// If you prefer, you can also remove _id from Lesson and let MongoDB assign ObjectIds for lessons.
// But to keep consistent with current data, we keep them as strings.

const ModuleSchema = new mongoose.Schema({
  _id: String,
  name: String,
  description: String,
  course: String,
  lessons: [LessonSchema],
});

export default ModuleSchema;
