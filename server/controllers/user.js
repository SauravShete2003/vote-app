import User from "../models/User.js";
import inMemoryDB from "../utils/inMemoryDB.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json(users);
  } catch (err) {
    const users = await inMemoryDB.getAllUsers();
    return res.status(200).json(users);
  }
};

export const postSignup = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Username and password required" });

    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    return res
      .status(201)
      .json({ message: "User created successfully", user: { username } });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

export const postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    req.session.user = { id: user._id, username: user.username };
    req.session.voted = req.session.voted || false;

    return res.status(200).json({
      message: "Login successful",
      user: { username: user.username },
      voted: req.session.voted,
    });
  } catch (error) {
    return res.status(500).json({ message: "Login error", error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = req.session.user || null;
    const voted = !!req.session.voted;
    res
      .status(200)
      .json({ user, voted, option: req.session.option || null });
  } catch (error) {
    res.status(500).json({ message: "Error fetching session", error: error.message });
  }
};