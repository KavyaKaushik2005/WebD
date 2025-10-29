const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB Atlas
mongoose.connect("YOUR_MONGODB_ATLAS_URL_HERE")
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Define user schema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  mobile: String,
  password: String
});

const User = mongoose.model("User", userSchema);

//
// ✅ SIGNUP ROUTE
//
app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, mobile, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send("User already exists!");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ firstName, lastName, email, mobile, password: hashedPassword });
    await newUser.save();

    res.send("Signup successful!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error signing up!");
  }
});

//
// ✅ LOGIN ROUTE
//
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("User not found!");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send("Invalid password!");

    // send minimal user info to frontend
    res.json({
      message: "Login successful!",
      user: { email: user.email, firstName: user.firstName, lastName: user.lastName }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in!");
  }
});

//
// ✅ JOIN CHALLENGE ROUTE (writes to challenges.json)
//
app.post("/joinChallenge", (req, res) => {
  const newEntry = req.body;
  fs.readFile("challenges.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file.");

    const challenges = data ? JSON.parse(data) : [];
    challenges.push(newEntry);

    fs.writeFile("challenges.json", JSON.stringify(challenges, null, 2), err2 => {
      if (err2) return res.status(500).send("Error saving challenge.");
      res.send("Challenge joined successfully!");
    });
  });
});
// ✅ Get challenges for a specific user
app.get("/getChallenges", (req, res) => {
  const email = req.query.email;
  fs.readFile("challenges.json", "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading file.");

    const challenges = data ? JSON.parse(data) : [];
    const userChallenges = challenges.filter(c => c.email === email);
    res.json(userChallenges);
  });
});
//
// ✅ Start server
//
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
