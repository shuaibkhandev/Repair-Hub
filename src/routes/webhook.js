// routes/webhook.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_BQokikJOvBiI2HlWgH4olfQ2');
const Customer = require('../models/Customer');

const endpointSecret = 'your_webhook_secret'; // Replace with your actual webhook secret

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log('Webhook signature verification failed.', err.message);
    return res.sendStatus(400);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const customerData = {
        name: session.customer_details.name,
        email: session.customer_details.email,
        address: session.customer_details.address,
        subServiceId: session.metadata.subServiceId,
        features: JSON.parse(session.metadata.features || '[]'),
      };

      await Customer.create(customerData);
      console.log("Customer saved:", customerData);
    } catch (err) {
      console.error("Error saving customer:", err.message);
    }
  }

  res.status(200).end();
});

module.exports = router;
