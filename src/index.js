/**
 * @semantq/sms - Public API
 * Professional Service Wrapper for the Semantq Ecosystem
 */
import smsManager from './sms_manager.js';

/**
 * SmsService
 * * Provides a unified interface for sending SMS messages via 
 * configurable providers (SmsPortal, Twilio, or Mock).
 * * @example
 * import { SmsService } from '@semantq/sms';
 * await SmsService.send('+27820000000', 'Eventique: Your OTP is 1234');
 */
export const SmsService = {
  /**
   * Dispatches an SMS using the driver defined in server.config.js
   * @param {string} to - Recipient phone number
   * @param {string} message - Message body
   * @returns {Promise<Object>} Result containing success status and provider info
   */
  send: async (to, message) => {
    return await smsManager.send(to, message);
  }
};

// Default export as SmsService for flexibility in imports
export default SmsService;