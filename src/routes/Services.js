const Service = require("../models/Services"); 
const express = require("express");
const router = express.Router();


// 📌 Get all services
router.get("/services", async (req, res) => {
    try {
      const services = await Service.find();
      res.json(services);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


  // 📌 Add a new service
  router.post("/services", async (req, res) => {
    try {
      const { name } = req.body;
      const newService = new Service({ name });
      await newService.save();
      res.status(201).json(newService);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


  // 📌 Update a service
  router.put("/services/:id", async (req, res) => {
    try {
      const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedService) return res.status(404).json({ message: "Service not found" });
      res.json(updatedService);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


  // 📌 Delete a service
  router.delete("/services/:id", async (req, res) => {
    try {
      const deletedService = await Service.findByIdAndDelete(req.params.id);
      if (!deletedService) return res.status(404).json({ message: "Service not found" });
      res.json({ message: "Service deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


  module.exports = router;