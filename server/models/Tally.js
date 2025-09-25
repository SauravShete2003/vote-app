// models/Tally.js
import mongoose from "mongoose";

const tallySchema = new mongoose.Schema(
  {
    optionA: {
      type: Number,
      default: 0,
    },
    optionB: {
      type: Number,
      default: 0,
    },
    optionC: {
      type: Number,
      default: 0,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

const Tally = mongoose.model("Tally", tallySchema);
export default Tally;
