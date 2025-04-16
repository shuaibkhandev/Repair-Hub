// Load environment variables from .env file into process.env
require("dotenv").config();

// Import Express framework
const express = require("express");
const app = express(); // Create an Express application

// Built-in Node.js module to handle file paths
const path = require("path");

// MongoDB connection configuration
const mongodb = require("./config/__dbConn");

// Handlebars view engine
const hbs = require('hbs');

// Parse cookies in HTTP requests
const cookieParser = require("cookie-parser");


// -------------------- Route modules for different parts of the app -------------------- //
const userRoutes = require("./routes/User");           // Auth routes (signup/login)
const bookingRoutes = require("./routes/Booking");     // Booking logic
const ReviewRoute = require("./routes/Review");        // Reviews system
const serviceRoutes = require("./routes/Services");    // Services API
const techniciansRoute = require('./routes/Technician'); // Technicians management
const stripeRoutes = require('./routes/Stripe');       // Stripe payments & checkout
const webhookRoute = require('./routes/webhook');      // Stripe webhook handler


// Middleware for protected routes (JWT verification)
const verifyToken = require("./middlewares/auth");

// Axios for making HTTP requests (e.g., calling internal APIs)
const axios = require("axios");

// Technician model (for direct DB operations)
const Technician = require("./models/Technician");

// Port configuration for the app (fallback to 8000)
const port = process.env.PORT || 8000;

// Allows overriding HTTP methods (e.g., PUT or DELETE in forms)
const methodOverride = require('method-override');

// Connecte to DB
mongodb();


// -------------------- Middlewares -------------------- //

// Handle Stripe webhooks before body-parser middleware (must access raw body for signature verification)
app.use('/webhook', webhookRoute);

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to parse URL-encoded payloads (e.g., form submissions)
app.use(express.urlencoded({ extended: true }));

// Middleware to parse cookies from incoming requests
app.use(cookieParser());

// Support for HTTP verbs like PUT and DELETE via query parameter (_method)
app.use(methodOverride('_method'));

// Set the directory for view templates
app.set("views", path.join(__dirname, "templates/views"));

// Set Handlebars (hbs) as the view engine
app.set("view engine", "hbs");

// Serve static files like CSS, JS, images from the public directory
app.use(express.static(path.join(__dirname, "../public")));

// Register reusable Handlebars partials (components like header, footer)
hbs.registerPartials(path.join(__dirname, "templates/partials"));


// Register a Handlebars helper to get the current year (used in templates)
hbs.registerHelper('currentYear', () => {
  return new Date().getFullYear();
});

// Serve uploaded files from the /uploads path
app.use("/uploads", express.static("uploads"));

// API routes for user authentication (signup, login, etc.)
app.use("/api/auth", userRoutes);

// Routes for handling bookings (create, view, etc.)
app.use("", bookingRoutes);

// Routes for submitting and viewing reviews
app.use("", ReviewRoute);

// Routes for CRUD operations on services
app.use("/api/services", serviceRoutes);

// Routes for managing technicians (protected with token verification)
app.use('/api/technicians', verifyToken , techniciansRoute);

// Routes related to Stripe payment processing (checkout session, success/cancel pages)
app.use('', stripeRoutes);


// API to get token from cookies (used for auth verification on client-side)
app.get("/get-token", (req, res) => {
  const token = req.cookies.token || null;
  res.json({ token });
});


// -------------------- Public Site Pages -------------------- //
app.get("/", (req, res) => {
  res.render("index"); // Home page
});

app.get("/about", (req, res) => {
  res.render("about"); // About Us page
});

app.get("/about/*", (req, res) => {
  res.render("404"); // Catch invalid about subpaths
});

app.get("/service", (req, res) => {
  res.render("service"); // General services page
});

app.get("/carpenter", (req, res) => {
  res.render("carpenter"); // Specific service category: Carpenter
});

app.get("/contact", (req, res) => {
  res.render("contact"); // Contact Us page
});

app.get("/team", (req, res) => {
  res.render("team"); // Our team page
});

app.get("/testimonial", (req, res) => {
  res.render("testimonial"); // Testimonials from customers
});

app.get("/login", (req, res) => {
  res.render("login"); // Login page
});

app.get("/signup", (req, res) => {
  res.render("singup"); // Signup page
});

app.get("/review-form", (req, res) => {
  res.render("review-form"); // Page to submit a review
});

app.get("/services/:slug", (req, res) => {
  res.render("service-details"); // Dynamic page for a single service (by slug)
});




// -------------------- DASHBOARD ROUTES (Require Auth) -------------------- //

app.get("/dashboard", verifyToken , (req, res) => {
  res.render("dashboard/home", { userId: req.userId, role: req.userRole }); // Admin dashboard home
});

app.get("/dashboard/repair-requests", verifyToken ,(req, res) => {
  res.render("dashboard/repair-requests"); // View all repair requests
});

app.get("/dashboard/users", verifyToken ,(req, res) => {
  res.render("dashboard/users"); // View all users
});

app.get("/dashboard/profile", verifyToken , (req, res) => {
  res.render("dashboard/profile"); // User profile page
});

app.get("/dashboard/our-services", verifyToken , (req, res) => {
  res.render("dashboard/our-services"); // Custom services section
});


// List all services from API and display in dashboard
app.get("/dashboard/services", async (req, res) => {
  try {
      const response = await axios.get("http://localhost:8000/api/services");
      res.render("dashboard-services", { services: response.data });
  } catch (error) {
      console.error("Error fetching services:", error);
      res.render("dashboard-services", { services: [] });
  }
});

// Render service form dynamically for create/edit
app.get("/dashboard/services/:action/:slug?", async (req, res) => {
  try {
      const { action, slug } = req.params;
      let service = null;

      if (action === "edit" && slug) {
          const response = await axios.get(`http://localhost:8000/api/services/${slug}`);
          service = response.data;
      }

      res.render("serviceForm", { service });
  } catch (error) {
      console.error("Error fetching service:", error);
      res.redirect("/dashboard/services");
  }
});

// Create or edit a sub-service under a main service
app.get("/dashboard/sub-service/:id", verifyToken, (req, res) => {
  res.render("sub-service.hbs", { subServiceId: req.params.id });
});



// List all technicians
app.get('/dashboard/technicians', verifyToken , async (req, res) => {
  const technicians = await Technician.find();
  res.render('technician', { technicians });
});

// Show form to add new technician
app.get('/dashboard/addtechnician', verifyToken ,(req, res) => {
  res.render('addTechnician');
});

// Show form to edit an existing technician
app.get('/dashboard/edit/:id', verifyToken, async (req, res) => {
  const technician = await Technician.findById(req.params.id);
  res.render('editTechnician', { technician });
});

// Delete a technician from DB
app.delete('/dashboard/delete/:id', verifyToken, async (req, res) => {
  await Technician.findByIdAndDelete(req.params.id);
  res.redirect('/dashboard/technicians');
});


// -------------------- Stripe Checkout & Payment Result Pages -------------------- //

app.get("/checkout", (req, res) => {
  res.render("checkout");
});
app.get("/success", (req, res) => {
  res.render("success");
});
app.get("/cancel", (req, res) => {
  res.render("cancel");
});


// Catch-All Route (404 page)
app.get("*", (req, res)=>{
  res.render("404")
})




// -------------------- SERVER LISTENER -------------------- //
app.listen(port, () => {
  console.log(`App is listening at port ${port}`);
});
