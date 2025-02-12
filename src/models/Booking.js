const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  serviceType: {
    type: String,
    required: true,
    enum: [
      "Electrical",
      "power backup installation",
      "Wiring Repair",
      "Outlet installation",
      "Electrical panel Upgrade",
      "EV Charger installation",
      "Plumbing",
      "Carpentry",
    ],
  },
  specialRequest: {
    type: String,
    trim: true,
  },
  serviceDate: {
    type: Date,
    required : true
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
 
},{
    timestamps: true,
  });

module.exports = mongoose.model("Booking", BookingSchema);
