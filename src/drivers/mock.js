/**
 * Mock Driver for @semantq/sms
 * Logs SMS output to the console for development/testing
 */
export default class MockDriver {
  /**
   * @param {Object} config - The mock block (usually empty or minimal)
   */
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * Simulates sending an SMS by logging it to the terminal
   * @param {string} to - Recipient
   * @param {string} message - Content
   */
  async send(to, message) {
    // Artificial delay to simulate network latency (optional, makes it feel real)
    await new Promise(resolve => setTimeout(resolve, 150));

    const timestamp = new Date().toISOString();
    
    console.log('--------------------------------------------------');
    console.log(`[SMS MOCK] ${timestamp}`);
    console.log(`TO:      ${to}`);
    console.log(`MESSAGE: ${message}`);
    console.log('--------------------------------------------------');

    return {
      success: true,
      messageId: `mock_${Math.random().toString(36).substr(2, 9)}`,
      provider: 'mock',
      status: 'delivered'
    };
  }
}