const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const { singnUpUser, logInUser } = require("../controllers/Users");



// POST /api/auth/signup
router.post("/signup", singnUpUser);

// POST /api/auth/login
router.post("/login", logInUser);

// GET /api/auth/users (Get All Users - Excludes Passwords)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

// PUT /api/auth/update/:id (Update User)
router.put("/update/:id", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (password) {
      req.body.password = await bcrypt.hash(password, 10);
    }

    user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.json({ message: "User updated successfully.", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

// DELETE /api/auth/delete/:id (Delete User)
router.delete("/delete/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({ message: "User deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

router.patch("/:id/role", async (req, res) => {
  const {id} = req.params;
  const {role} = req.body;

  const allowedRole = [true, false];

  if(!allowedRole.includes(role)){
    return res.status(400).json({ error: 'Invalid role. It should be Boolean' });
  }
  try {
    const updateUserRole = await User.findByIdAndUpdate(id, {isAdmin:role}, {new:true});
    
    if (!updateUserRole) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(updateUserRole);
    
  } catch (error) {
    console.error('Error updating status:', err);
    res.status(500).json({ error: 'Server error' });
  }
})

module.exports = router;
