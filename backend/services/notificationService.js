// Firebase notification service for AI Legal Mate
const admin = require('firebase-admin');
const supabase = require('../config/db');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    })
  });
}

class NotificationService {
  // Send push notification to user
  async sendNotification(userId, title, body, data = {}) {
    try {
      // Get user's device token from database
      const { data: user, error } = await supabase
        .from('users')
        .select('device_token')
        .eq('id', userId)
        .single();

      if (error || !user || !user.device_token) {
        console.log(`No device token found for user ${userId}`);
        return null;
      }

      const message = {
        notification: {
          title: title,
          body: body
        },
        data: data,
        token: user.device_token
      };

      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);

      // Save notification record to database
      await supabase.from('notifications').insert({
        user_id: userId,
        title: title,
        body: body,
        type: data.type || 'general',
        sent_at: new Date().toISOString()
      });

      return response;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  // Send bulk notifications
  async sendBulkNotification(userIds, title, body, data = {}) {
    try {
      // Get device tokens for all users
      const { data: users, error } = await supabase
        .from('users')
        .select('id, device_token')
        .in('id', userIds);

      if (error) {
        console.error('Error fetching user tokens:', error);
        return null;
      }

      const tokens = users
        .filter(user => user.device_token)
        .map(user => user.device_token);

      if (tokens.length === 0) {
        console.log('No valid tokens found for bulk notification');
        return null;
      }

      const message = {
        notification: {
          title: title,
          body: body
        },
        data: data,
        tokens: tokens
      };

      const response = await admin.messaging().sendMulticast(message);
      console.log('Successfully sent multicast message:', response);

      // Save notification records to database
      const notificationRecords = userIds.map(userId => ({
        user_id: userId,
        title: title,
        body: body,
        type: data.type || 'general',
        sent_at: new Date().toISOString()
      }));

      await supabase.from('notifications').insert(notificationRecords);

      return response;
    } catch (error) {
      console.error('Error sending bulk notification:', error);
      throw error;
    }
  }

  // Schedule notification for later
  async scheduleNotification(userId, title, body, scheduledTime, data = {}) {
    try {
      // This would require a scheduler implementation
      // For now, we'll just send immediately
      // In production, use a job scheduler like Agenda.js or Bull
      setTimeout(async () => {
        await this.sendNotification(userId, title, body, data);
      }, scheduledTime - Date.now());

      return { scheduled: true, at: new Date(scheduledTime) };
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  }

  // Send deadline reminder notifications
  async sendDeadlineReminders() {
    try {
      // Find cases with deadlines approaching
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data: cases, error } = await supabase
        .from('cases')
        .select('id, user_id, title, deadline')
        .gte('deadline', now.toISOString())
        .lte('deadline', tomorrow.toISOString())
        .neq('status', 'completed');

      if (error) {
        console.error('Error fetching cases for reminders:', error);
        return;
      }

      for (const caseItem of cases) {
        await this.sendNotification(
          caseItem.user_id,
          'Case Deadline Reminder',
          `Deadline for case "${caseItem.title}" is approaching on ${new Date(caseItem.deadline).toLocaleDateString()}`,
          { type: 'deadline_reminder', caseId: caseItem.id }
        );
      }
    } catch (error) {
      console.error('Error sending deadline reminders:', error);
      throw error;
    }
  }
}

module.exports = new NotificationService();