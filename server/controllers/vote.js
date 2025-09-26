import Vote from "../models/Vote.js";
import inMemoryDB from "../utils/inMemoryDB.js";

let io = null;
const setIo = (ioInstance) => {
  io = ioInstance;
};

// Helper to compute totals, prefers Mongo then falls back to memory
const computeTotals = async () => {
  try {
    // If mongoose model is usable, use aggregation
    if (Vote && Vote.aggregate) {
      const agg = await Vote.aggregate([
        { $group: { _id: "$option", count: { $sum: 1 } } },
      ]);
      const totals = { "Option A": 0, "Option B": 0, "Option C": 0 };
      agg.forEach((row) => {
        totals[row._id] = row.count;
      });
      return totals;
    }
  } catch (err) {
    // fall through to in-memory
  }
  return inMemoryDB.computeTotals();
};

const postVote = async (req, res) => {
  try {
    const voterSessionId = req.sessionID;
    const { option } = req.body;

    // Try MongoDB first
    try {
      if (Vote && Vote.findOne) {
        const existingVote = await Vote.findOne({ sessionId: voterSessionId });
        if (existingVote) {
          return res.status(400).json({ message: "❌ You have already voted! Each person can only vote once." });
        }
        const newVote = new Vote({ sessionId: voterSessionId, option });
        await newVote.save();
        req.session.voted = true;
        req.session.option = option;
        const currentResults = await computeTotals();
        if (io) io.emit("voteUpdate", { results: currentResults, lastUpdated: new Date() });
        return res.status(201).json({ message: "✅ Vote recorded successfully!", vote: newVote, currentResults });
      }
    } catch (err) {
      // if mongo errors, fall back to in-memory
    }

    // In-memory fallback
    const existing = await inMemoryDB.findVoteBySessionId(voterSessionId);
    if (existing) {
      return res.status(400).json({ message: "❌ You have already voted! Each person can only vote once." });
    }
    const newVote = await inMemoryDB.saveVote({ sessionId: voterSessionId, option });
    req.session.voted = true;
    req.session.option = option;
    const currentResults = await inMemoryDB.computeTotals();
    if (io) io.emit("voteUpdate", { results: currentResults, lastUpdated: new Date() });
    return res.status(201).json({ message: "✅ Vote recorded successfully! (in-memory)", vote: newVote, currentResults });
  } catch (error) {
    res.status(500).json({ message: "⚠️ Sorry, there was a problem recording your vote", error: error.message });
  }
};

const getVotes = async (req, res) => {
  try {
    try {
      if (Vote && Vote.find) {
        const votes = await Vote.find();
        return res.status(200).json(votes);
      }
    } catch (err) {
      // fall back
    }
    const votes = await inMemoryDB.getVotes();
    res.status(200).json(votes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching votes", error: error.message });
  }
};

const getResults = async (req, res) => {
  try {
    const totals = await computeTotals();
    res.status(200).json({ totals, lastUpdated: new Date() });
  } catch (error) {
    res.status(500).json({ message: "Error fetching results", error: error.message });
  }
};

export { postVote, getVotes, getResults, setIo };
