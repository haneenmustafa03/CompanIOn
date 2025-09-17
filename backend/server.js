import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
dotenv.config({ path: path.join(__dirname, '../.env') });

const PORT = process.env.PORT || 5001;
const db = process.env.MONGO_URI;

async function connectDB() {
    try {
        await mongoose.connect(db, {

        });
        console.log("MongoDB connected");
    }
    catch (error) {
        console.log("Error connecting to database", error);
        process.exit(1);
    }
}

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send('Hello from backend!!');
});


app.listen(PORT, () => {
  console.log("Server is running on port 5001");
});