
const express = require("express");
const router = express.Router();
const Review = require("../models/Review")

// POST: Submit a review
router.post("/reviews", async (req, res) => {
    try {
        const { rating, text, name, email } = req.body;
        if (!rating || !text || !name || !email) {
            return res.status(400).json({ error: "Rating and text are required" });
        }
        
        const newReview = new Review({ name ,email ,rating, text });
   
        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
      
        res.status(500).json({ error: "Server error" });
    }
});


// GET: Fetch all reviews
router.get("/reviews", async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

router.put("/reviews/:id/status", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    if (!["pending", "approved"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
  
    try {
      const review = await Review.findByIdAndUpdate(id, { status }, { new: true });
      if (!review) return res.status(404).json({ error: "Review not found" });
      res.status(200).json(review);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });

module.exports = router;