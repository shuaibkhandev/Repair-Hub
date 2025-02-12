const express = require("express");
const Booking = require("../models/Booking");

const router = express.Router();

// Create a new booking

router.post("/booking", async (req, res) => {
  try {
    const { name, phone, email, serviceDate, serviceType, specialRequest, location } =
      req.body;

    const newBooking = new Booking({
      name,
      phone,
      email,
      serviceDate,
      serviceType,
      specialRequest,
      location
    });

    await newBooking.save();
    res
      .status(201)
      .json({ message: "Booking successful", booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Get all bookings
router.get("/bookings", async (req, res) => {
    try {
      const bookings = await Booking.find();
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });


  // Get a single booking by ID
router.get("/booking/:id", async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });


  // Delete a booking by ID
router.delete("/booking/:id", async (req, res) => {
    try {
      const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
      if (!deletedBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  
  module.exports = router;
  