import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../.env") });

const MONGO_URI = process.env.MONGO_URI;

async function seedUsers() {
  try {
    // Connect to MongoDB
    if (!MONGO_URI) {
      console.error("❌ MONGO_URI not found in .env file");
      process.exit(1);
    }

    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing test users (optional - comment out if you want to keep existing data)
    await User.deleteMany({
      email: { $in: ["parent@companion.test", "child@companion.test"] },
    });
    console.log("🗑️  Cleared existing test users (if any)");

    // Create Parent Account
    const parentData = {
      email: "parent@companion.test",
      password: "parent123", // Will be hashed automatically
      name: "Parent User",
      accountType: "parent",
    };

    const parent = new User(parentData);
    await parent.save();
    console.log("✅ Created parent account:");
    console.log(`   Email: ${parentData.email}`);
    console.log(`   Password: ${parentData.password}`);
    console.log(`   Name: ${parentData.name}`);

    // Create Child Account
    const childData = {
      email: "child@companion.test",
      password: "child123", // Will be hashed automatically
      name: "Child User",
      accountType: "child",
      age: 10,
      parentEmail: "parent@companion.test", // Links to parent account
    };

    const child = new User(childData);
    await child.save();
    console.log("✅ Created child account:");
    console.log(`   Email: ${childData.email}`);
    console.log(`   Password: ${childData.password}`);
    console.log(`   Name: ${childData.name}`);
    console.log(`   Age: ${childData.age}`);
    console.log(`   Parent Email: ${childData.parentEmail}`);

    // Link child to parent
    parent.children.push(child._id);
    await parent.save();
    console.log("✅ Linked child account to parent account");

    console.log("\n🎉 Sample users created successfully!");
    console.log("\n📝 Login Credentials:");
    console.log("\n👨‍👩 Parent Account:");
    console.log("   Email: parent@companion.test");
    console.log("   Password: parent123");
    console.log("\n👶 Child Account:");
    console.log("   Email: child@companion.test");
    console.log("   Password: child123");

    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedUsers();
