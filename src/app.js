const mongodb = require("./config/__dbConn")
const express = require("express");
const path = require("path");
const hbs = require('hbs');
const userRoutes = require("./routes/User");
const bookingRoutes = require("./routes/Booking");



const app = express();
const port = process.env.PORT || 8000;

// Connecte to DB
mongodb();


// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Set view engine and static assets
app.set("views", path.join(__dirname, "templates/views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "../public")));
hbs.registerPartials(path.join(__dirname, "templates/partials"));

// Register a helper called "currentYear"
hbs.registerHelper('currentYear', () => {
  return new Date().getFullYear();
});


// Routes
app.use("/api/auth", userRoutes);
app.use("", bookingRoutes);



app.get("/", (req, res) => {
  res.render("index");
});
app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/about/*", (req, res) => {
  res.render("404");
});


app.get("/service", (req, res) => {
  res.render("service");
});
app.get("/carpenter", (req, res) => {
  res.render("carpenter");
});
app.get("/plumbing", (req, res) => {
  res.render("plumbing");
});
app.get("/electrical", (req, res) => {
  res.render("electrical");
});
app.get("/contact", (req, res) => {
  res.render("contact");
});
app.get("/booking", (req, res) => {
  res.render("booking");
});
app.get("/team", (req, res) => {
  res.render("team");
});
app.get("/testimonial", (req, res) => {
  res.render("testimonial");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/signup", (req, res) => {
  res.render("singup");
});



// DASHBOARD ROUTES
app.get("/dashboard", (req, res) => {
  res.render("dashboard/home");
});

app.get("/dashboard/repair-requests", (req, res) => {
  res.render("dashboard/repair-requests");
});

app.get("/dashboard/users", (req, res) => {
  res.render("dashboard/users");
});


app.get("*", (req, res)=>{
  res.render("404")
})


app.listen(port, () => {
  console.log(`App is listening at port ${port}`);
});
