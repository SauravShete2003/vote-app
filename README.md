# Voting App

A real-time voting application built with React frontend and Node.js/Express backend, using Socket.IO for live updates and MongoDB for data storage.

## Features

- User login with session-based authentication
- Vote on 3 options with duplicate vote prevention per session
- Real-time results updates via Socket.IO
- Charts displaying voting results
- Mobile-friendly UI

## Tech Stack

- Frontend: React, React Router, Chart.js, Socket.IO Client
- Backend: Node.js, Express, Socket.IO, MongoDB, Express Session
- Real-time: Socket.IO
- Database: MongoDB

## Installation

1. Clone the repository
2. Install dependencies for both client and server:

```bash
cd client
npm install

cd ../server
npm install
```

3. Set up environment variables in `server/.env`:
   - MONGO_URL: Your MongoDB connection string
   - SESSION_SECRET: A secret key for sessions
   - FRONTEND_URL: Frontend URL (e.g., http://localhost:3000)
   - PORT: Backend port (default 5000)

4. Start MongoDB locally or use MongoDB Atlas.

## Running the App

1. Start the backend:
```bash
cd server
npm run dev
```

2. Start the frontend:
```bash
cd client
npm start
```

The app will be available at http://localhost:3000, backend at http://localhost:5000.

## Testing Real-time Updates

- Open the app in two different browsers or incognito tabs.
- Log in with different names.
- Vote from one browser and see updates in the other.

## Deployment

- Frontend: Deploy to Vercel or Netlify
- Backend: Deploy to Render or Railway
- Database: MongoDB Atlas

Set environment variables accordingly.

## Assumptions

- Session-based vote prevention (one vote per browser session)
- No user registration, just login with name
- In-memory session store for dev; use persistent store in production
