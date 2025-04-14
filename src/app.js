require("dotenv").config();
const mongodb = require("./config/__dbConn")
const express = require("express");
const path = require("path");
const hbs = require('hbs');
const userRoutes = require("./routes/User");
const bookingRoutes = require("./routes/Booking");
const ReviewRoute = require("./routes/Review");
const serviceRoutes = require("./routes/Services");
const verifyToken = require("./middlewares/auth")
const cookieParser = require("cookie-parser")
const techniciansRoute = require('./routes/Technician');
const axios = require("axios");
const app = express();
const Technician = require("./models/Technician")
const upload = require("./middlewares/upload")
const port = process.env.PORT || 8000;
const methodOverride = require('method-override');

// Connecte to DB
mongodb();


// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(methodOverride('_method'));

// Set view engine and static assets
app.set("views", path.join(__dirname, "templates/views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "../public")));
hbs.registerPartials(path.join(__dirname, "templates/partials"));

// Register a helper called "currentYear"
hbs.registerHelper('currentYear', () => {
  return new Date().getFullYear();
});

app.use("/uploads", express.static("uploads"));
// Routes
app.use("/api/auth", userRoutes);
app.use("", bookingRoutes);
app.use("", ReviewRoute);
app.use("/api/services", serviceRoutes);
app.use('/api/technicians', techniciansRoute);


const stripe = require('stripe')('sk_test_BQokikJOvBiI2HlWgH4olfQ2');
const subServices = {
  "67cd3a4fbf1a099718cd9cc3": { name: "Sub Service A", price: 140 },
  "2": { name: "Sub Service B", price: 200 },
};

const YOUR_DOMAIN = 'http://localhost:8000';
app.post("/create-checkout-session", async (req, res) => {
  try {
      const { subServiceId, name, price, description, features } = req.body;

      const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
              {
                  price_data: {
                      currency: "usd",
                      product_data: {
                          name: name,
                          description: description
                      },
                      unit_amount: price * 100 // Convert price to cents
                  },
                  quantity: 1
              }
          ],
          mode: "payment",
          success_url: "http://localhost:8000/success",
          cancel_url: "http://localhost:8000/cancel",
          metadata: {
              subServiceId: subServiceId,
              features: JSON.stringify(features) // Store additional metadata
          }
      });

      res.json({ url: session.url });
  } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
  }
});


app.get("/get-token", (req, res) => {
  const token = req.cookies.token || null;
  res.json({ token });
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

app.get("/contact", (req, res) => {
  res.render("contact");
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

app.get("/review-form", (req, res) => {
  res.render("review-form");
});
app.get("/services/:slug", (req, res) => {
  res.render("service-details"); // Renders the service details page
});


// payment routes
app.get("/checkout", (req, res) => {
  res.render("checkout");
});
app.get("/success", (req, res) => {
  res.render("success");
});
app.get("/cancel", (req, res) => {
  res.render("cancel");
});


// DASHBOARD ROUTES
app.get("/dashboard", verifyToken , (req, res) => {
  res.render("dashboard/home", { userId: req.userId, role: req.userRole });
});

app.get("/dashboard/repair-requests", verifyToken ,(req, res) => {
  res.render("dashboard/repair-requests");
});

app.get("/dashboard/users", verifyToken ,(req, res) => {
  res.render("dashboard/users");
});

app.get("/dashboard/profile", verifyToken , (req, res) => {
  res.render("dashboard/profile");
});

app.get("/dashboard/our-services", verifyToken , (req, res) => {
  res.render("dashboard/our-services");
});
// Fetch all services for dashboard
app.get("/dashboard/services", async (req, res) => {
  try {
      const response = await axios.get("http://localhost:8000/api/services");
      res.render("dashboard-services", { services: response.data });
  } catch (error) {
      console.error("Error fetching services:", error);
      res.render("dashboard-services", { services: [] });
  }
});

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

app.get("/dashboard/sub-service/:id", verifyToken, (req, res) => {
  res.render("sub-service.hbs", { subServiceId: req.params.id });
});

// Show all technicians
app.get('/technicians', async (req, res) => {
  const technicians = await Technician.find();
  res.render('technician', { technicians });
});

// Show add form
app.get('/addtechnician', (req, res) => {
  res.render('addTechnician');
});

// // Create technician
// app.post('/addtechnician', upload.fields([{ name: 'photo', maxCount: 1 }]), async (req, res) => {
//   const { name, expertise, experience } = req.body;
//   const photo = req.files?.photo?.[0]?.path || '';
//   await Technician.create({ name, expertise, experience, photoUrl: photo });
//   res.redirect('/');
// });

// // Show edit form
app.get('/edit/:id', async (req, res) => {
  const technician = await Technician.findById(req.params.id);
  res.render('editTechnician', { technician });
});

// Update technician
app.put('/edit/:id', upload.fields([{ name: 'photo', maxCount: 1 }]), async (req, res) => {
  const { name, expertise, experience } = req.body;
  const photo = req.files?.photo?.[0]?.path;

  await Technician.findByIdAndUpdate(req.params.id, {
    name, expertise, experience, ...(photo && { photoUrl: photo })
  });

  res.redirect('/');
});

// Delete technician
app.delete('/delete/:id', async (req, res) => {
  await Technician.findByIdAndDelete(req.params.id);
  res.redirect('/');
});


app.get("*", (req, res)=>{
  res.render("404")
})


app.listen(port, () => {
  console.log(`App is listening at port ${port}`);
});
