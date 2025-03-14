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
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed", "Cancelled"],
    default: "Pending", // Default status is "Pending"
  },
 
},{
    timestamps: true,
  });

module.exports = mongoose.model("Booking", BookingSchema);
