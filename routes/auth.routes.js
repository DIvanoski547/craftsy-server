const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const saltRounds = 10;

// POST /auth/signup  - Creates a new user in the database
router.post("/signup", async (req, res, next) => {
  const { email, password, username } = req.body;

  try {
    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ message: "Provide email, password and username" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Provide a valid email adress." });
    }

    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
      });
    }

    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const createdUser = await User.create({
      email,
      password: hashedPassword,
      username,
    });

    const { _id } = createdUser;
    const newUser = { email, username, _id };

    const authToken = jwt.sign(newUser, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    res.status(201).json({ authToken });
  } catch (error) {
    console.error("Error during signup:", error);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
});

// POST  /auth/login - Verifies email and password and returns a JWT
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Provide email and password." });
    }

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const { _id, email: userEmail, username } = foundUser;
    const payload = { _id, email: userEmail, username };

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    res.status(200).json({ authToken });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "An error occurred during login. Please try again later",
      });
  }
});

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get("/verify", isAuthenticated, (req, res, next) => {
  try {
    console.log("Decoded JWT payload", req.payload);

    res.status(200).json(req.payload);
  } catch (error) {
    console.error("Verification error", error);
    res
      .status(500)
      .json({
        message:
          "An error occurred during token verification. Please try again later.",
      });
  }
});

module.exports = router;
