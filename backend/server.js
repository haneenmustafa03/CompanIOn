import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
dotenv.config({ path: path.join(__dirname, '../.env') });

const PORT = process.env.PORT || 5001;
const db = process.env.MONGO_URI;

let isDatabaseConnected = false;

async function tryConnectToDatabase() {
    if (!db) {
        console.warn("MONGO_URI is not set. Skipping database connection.");
        return;
    }
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

app.use(cors());
app.use(express.json());
// Serve static files in backend/public
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.send('Hello from the backend!!');
});

// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', '../../frontend/index.html'));
// });

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", dbConnected: isDatabaseConnected });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});