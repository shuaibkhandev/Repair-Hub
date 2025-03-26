const mongoose = require("mongoose");

const subServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  image: { type: String},
  booking_link: { type: String, required: true }
});

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  services: [subServiceSchema] // Nested sub-services
}, { timestamps: true });

const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;
