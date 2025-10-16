const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const supabase = require('../config/db');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
router.post('/create-intent', protect, async (req, res) => {
  try {
    const { amount, currency, description } = req.body;

    if (!amount || !currency) {
      return res.status(400).json({ message: 'Amount and currency are required' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to smallest currency unit
      currency: currency || 'idr',
      description: description || 'Legal consultation',
      metadata: {
        userId: req.user.id
      }
    });

    // Save payment record to database
    const { data: payment, error } = await supabase
      .from('payments')
      .insert([{
        user_id: req.user.id,
        amount: amount,
        currency: currency || 'idr',
        description: description || 'Legal consultation',
        stripe_payment_intent_id: paymentIntent.id,
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Error creating payment intent' });
    }

    res.json({
      client_secret: paymentIntent.client_secret,
      payment_id: payment.id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating payment intent' });
  }
});

// @desc    Handle payment webhook
// @route   POST /api/payments/webhook
// @access  Public (handled by Stripe)
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      
      // Update payment status in database
      await supabase
        .from('payments')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('stripe_payment_intent_id', paymentIntent.id);
      
      console.log(`Payment succeeded for payment intent ${paymentIntent.id}`);
      break;
      
    case 'payment_intent.payment_failed':
      const paymentFailedIntent = event.data.object;
      
      // Update payment status in database
      await supabase
        .from('payments')
        .update({ 
          status: 'failed',
          completed_at: new Date().toISOString()
        })
        .eq('stripe_payment_intent_id', paymentFailedIntent.id);
      
      console.log(`Payment failed for payment intent ${paymentFailedIntent.id}`);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// @desc    Get user payment history
// @route   GET /api/payments/history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const { data: payments, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ message: 'Server error fetching payment history' });
    }

    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching payment history' });
  }
});

module.exports = router;