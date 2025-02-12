const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Post /api/auth/signup
router.post("/signup", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  console.log(name, email, password, confirmPassword);

  
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: "Please enter all fields." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists." });
    }

    user = new User({
      name,
      email,
      password,
    });

    await user.save();
    res.redirect("/login")
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please enter all fields." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    if (password !== user.password) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin:user.isAdmin
      }, })
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});


module.exports = router;