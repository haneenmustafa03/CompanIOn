import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

//Routes
import authRoutes from './routes/auth.js';
import chatbotRoutes from './routes/chatbot.js';
import gameRoutes from './routes/games.js';
import lessonRoutes from './routes/lessons.js';

import parentRoutes from './routes/parent.js';
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
let isDBConnected = false;

async function connectDB() {
    if (!db) {
        console.log("⚠️  No MongoDB URI provided. Running without database connection.");
        console.log("⚠️  Set MONGO_URI in .env file to enable database features.");
        return false;
    }
    
    try {
        await mongoose.connect(db, {
            // Add connection options if needed
        });
        isDBConnected = true;
        console.log("✅ MongoDB connected successfully");
        return true;
    }
    catch (error) {
        console.log("❌ Error connecting to database:", error.message);
        console.log("⚠️  Server will continue running without database connection");
        isDBConnected = false;
        return false;
    }
}

// Make isDBConnected available globally
app.locals.isDBConnected = false;

connectDB().then((connected) => {
    app.locals.isDBConnected = connected;
});

app.get("/", (req, res) => {
    res.json({ message: 'companIOn API running'});
});

app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/parent', parentRoutes);
//app.use('/api/settings', settingsRoutes);



//error handling for middleware
// Global error handler — return helpful info in development
app.use((err, req, res, next) => {
        console.error('Unhandled error:', err);
        const payload = {
            success: false,
            message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
        };

        if (process.env.NODE_ENV !== 'production') {
            // include stack for easier debugging locally
            payload.stack = err.stack;
        }

        res.status(err.status || 500).json(payload);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
