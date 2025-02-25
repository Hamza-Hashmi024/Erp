const bcrypt = require('bcrypt');

async function generateBcryptHash(password) {
  try {
    const saltRounds = 10;  // Use the SAME value as in your registration code
    const hash = await bcrypt.hash(password, saltRounds);
    console.log("Generated bcrypt Hash:", hash);
    return hash;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;  // Handle the error appropriately
  }
}

// Example Usage:
async function run() {
  const password = 'Solutyics123#';  // Your admin user's password
  try {
    const passwordHash = await generateBcryptHash(password);
    console.log("bcrypt hash for SQL:", passwordHash);
  } catch (error) {
    console.error("Failed to generate hash:", error);
  }
}

run();