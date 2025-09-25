import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
   
    sessionId: {
      type: String,
      required: true,
      unique: true, 
    },
    option: {
      type: String,
      required: true,
      enum: ["Option A", "Option B", "Option C"], 
    },

}, { timestamps: true });  

export default mongoose.model('Vote', voteSchema);