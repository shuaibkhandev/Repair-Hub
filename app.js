const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const hbs = require('hbs');




app.set("views", path.join(__dirname, "templates/views"));
// app.set("view engine","ejs");
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
hbs.registerPartials(path.join(__dirname, "templates/partials"));


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
app.get("*", (req, res)=>{
  res.render("404")
})

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
