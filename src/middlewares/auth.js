const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract Bearer token
console.log(token);

  if (!token) {
    return res.redirect("/login"); // Redirect if token is missing
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    
    req.userId = decoded.id;
    req.userRole = decoded.isAdmin;

    if (req.userRole !== "true") {
      return res.redirect("/"); // Redirect non-admin users to home
    }

    next();
  } catch (error) {
    res.redirect("/login"); // Redirect if token is invalid
  }
}

module.exports = verifyToken;
