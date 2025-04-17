const Technician = require('../models/Technician');

// Create
exports.createTechnician = async (req, res) => {
  try {
    const { name, expertise, experience } = req.body;
    console.log(name);
    
    const photo = req.files?.photo?.[0]?.path;

    const newTechnician = new Technician({
      name,
      expertise,
      experience,
      photoUrl: photo || ''
    });

    const savedTech = await newTechnician.save();
    res.redirect("/dashboard/technicians")
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read all
exports.getAllTechnicians = async (req, res) => {
  try {
    const technicians = await Technician.find();
    res.json(technicians);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read one
exports.getTechnicianById = async (req, res) => {
  try {
    const tech = await Technician.findById(req.params.id);
    if (!tech) return res.status(404).json({ message: 'Not found' });
    res.json(tech);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// controller/technicianController.js
exports.updateTechnician = async (req, res) => {
  try {
    const { name, expertise, experience } = req.body;
    const photo = req.files?.photo?.[0]?.path;

    const updated = await Technician.findByIdAndUpdate(
      req.params.id,
      {
        name,
        expertise,
        experience,
        ...(photo && { photoUrl: photo })
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Not found' });

    // Redirect to HBS technicians list after update
    res.redirect("/dashboard/technicians");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Delete
exports.deleteTechnician = async (req, res) => {
  try {
    const deleted = await Technician.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.redirect('/technicians');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


