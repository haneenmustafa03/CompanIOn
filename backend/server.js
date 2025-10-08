import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from 'path';
import { fileURLToPath } from 'url';

//Routes
import authRoutes from './routes/auth.js';
//import lessonRoutes from './routes/lessons.js';
import gameRoutes from './routes/games.js';
import badgeRoutes from './routes/badges.js';
//import parentRoutes from './routes/parent.js';
//import settingsRoutes from './routes/settings.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5001;
const db = process.env.MONGO_URI;

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//Database
async function connectDB() {
    try {
        await mongoose.connect(db, {
            serverSelectionTimeoutMS: 7000,
        });
        isDatabaseConnected = true;
        console.log("MongoDB connected");
    }
    catch (error) {
        isDatabaseConnected = false;
        console.error("Error connecting to database:", error?.message || error);
        console.error("The server will continue running without a database connection.");
    }
}

// Connection state logging
mongoose.connection.on('connected', () => {
    isDatabaseConnected = true;
    console.log('Mongoose connection established');
});

mongoose.connection.on('error', (err) => {
    isDatabaseConnected = false;
    console.error('Mongoose connection error:', err?.message || err);
});

mongoose.connection.on('disconnected', () => {
    isDatabaseConnected = false;
    console.warn('Mongoose disconnected');
});

// Try to connect, but do not block server start
tryConnectToDatabase();

app.get("/", (req, res) => {
    res.json({ message: 'companIOn API running'});
});

app.use('/api/auth', authRoutes);
//app.use('/api/lessons', lessonRoutes);
app.use('/api/games', gameRoutes);
//app.use('/api/parent', parentRoutes);
//app.use('/api/settings', settingsRoutes);



//error handling for middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: "Middleware error",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
  console.log("Server is running on port 5001");
  console.log(`Server is running on port ${PORT}`);
});