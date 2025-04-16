const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_BQokikJOvBiI2HlWgH4olfQ2');
const Customer = require('../models/Customer');

// Use express.raw to read raw buffer
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = 'whsec_f3193d72144c25483f89fae963d792e4f9ed0dc657c16f22a1540e1b32b89495';

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
        phone: session.customer_details.phone || session.metadata.phone,
        address: session.customer_details.address,
        subServiceId: session.metadata.subServiceId,
        features: JSON.parse(session.metadata.features || '[]'),
        serviceName: session.metadata.serviceName,       // ✅ updated here
        servicePrice: parseFloat(session.metadata.servicePrice || 0),
        status: session.metadata.status || 'pending',
      };

      await Customer.create(customerData);
      console.log('Customer saved:', customerData);
    } catch (err) {
      console.error('Error saving customer:', err.message);
    }
  }

  res.status(200).end();
});

module.exports = router;
