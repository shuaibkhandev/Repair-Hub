const express = require("express");
const Booking = require("../models/Booking");

const router = express.Router();

// Create a new booking

router.post("/booking", async (req, res) => {
  try {
    const { name, phone, email, serviceDate, serviceType, specialRequest, location , status} =
      req.body;

    const newBooking = new Booking({
      name,
      phone,
      email,
      serviceDate,
      serviceType,
      specialRequest,
      location,
      status
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


  // Update booking status
router.patch("/booking/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    // Ensure the status is one of the allowed values
    const allowedStatuses = ["Pending", "In Progress", "Completed", "Cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Status updated successfully", booking: updatedBooking });
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
  