const jwt = require("jsonwebtoken");
const { getUser } = require("../utils/auth");

function verifyToken(req, res, next) {
const token = req.cookies?.token;
console.log(token);

if(!token) return res.redirect('/')
const user = getUser(token);
if(!user) return res.redirect('/');


if(!user.user.isAdmin) return res.redirect('/');
req.user = user;


next();  
}

module.exports = verifyToken;
