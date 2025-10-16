// backend/services/paymentService.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const supabase = require('../config/db');

class PaymentService {
  // Create payment intent
  async createPaymentIntent(userId, amount, currency = 'idr', description = '') {
    try {
      // Convert amount to smallest currency unit (e.g., cents for USD)
      // For IDR, the smallest unit is already 1 Rupiah
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to smallest currency unit
        currency: currency.toLowerCase(),
        description: description,
        metadata: {
          userId: userId
        }
      });

      // Save payment record to database
      const { data: paymentRecord, error } = await supabase
        .from('payments')
        .insert([{
          user_id: userId,
          amount: amount,
          currency: currency,
          description: description,
          stripe_payment_intent_id: paymentIntent.id,
          status: 'pending',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        throw new Error(`Error saving payment record: ${error.message}`);
      }

      return {
        client_secret: paymentIntent.client_secret,
        payment_id: paymentRecord.id,
        payment_intent_id: paymentIntent.id
      };
    } catch (error) {
      throw new Error(`Error creating payment intent: ${error.message}`);
    }
  }

  // Handle payment webhook from Stripe
  async handleWebhook(payload, sig) {
    try {
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
      const event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);

      let paymentId;
      let status;

      switch (event.type) {
        case 'payment_intent.succeeded':
          paymentId = event.data.object.id;
          status = 'completed';
          break;
        case 'payment_intent.payment_failed':
          paymentId = event.data.object.id;
          status = 'failed';
          break;
        case 'payment_intent.canceled':
          paymentId = event.data.object.id;
          status = 'canceled';
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
          return { success: true, message: 'Unhandled event' };
      }

      // Update payment status in database
      const { error } = await supabase
        .from('payments')
        .update({ 
          status: status,
          completed_at: new Date().toISOString()
        })
        .eq('stripe_payment_intent_id', paymentId);

      if (error) {
        throw new Error(`Error updating payment status: ${error.message}`);
      }

      return { success: true, message: 'Webhook processed successfully' };
    } catch (error) {
      throw new Error(`Webhook processing error: ${error.message}`);
    }
  }

  // Get user payment history
  async getUserPaymentHistory(userId) {
    try {
      const { data: payments, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Error fetching payment history: ${error.message}`);
      }

      return payments;
    } catch (error) {
      throw new Error(`Error getting payment history: ${error.message}`);
    }
  }

  // Refund a payment
  async refundPayment(paymentIntentId, amount = null) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        ...(amount && { amount: Math.round(amount * 100) }) // Partial refund if amount specified
      });

      // Update payment status in database
      const { error } = await supabase
        .from('payments')
        .update({ 
          status: 'refunded',
          updated_at: new Date().toISOString()
        })
        .eq('stripe_payment_intent_id', paymentIntentId);

      if (error) {
        throw new Error(`Error updating refund status: ${error.message}`);
      }

      return refund;
    } catch (error) {
      throw new Error(`Error processing refund: ${error.message}`);
    }
  }
}

module.exports = new PaymentService();