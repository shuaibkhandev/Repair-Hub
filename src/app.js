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
const webhookRoute = require('./routes/webhook');
// Connecte to DB
mongodb();
app.use('/webhook', webhookRoute);

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
app.use('/api/technicians', verifyToken , techniciansRoute);


const stripe = require('stripe')('sk_test_51REPg5IkYKSYdDnUyR9TQCRYzFT2ltMnP0fbR2Y74rKMOyJmXRqr4CHkFgMwzlTn1J0zy74kABzKp527LbRKUoDa00frSur56w');
const subServices = {
  "67cd3a4fbf1a099718cd9cc3": { name: "Sub Service A", price: 140 },
  "2": { name: "Sub Service B", price: 200 },
};

const YOUR_DOMAIN = 'http://localhost:8000';
app.post("/create-checkout-session", async (req, res) => {
  try {
    const {
      subServiceId,
      name,
      price,
      description,
      features,
      customerName,
      customerEmail,
      customerPhone
    } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: name, // this is your service name
              description: description
            },
            unit_amount: price * 100
          },
          quantity: 1
        }
      ],
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/success`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['PK']
      },
      customer_creation: 'always',
      customer_email: customerEmail, // this pre-fills email at checkout
      metadata: {
        subServiceId: subServiceId,
        features: JSON.stringify(features),
        serviceName: name,
        servicePrice: price.toString(),
        customerName: customerName,
        customerEmail: customerEmail,
        customerPhone: customerPhone,
        status: 'pending'
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
app.get('/technicians', verifyToken , async (req, res) => {
  const technicians = await Technician.find();
  res.render('technician', { technicians });
});

// Show add form
app.get('/addtechnician', verifyToken ,(req, res) => {
  res.render('addTechnician');
});



// // Show edit form
app.get('/edit/:id',verifyToken, async (req, res) => {
  const technician = await Technician.findById(req.params.id);
  res.render('editTechnician', { technician });
});



// Delete technician
app.delete('/delete/:id',verifyToken, async (req, res) => {
  await Technician.findByIdAndDelete(req.params.id);
  res.redirect('/technicians');
});


app.get("*", (req, res)=>{
  res.render("404")
})


app.listen(port, () => {
  console.log(`App is listening at port ${port}`);
});
