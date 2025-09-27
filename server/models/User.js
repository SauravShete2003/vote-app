import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    voted: { type: Boolean, default: false },
    voteOption: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);