import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import session from 'express-session';

import { getAllUsers , postLogin , postSignup, getMe } from './controllers/user.js';
import {postVote, getVotes, getResults, setIo } from './controllers/vote.js';

const app = express();
const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URL);
  if (conn) {
    console.log("MongoDB Connected✅");
  }
};

connectDB();

// HTTP server so we can attach socket.io
const server = http.createServer(app);

// Simple in-memory session for dev. In production use connect-mongo or redis store.
const sess = session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false, // set true if using HTTPS in production
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  }
});

// Enable CORS for frontend with credentials
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(sess);

// Socket.IO
const io = new IOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

// expose io to controllers
setIo(io);

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// API routes
app.get('/api/users', getAllUsers);
app.post('/api/signup', postSignup);
app.post('/api/login', postLogin);
app.get('/api/me', getMe);
app.post('/api/vote', postVote);
app.get('/api/results', getResults);

app.use('/health', (req, res) => {
    res.send('Server is healthy');
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
