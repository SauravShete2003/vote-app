import User from "../models/User.js";
import inMemoryDB from "../utils/inMemoryDB.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide passwords in API response
    return res.status(200).json(users);
  } catch (err) {
    const users = await inMemoryDB.getAllUsers();
    return res.status(200).json(users);
  }
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  try {
    // -----------------
    // 1. Try MongoDB first
    // -----------------
    let user = await User.findOne({ username });

    if (user) {
      // ✅ Check plain text password
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Success login
      req.session.user = { id: user._id, username: user.username };
      req.session.voted = req.session.voted || false;

      return res.status(200).json({
        message: "Login successful",
        user: { username: user.username },
        voted: req.session.voted,
      });
    }

    // -----------------
    // 2. If user doesn't exist → create new one
    // -----------------
    user = new User({ username, password });
    await user.save();

    req.session.user = { id: user._id, username: user.username };
    req.session.voted = false;

    return res.status(201).json({
      message: "New user created & logged in",
      user: { username: user.username },
      voted: false,
    });
  } catch (dbError) {
    console.error("⚠ MongoDB failed, falling back to in-memory:", dbError);

    // -----------------
    // 3. Fallback: inMemoryDB
    // -----------------
    try {
      let user = await inMemoryDB.findUser({ username });

      if (!user) {
        user = await inMemoryDB.createUser({ username, password });
        req.session.user = { username: user.username };
        req.session.voted = false;
        return res.status(201).json({
          message: "New user created & logged in (in-memory)",
          user: { username: user.username },
          voted: false,
        });
      }

      // Validate password
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials (in-memory)" });
      }

      req.session.user = { username: user.username };
      req.session.voted = req.session.voted || false;

      return res.status(200).json({
        message: "Login successful (in-memory)",
        user: { username: user.username },
        voted: req.session.voted,
      });
    } catch (fallbackErr) {
      return res.status(500).json({
        message: "Login error (in-memory)",
        error: fallbackErr.message,
      });
    }
  }
};

export const getMe = async (req, res) => {
  try {
    const user = req.session.user || null;
    const voted = !!req.session.voted;
    res.status(200).json({ user, voted, option: req.session.option || null });
  } catch (error) {
    res.status(500).json({ message: "Error fetching session", error: error.message });
  }
};