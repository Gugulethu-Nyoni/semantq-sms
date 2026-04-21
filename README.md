# Documentation for `@semantq/sms`

A high-performance, driver-based SMS gateway for the **Semantq** ecosystem. Designed to integrate seamlessly with `server.config.js` to provide unified messaging across Eventique and other Semantq-powered platforms.


```bash
@semantq/sms
```

## Installation

Install via npm:

```bash
npm install @semantq/sms
```

*Note: This module requires Node.js v18+ and an ESM-based project (`"type": "module"` in package.json).*

## Configuration

The module automatically loads configuration from `server.config.js` in your project root using the Semantq Config Loader.

### Setup `server.config.js`

Add the `sms` block to your existing configuration:

```javascript
export default {
  // ... other configs
  sms: {
    driver: 'smsportal', // Options: 'smsportal' | 'twilio' | 'mock'
    
    smsportal: {
      apiId: 'your-api-id',
      apiSecret: 'your-api-secret',
      baseUrl: 'https://rest.smsportal.com/v1/bulkmessages', // Optional
    },

    twilio: {
      accountSid: process.env.TWILIO_SID,
      authToken: process.env.TWILIO_TOKEN,
      from: '+1234567890',
    },
    
    mock: {
      // No configuration required, optionally add logging options
    },
  },
};
```

### Environment-Based Configuration

For production, it's recommended to use environment variables:

```bash
# .env file
TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_TOKEN=your_auth_token
SMSPORTAL_API_ID=your-api-id
SMSPORTAL_API_SECRET=your-api-secret
```

## Usage

The module exports an `SmsService` singleton object. It handles lazy-loading of the driver and configuration automatically upon the first request.

### Basic Send

```javascript
import { SmsService } from '@semantq/sms';

// Send an SMS
const result = await SmsService.send('+27820000000', 'Hello from your company!');

if (result.success) {
  console.log(`Dispatched via ${result.provider}. ID: ${result.messageId}`);
} else {
  console.error(`Failed: ${result.error}`);
}
```

### Alternative Import Style

```javascript
import SmsService from '@semantq/sms';

// Same functionality
await SmsService.send('+27820000000', 'Your OTP is 123456');
```

### Response Object

Every `send()` call returns a standardized object:

| Property | Type | Description |
| :--- | :--- | :--- |
| `success` | Boolean | Whether the API accepted the message |
| `provider` | String | The driver used (`smsportal`, `twilio`, `mock`, or `manager_fallback`) |
| `messageId` | String | The unique reference ID from the provider (if available) |
| `error` | String | Error message (only present if `success` is `false`) |
| `raw` | Object | Raw provider response (only present in success cases for debugging) |

## Drivers

### 1. SMSPortal (Primary)

Optimized for South African routing. Uses the REST v1 API with Base64 Basic Authentication.

**Features:**
- Batch message support
- Automatic phone number sanitization
- Returns batch ID as message reference

**Configuration:**
```javascript
smsportal: {
  apiId: process.env.SMSPORTAL_API_ID,
  apiSecret: process.env.SMSPORTAL_API_SECRET,
  baseUrl: 'https://rest.smsportal.com/v1/bulkmessages' // Optional
}
```

### 2. Twilio (Global)

Uses the Twilio Messages API. Requires E.164 formatted numbers (e.g., `+27...`).

**Configuration:**
```javascript
twilio: {
  accountSid: process.env.TWILIO_SID,
  authToken: process.env.TWILIO_TOKEN,
  from: '+1234567890'
}
```

### 3. Mock (Development)

The default driver when no `sms` configuration is present or in `development` environments. Bypasses network calls and returns simulated responses.

**Features:**
- No actual SMS sending
- Zero cost for development/testing
- Prevents accidental spam
- Returns mock `messageId` for testing workflows

**Configuration (optional):**
```javascript
mock: {
  // Currently no configuration needed
  // Future versions may support logging options
}
```

## Error Handling

The service gracefully handles all errors and returns a structured response:

```javascript
const result = await SmsService.send('invalid-number', 'Test');

if (!result.success) {
  switch(result.provider) {
    case 'smsportal':
      // Handle SMSPortal-specific errors
      break;
    case 'twilio':
      // Handle Twilio-specific errors
      break;
    case 'manager_fallback':
      // Handle initialization or configuration errors
      console.error('Configuration error:', result.error);
      break;
  }
}
```

## Logging

The module provides console logging for important events:

- Driver initialization: `[Semantq SMS] Initialized with driver: {driver}`
- Send failures: `[SMSPortal Driver] Failed to send SMS to {number}: {error}`
- Manager fallbacks: `[Semantq SMS] Send failure: {error}`

## Example: Integration with semantqQL Services

```javascript
import { SmsService } from '@semantq/sms';
//import { UserService } from '@semantq/user';

async function sendVerificationCode(userId) {
  const user = await UserService.findById(userId);
  const code = Math.floor(100000 + Math.random() * 900000);
  
  const result = await SmsService.send(
    user.phone,
    `Your verification code is: ${code}`
  );
  
  if (result.success) {
    await UserService.updateVerificationCode(userId, code);
    return { success: true, messageId: result.messageId };
  }
  
  throw new Error(`SMS failed: ${result.error}`);
}
```

## License

© 2026 Semantq. 

## Support

For issues, questions, or contributions, please contact the Semantq development team.