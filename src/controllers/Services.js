
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
    const { name, slug, description, icon , services } = req.body;

    // Main service image path from multer
    const serviceImage = req.files["image"]?.[0]?.path;
    const serviceIcon = icon || 'fa fa-cogs';
    // Parse sub-services array from string (if coming from a form or frontend)
    let parsedServices = [];
    if (services) {
      parsedServices = JSON.parse(services);

      // Add each subImage to the corresponding sub-service
      parsedServices.forEach((sub, index) => {
        sub.image = req.files["subImages"]?.[index]?.path || "";
      });
    }

    const newService = new Service({
      name,
      slug,
      description,
      image: serviceImage,
      icon: serviceIcon,
      services: parsedServices
    });

    const data = await newService.save();


    res.status(201).json({ message: "Service created successfully", service: newService });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error", details: error.message });
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

// Update an Existing Service
exports.updateService = async (req, res) => {
  try {
    const { slug } = req.params;
    const { name, description,  icon, services } = req.body;

    const serviceImage = req.files["image"]?.[0]?.path;
    const serviceIcon = icon || 'fa fa-cogs';
      // Parse sub-services array from string (if coming from a form or frontend)
      let parsedServices = [];
      if (services) {
        parsedServices = JSON.parse(services);
  
        // Add each subImage to the corresponding sub-service
        parsedServices.forEach((sub, index) => {
          sub.image = req.files["subImages"]?.[index]?.path || "";
        });
      }



    // Find the service by slug and update it
    const updatedService = await Service.findOneAndUpdate(
      { slug },
      {
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"), // Update slug dynamically
      description,
      image: serviceImage,
      icon: serviceIcon,
      services: parsedServices
      },
      { new: true } // Return the updated document
    );

    if (!updatedService) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.json({ message: "Service updated successfully", service: updatedService });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update a Specific Sub-Service
exports.updateSubService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, features, booking_link } = req.body;

    // Find the main service that contains this sub-service
    const service = await Service.findOne({ "services._id": id });

    if (!service) {
      return res.status(404).json({ error: "Sub-service not found" });
    }

    // Find the sub-service and update its details
    const subService = service.services.id(id);
    if (!subService) {
      return res.status(404).json({ error: "Sub-service not found" });
    }

    subService.name = name;
    subService.description = description;
    subService.icon = icon;
    subService.features = features;
    subService.booking_link = booking_link;

    await service.save();

    res.json({ message: "Sub-service updated successfully", subService });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


// Delete a Main Service by Slug
exports.deleteService = async (req, res) => {
  try {
    const { slug } = req.params;

    const deletedService = await Service.findOneAndDelete({ slug });

    if (!deletedService) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a Specific Sub-Service
exports.deleteSubService = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the main service that contains this sub-service
    const service = await Service.findOne({ "services._id": id });

    if (!service) {
      return res.status(404).json({ error: "Sub-service not found" });
    }

    // Remove the sub-service from the array
    service.services = service.services.filter(sub => sub._id.toString() !== id);

    await service.save();

    res.json({ message: "Sub-service deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
