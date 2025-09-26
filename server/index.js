import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import session from 'express-session';

import { getAllUsers , postLogin , getMe } from './controllers/user.js';
import {postVote, getResults, setIo } from './controllers/vote.js';


const app = express();
const PORT = process.env.PORT || 5000;


const connectDB = async () => {
  try {
    if (!process.env.MONGO_URL) {
      console.warn('MONGO_URL not set — running with in-memory DB fallback');
      return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URL);
    if (conn) console.log('MongoDB Connected✅');
  } catch (err) {
    console.warn('Could not connect to MongoDB — falling back to in-memory DB');
    console.warn(err.message);
    // don't throw so the server can keep running with in-memory fallback
  }
};

connectDB();

// HTTP server so we can attach socket.io
const server = http.createServer(app);

// Modern session config (in-memory for dev). In production replace store with connect-mongo or Redis.
if (process.env.NODE_ENV === 'production') {
  // if behind a proxy (e.g., Render), trust it so secure cookies work
  app.set('trust proxy', 1);
}

const sess = session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    // In production we want SameSite=None so the cookie works with cross-site requests (ensure secure=true)
    // In dev we keep Lax which is more permissive for typical local flows.
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  }
});

// Enable CORS for frontend with credentials. Allow common localhost dev ports and optional FRONTEND_URL.
const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5000'].filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(sess);

// Socket.IO
const io = new IOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5000',
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
