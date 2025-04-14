const mongoose = require("mongoose");

const subServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  duration: { type: String, required: true },
  image: { type: String},
});

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  services: [subServiceSchema] // Nested sub-services
}, { timestamps: true });

const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;
