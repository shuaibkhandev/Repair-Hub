const express = require("express");
const { getAllServices, getServiceBySlug, createService ,getSubServiceDetails } = require("../controllers/Services");

const router = express.Router();

router.get("/", getAllServices); // Get all services
router.get("/:slug", getServiceBySlug); // Get service by slug
router.post("/", createService); // Create new service
// Route to get sub-service details
router.get("/sub-service/:id", getSubServiceDetails);

module.exports = router;
