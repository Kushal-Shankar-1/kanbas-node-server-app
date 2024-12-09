import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  _id: String,
  username: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
  email: String,
  dob: String,
  role: String,
  loginId: String,
  section: String,
  lastActivity: String,
  totalActivity: String,
});

export default UserSchema;
