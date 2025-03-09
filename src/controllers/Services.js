
const Service = require("../models/Services");

// Get All Services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get Service by Slug
exports.getServiceBySlug = async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug });

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Create a New Service
exports.createService = async (req, res) => {
  try {
    const { name, slug, description, price, duration, image, category, services } = req.body;

    const newService = new Service({
      name,
      slug,
      description,
      price,
      duration,
      image,
      category,
      services // Include nested sub-services
    });

    await newService.save();
    res.status(201).json({ message: "Service created successfully", service: newService });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getSubServiceDetails = async (req, res) => {
  try {
      const { id } = req.params;

      // Find the main service that contains this sub-service
      const service = await Service.findOne({ "services._id": id });

      if (!service) {
          return res.status(404).json({ error: "Sub-service not found" });
      }

      // Extract the specific sub-service details
      const subService = service.services.id(id);

      res.status(200).json(subService);
  } catch (error) {
      res.status(500).json({ error: "Server error" });
  }
};