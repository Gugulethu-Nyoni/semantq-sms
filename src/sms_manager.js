/**
 * SMS Manager for @semantq/sms
 * The central orchestrator (Factory) for SMS drivers.
 */
import getSemantqConfig from './config_loader.js';
import SmsPortalDriver from './drivers/smsportal.js';
import TwilioDriver from './drivers/twilio.js';
import MockDriver from './drivers/mock.js';

class SMSManager {
  constructor() {
    this._instance = null;
    this._config = null;
  }

  /**
   * Internal helper to initialize the driver based on config
   * @private
   */
  async _init() {
    if (this._instance) return;

    // Load the full server.config.js using our loader
    this._config = await getSemantqConfig();
    
    // Default to 'mock' if no sms block or driver is defined
    const smsSettings = this._config.sms || { driver: 'mock' };
    const driverType = (smsSettings.driver || 'mock').toLowerCase();

    switch (driverType) {
      case 'smsportal':
        this._instance = new SmsPortalDriver(smsSettings.smsportal);
        break;
      case 'twilio':
        this._instance = new TwilioDriver(smsSettings.twilio);
        break;
      case 'mock':
      default:
        // Use an empty object if no mock config is provided
        this._instance = new MockDriver(smsSettings.mock || {});
        break;
    }

    console.log(`[Semantq SMS] Initialized with driver: ${driverType}`);
  }

  /**
   * Public Send Method
   * @param {string} to - Recipient number
   * @param {string} message - Content
   */
  async send(to, message) {
    // Ensure driver is initialized before sending
    if (!this._instance) {
      await this._init();
    }

    try {
      return await this._instance.send(to, message);
    } catch (error) {
      console.error(`[Semantq SMS] Send failure:`, error.message);
      return {
        success: false,
        error: error.message,
        provider: 'manager_fallback'
      };
    }
  }
}

// Export as a singleton so the config is only loaded once per server boot
export default new SMSManager();