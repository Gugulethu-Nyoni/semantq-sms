/**
 * @semantq/sms - Public API
 */
import smsManager from './sms_manager.js';

/**
 * Standard send function for the Semantq ecosystem.
 * * @example
 * import { sms } from '@semantq/sms';
 * await sms.send('+27123456789', 'Your Eventique ticket is confirmed!');
 */
export const sms = {
  send: (to, message) => smsManager.send(to, message)
};

// Default export for flexibility
export default sms;