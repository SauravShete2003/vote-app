import express from 'express';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import mongoose from 'mongoose';

configDotenv();

const app = express();  
const PORT = process.env.PORT || 5000;

const MONGO_URI = process.env.MONGO_URI
if (!MONGO_URI) {
   console.error('MONGO_URI is not defined in environment variables')
}
else {
    mongoose.connect(MONGO_URI)
    console.log('Connected to MongoDB');
}

app.use(cors());
app.use(express.json());

app.use('/health', (req, res) => {
    res.send('Server is healthy');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
