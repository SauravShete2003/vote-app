import mongoose from "mongoose";
import User from "../models/User.js";  // Import User model
import inMemoryDB from "../utils/inMemoryDB.js";

let io = null;
const setIo = (ioInstance) => {
  io = ioInstance;
};

// Compute totals from Mongo OR fallback
const computeTotals = async () => {
  if (mongoose.connection.readyState === 1) {
    try {
      const users = await User.find({ voted: true });
      const totals = { "Option A": 0, "Option B": 0, "Option C": 0 };
      users.forEach((u) => {
        if (u.voteOption) totals[u.voteOption] += 1;
      });
      return totals;
    } catch (err) {
      return inMemoryDB.computeTotals();
    }
  } else {
    return inMemoryDB.computeTotals();
  }
};

// ✅ Vote endpoint per-user
const postVote = async (req, res) => {
  try {
    const { option } = req.body;
    const userSession = req.session.user;

    if (!userSession || !userSession.username) {
      return res.status(401).json({ message: "⚠️ You must be logged in to vote!" });
    }

    // If Mongo is connected
    if (mongoose.connection.readyState === 1) {
      let user = await User.findOne({ username: userSession.username });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if already voted
      if (user.voted) {
        return res.status(400).json({ message: "❌ You have already voted!" });
      }

      // Record vote for this user
      user.voted = true;
      user.voteOption = option;
      await user.save();

      const currentResults = await computeTotals();
      if (io) io.emit("voteUpdate", { results: currentResults, lastUpdated: new Date() });

      return res.status(201).json({
        message: "✅ Vote recorded successfully!",
        user: { username: user.username, option },
        currentResults,
      });
    }

    // ---- In-memory fallback if Mongo isn't running
    let user = await inMemoryDB.findUser({ username: userSession.username });
    if (!user) {
      return res.status(404).json({ message: "User not found (in-memory)" });
    }

    if (user.voted) {
      return res.status(400).json({ message: "❌ You have already voted!" });
    }

    user.voted = true;
    user.voteOption = option;
    await inMemoryDB.updateUser(user);

    const currentResults = await inMemoryDB.computeTotals();
    if (io) io.emit("voteUpdate", { results: currentResults, lastUpdated: new Date() });

    return res.status(201).json({
      message: "✅ Vote recorded successfully! (in-memory)",
      user: { username: user.username, option },
      currentResults,
    });
  } catch (error) {
    res.status(500).json({ message: "⚠️ Problem recording your vote", error: error.message });
  }
};

// Get Votes (debug/admin use)
const getVotes = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const users = await User.find({ voted: true });
      return res.status(200).json(users.map(u => ({ username: u.username, voteOption: u.voteOption })));
    } else {
      const votes = await inMemoryDB.getVotes();
      return res.status(200).json(votes);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching votes", error: error.message });
  }
};

// Results API
const getResults = async (req, res) => {
  try {
    const totals = await computeTotals();
    res.status(200).json({ totals, lastUpdated: new Date() });
  } catch (error) {
    res.status(500).json({ message: "Error fetching results", error: error.message });
  }
};

export { postVote, getVotes, getResults, setIo };