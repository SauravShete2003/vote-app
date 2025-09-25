import User from "../models/User.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const postSignup = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Use findOne() instead of find()
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    const newUser = new User({ username, password });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

const postLogin = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // set session user
    req.session.user = { username };
    req.session.voted = req.session.voted || false;
    res.status(200).json({ message: "Login successful", user: { username }, voted: req.session.voted });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = req.session.user || null;
    const voted = !!req.session.voted;
    res.status(200).json({ user, voted, option: req.session.option || null });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching session', error: error.message });
  }
};

export { getAllUsers, postSignup, postLogin, getMe };
