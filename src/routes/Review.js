
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

module.exports = router;