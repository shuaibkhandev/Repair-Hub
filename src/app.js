require("dotenv").config();
const mongodb = require("./config/__dbConn")
const express = require("express");
const path = require("path");
const hbs = require('hbs');
const userRoutes = require("./routes/User");
const bookingRoutes = require("./routes/Booking");
const ServicesRoute = require("./routes/Services");
const ReviewRoute = require("./routes/Review");
const verifyToken = require("./middlewares/auth")


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
app.use("", ServicesRoute);
app.use("", ReviewRoute);


const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');


const YOUR_DOMAIN = 'http://localhost:8000';

app.post('/create-checkout-session', async (req, res) => {
  try {
      const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
              {
                  quantity: 1,
                  price_data: {
                      currency: 'pkr',
                      product_data: {
                          name: "Test"
                      },
                      unit_amount: 140 * 100 // Minimum 140 PKR to meet $0.50 USD requirement
                  }
              }
          ],
          mode: 'payment',
          success_url: `${YOUR_DOMAIN}/success.html`,
          cancel_url: `${YOUR_DOMAIN}/cancel.html`,
      });

      res.redirect(303, session.url); // Send session URL as JSON response
  } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: error.message });
  }
});


app.get('/protected', verifyToken, (req, res) => {
  console.log(req.userId);
  
  res.status(200).json({ message: 'Protected route accessed' });
  });
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

app.get("/dashboard/profile", (req, res) => {
  res.render("dashboard/profile");
});

app.get("/dashboard/our-services", (req, res) => {
  res.render("dashboard/our-services");
});
app.get("/review-form", (req, res) => {
  res.render("review-form");
});
app.get("/checkout", (req, res) => {
  res.render("checkout");
});
app.get("/success", (req, res) => {
  res.render("success");
});
app.get("/cancel", (req, res) => {
  res.render("cancel");
});

app.get("*", (req, res)=>{
  res.render("404")
})


app.listen(port, () => {
  console.log(`App is listening at port ${port}`);
});
