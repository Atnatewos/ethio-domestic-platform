// File path: /server/services/telegram.service.js
// Purpose: Telegram bot integration for admin alerts

const TelegramBot = require('node-telegram-bot-api');

class TelegramService {
  constructor() {
    this.bot = null;
    this.chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    this.isEnabled = !!process.env.TELEGRAM_BOT_TOKEN && !!this.chatId;

    if (this.isEnabled) {
      try {
        // Fix: Use default export
        this.bot = new (TelegramBot.default || TelegramBot)(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
        console.log('✅ Telegram bot initialized');
      } catch (error) {
        console.error('❌ Failed to initialize Telegram bot:', error.message);
        this.isEnabled = false;
      }
    } else {
      console.log('⚠️ Telegram bot not configured (missing TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID)');
    }
  }

  async sendAlert(message) {
    if (!this.isEnabled || !this.bot) {
      console.log('📱 [Telegram Disabled] Would send:', message);
      return;
    }

    try {
      await this.bot.sendMessage(this.chatId, message, { parse_mode: 'HTML' });
      console.log('✅ Telegram alert sent');
    } catch (error) {
      console.error('❌ Failed to send Telegram alert:', error.message);
    }
  }

  async sendNewRegistrationAlert(userType, userName, userPhone) {
    const message = `
🆕 <b>New ${userType.charAt(0).toUpperCase() + userType.slice(1)} Registration</b>

👤 Name: ${userName}
📞 Phone: ${userPhone}
⏰ Time: ${new Date().toLocaleString()}

Action required: Review payment and approve/reject.
    `.trim();

    await this.sendAlert(message);
  }

  async sendPaymentAlert(payerName, amount, paymentType) {
    const message = `
💰 <b>Payment Received</b>

👤 Payer: ${payerName}
💵 Amount: ${amount} ETB
📋 Type: ${paymentType}
⏰ Time: ${new Date().toLocaleString()}
    `.trim();

    await this.sendAlert(message);
  }
}

module.exports = new TelegramService();