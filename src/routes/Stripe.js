const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const YOUR_DOMAIN = 'http://localhost:8000';
router.post("/create-checkout-session", async (req, res) => {
  try {
    const {
      subServiceId,
      name,
      price,
      description,
      features,
      customerName,
      customerEmail,
      customerPhone
    } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: name, // this is your service name
              description: description
            },
            unit_amount: price * 100
          },
          quantity: 1
        }
      ],
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/success`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['PK']
      },
      customer_creation: 'always',
      customer_email: customerEmail, // this pre-fills email at checkout
      metadata: {
        subServiceId: subServiceId,
        features: JSON.stringify(features),
        serviceName: name,
        servicePrice: price.toString(),
        customerName: customerName,
        customerEmail: customerEmail,
        customerPhone: customerPhone,
        status: 'pending'
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

module.exports = router;