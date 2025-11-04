import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, "../../.env");

try {
  // Read current .env file
  let envContent = fs.readFileSync(envPath, "utf8");
  
  // Fix MONGO_URI - remove quotes and add database name
  envContent = envContent.replace(
    /MONGO_URI=".*"/,
    'MONGO_URI=mongodb+srv://haneenmustafa500_db_user:AYc8oMPcoZooUFZY@companion.b6swc2f.mongodb.net/companion?retryWrites=true&w=majority&appName=CompanIOn'
  );
  
  // Fix JWT_SECRET - remove inline comment
  envContent = envContent.replace(
    /JWT_SECRET=.*\/\/.*/,
    "JWT_SECRET=SECRETsecretSecrets"
  );
  
  // Remove comment lines (lines starting with //)
  envContent = envContent
    .split("\n")
    .filter((line) => !line.trim().startsWith("//"))
    .join("\n");
  
  // Ensure proper format
  if (!envContent.includes("MONGO_URI=")) {
    envContent = `MONGO_URI=mongodb+srv://haneenmustafa500_db_user:AYc8oMPcoZooUFZY@companion.b6swc2f.mongodb.net/companion?retryWrites=true&w=majority&appName=CompanIOn\n${envContent}`;
  }
  
  // Write back to .env
  fs.writeFileSync(envPath, envContent);
  
  console.log("✅ .env file fixed successfully!");
  console.log("\nUpdated .env file:");
  console.log(fs.readFileSync(envPath, "utf8"));
} catch (error) {
  console.error("❌ Error fixing .env file:", error.message);
  console.log("\nPlease manually update your .env file with:");
  console.log("MONGO_URI=mongodb+srv://haneenmustafa500_db_user:AYc8oMPcoZooUFZY@companion.b6swc2f.mongodb.net/companion?retryWrites=true&w=majority&appName=CompanIOn");
  console.log("PORT=5001");
  console.log("JWT_SECRET=SECRETsecretSecrets");
}
