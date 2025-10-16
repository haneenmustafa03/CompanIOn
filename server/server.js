import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from 'path';
import { fileURLToPath } from 'url';

//Routes
import authRoutes from './routes/auth.js';
import gameRoutes from './routes/games.js';
import lessonRoutes from './routes/lessons.js';
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
    if (!db) {
        console.log("⚠️  No MongoDB URI provided. Running without database connection.");
        return;
    }
    
    try {
        await mongoose.connect(db, {
            // Add connection options if needed
        });
        console.log("✅ MongoDB connected successfully");
    }
    catch (error) {
        console.log("❌ Error connecting to database:", error.message);
        console.log("⚠️  Server will continue running without database connection");
        // Don't exit the process, let the server run without DB
    }
}

connectDB();

app.get("/", (req, res) => {
    res.json({ message: 'companIOn API running'});
});

app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonRoutes);
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
});
