/**
 * Twilio Driver for @semantq/sms
 * Uses Twilio Messages API
 */
export default class TwilioDriver {
  /**
   * @param {Object} config - The twilio block from server.config.js
   */
  constructor(config) {
    this.config = config;
    this.accountSid = config.accountSid;
    this.authToken = config.authToken;
    this.from = config.from;
    
    // Construct the standard Twilio API URL for your account
    this.endpoint = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;
  }

  /**
   * Sends an SMS via Twilio
   * @param {string} to - Recipient (E.164 format: +27...)
   * @param {string} message - Content
   */
  async send(to, message) {
    // Twilio uses Basic Auth: Base64(sid:token)
    const auth = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');

    // Twilio expects application/x-www-form-urlencoded, not JSON
    const params = new URLSearchParams();
    params.append('To', to);
    params.append('From', this.from);
    params.append('Body', message);

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Twilio error: ${response.status}`);
      }

      return {
        success: true,
        messageId: result.sid,
        provider: 'twilio',
        status: result.status // e.g., 'queued'
      };
    } catch (error) {
      console.error(`[Twilio Driver] Failed to send SMS to ${to}:`, error.message);
      return {
        success: false,
        error: error.message,
        provider: 'twilio'
      };
    }
  }
}