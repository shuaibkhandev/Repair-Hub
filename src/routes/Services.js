const express = require("express");
const { 
  getAllServices, 
  getServiceBySlug, 
  createService, 
  getSubServiceDetails, 
  updateService, 
  updateSubService, 
  deleteService,    // Added deleteService
  deleteSubService  // Added deleteSubService
} = require("../controllers/Services");
const upload = require("../middlewares/upload");
const router = express.Router();

router.get("/", getAllServices);
router.get("/:slug", getServiceBySlug);
router.post("/", upload.fields([
  { name: "image", maxCount: 1 }, // service image
  { name: "subImages", maxCount: 10 } // sub-services images
]) ,createService);
router.put("/:slug", upload.fields([
  { name: "image", maxCount: 1 }, // service image
  { name: "subImages", maxCount: 10 } // sub-services images
]), updateService); // Update main service
router.put("/sub-service/:id", updateSubService); // Update sub-service
router.get("/sub-service/:id", getSubServiceDetails);
router.delete("/:slug", deleteService); // Delete main service
router.delete("/sub-service/:id", deleteSubService); // Delete sub-service

module.exports = router;
