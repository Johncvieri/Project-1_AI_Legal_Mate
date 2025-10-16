// backend/services/midtransService.js
const midtransClient = require('midtrans-client');
const supabase = require('../config/db');

class MidtransService {
  constructor() {
    this.snap = new midtransClient.Snap({
      isProduction: process.env.NODE_ENV === 'production',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    });
  }

  // Create a payment transaction
  async createTransaction(userId, amount, itemDetails, customerDetails) {
    try {
      const transaction = {
        transaction_details: {
          order_id: `legal-mate-${Date.now()}-${userId}`,
          gross_amount: Math.round(amount) // Amount in IDR
        },
        item_details: itemDetails,
        customer_details: customerDetails
      };

      const transactionResult = await this.snap.createTransaction(transaction);

      // Save transaction record to database
      const { data: paymentRecord, error } = await supabase
        .from('payments')
        .insert([{
          user_id: userId,
          amount: amount / 1000, // Convert back to proper amount
          currency: 'IDR',
          description: itemDetails[0]?.name || 'Legal Service Payment',
          midtrans_transaction_id: transactionResult.transaction_id,
          status: 'pending',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        throw new Error(`Error saving payment record: ${error.message}`);
      }

      return {
        token: transactionResult.token,
        redirect_url: transactionResult.redirect_url,
        payment_id: paymentRecord.id
      };
    } catch (error) {
      throw new Error(`Error creating Midtrans transaction: ${error.message}`);
    }
  }

  // Handle Midtrans notification
  async handleNotification(notificationPayload) {
    try {
      const transactionStatus = await this.snap.transaction.notification(notificationPayload);
      const orderId = transactionStatus.order_id;
      const transactionStatusDetail = transactionStatus.transaction_status;
      const fraudStatus = transactionStatus.fraud_status;

      let status = 'pending';
      if (transactionStatusDetail === 'capture') {
        if (fraudStatus === 'challenge') {
          status = 'pending';
        } else if (fraudStatus === 'accept') {
          status = 'completed';
        }
      } else if (transactionStatusDetail === 'settlement') {
        status = 'completed';
      } else if (transactionStatusDetail === 'cancel' || transactionStatusDetail === 'expire') {
        status = 'failed';
      } else if (transactionStatusDetail === 'refund' || transactionStatusDetail === 'partial_refund') {
        status = 'refunded';
      }

      // Update payment status in database
      const { error } = await supabase
        .from('payments')
        .update({ 
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('midtrans_transaction_id', orderId);

      if (error) {
        throw new Error(`Error updating payment status: ${error.message}`);
      }

      return { success: true, message: 'Notification processed successfully' };
    } catch (error) {
      throw new Error(`Error processing Midtrans notification: ${error.message}`);
    }
  }

  // Get transaction status
  async getTransactionStatus(transactionId) {
    try {
      const statusResponse = await this.snap.transaction.status(transactionId);
      return statusResponse;
    } catch (error) {
      throw new Error(`Error getting transaction status: ${error.message}`);
    }
  }
}

module.exports = new MidtransService();