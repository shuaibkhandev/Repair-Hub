const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema({
  name: { type: String, required: true },
  expertise: { type: String, required: true },
  experience: { type: Number, required: true },
  photoUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Technician', technicianSchema);
