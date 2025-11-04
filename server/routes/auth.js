import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
import { authenticate, isParent, isChild } from "../middleware/auth.js";


const router = express.Router();

// Helper function to check database connection
const checkDBConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message:
        "Database is not connected. Please check your MongoDB connection and try again.",
    });
  }
  next();
};

//registering
router.post("/register", checkDBConnection, async (req, res) => {
  try {
    const { email, password, name, accountType, age, parentEmail } = req.body;

    if (!email || !password || !name || !accountType) {
      return res.status(400).json({
        success: false,
        message: "All fields required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters.",
      });
    }

    if (accountType === "child") {
      if (!age || !parentEmail) {
        return res.status(400).json({
          success: false,
          message: "Age and parent email are required for child accounts.",
        });
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists under this email.",
      });
    }

    const userData = {
      email,
      password,
      name,
      accountType,
      ...(accountType === "child" && { age, parentEmail }),
    };

    const user = new User(userData);
    await user.save();

    //link child and parent accounts based on same email
    if (accountType === "child" && parentEmail) {
      const parent = await User.findOne({
        email: parentEmail,
        accountType: "parent",
      });
      if (parent) {
        parent.children.push(user._id);
        await parent.save();
      }
    }

    //get user token
    const token = jwt.sign(
      { userId: user._id, accountType: user.accountType },
      process.env.JWT_SECRET
      //maybe make token expire and re-login??
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration.",
    });
  }
});

//logging in
router.post("/login", checkDBConnection, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    user.lastActive = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, accountType: user.accountType },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
});

router.get("/me", checkDBConnection, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Auth verification error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
});

export default router;

/* Registration, logging in and verifies who is logged in currently, this will auto link child and parent accts if they have the same email  */
