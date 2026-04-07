/**
 * SMSPortal Driver for @semantq/sms
 * Handles communication with the SMSPortal REST API (v1)
 */
export default class SmsPortalDriver {
  /**
   * @param {Object} config - The smsportal block from server.config.js
   */
  constructor(config) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://rest.smsportal.com/v1/bulkmessages';
  }

  /**
   * Sends an SMS via SMSPortal
   * @param {string} to - The recipient phone number (International format recommended)
   * @param {string} message - The text content of the SMS
   * @returns {Promise<Object>} - The response status and provider info
   */
  async send(to, message) {
    // SMSPortal requires Basic Auth: Base64(apiId:apiSecret)
    const credentials = `${this.config.apiId}:${this.config.apiSecret}`;
    const authHeader = Buffer.from(credentials).toString('base64');

    const payload = {
      messages: [
        {
          destination: to.replace(/\s+/g, ''), // Clean spaces from phone number
          content: message
        }
      ]
    };

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `SMSPortal error: ${response.status}`);
      }

      return {
        success: true,
        messageId: result.sampleBatchId || null, // SMSPortal returns a batch ID
        provider: 'smsportal',
        raw: result
      };
    } catch (error) {
      console.error(`[SMSPortal Driver] Failed to send SMS to ${to}:`, error.message);
      return {
        success: false,
        error: error.message,
        provider: 'smsportal'
      };
    }
  }
}