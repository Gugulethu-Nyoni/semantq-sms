# @semantq/sms

A high-performance, driver-based SMS gateway for the **Semantq** ecosystem. Designed to integrate seamlessly with `server.config.js` to provide unified messaging across Eventique and other Semantq-powered platforms.

## Installation

Install via npm:

```bash
npm install @semantq/sms
```
OR

```bash
npm i @semantq/sms
```

*Note: This module requires Node.js v18+ and an ESM-based project (`"type": "module"` in package.json).*


## Configuration

The module automatically looks for a `server.config.js` file in your project root using the Semantq Config Loader. 

### Setup `server.config.js`

run `semantq make:sms RegistrationSMS`

Add the `sms` block to your existing configuration:

```javascript
export default {
  // ... other configs
  sms: {
    driver: 'smsportal', // Options: 'smsportal' | 'twilio' | 'mock'
    
    smsportal: {
      apiId: 'your-api-id',
      apiSecret: 'your-api-secret',
      baseUrl: 'https://rest.smsportal.com/v1/bulkmessages',
    },

    twilio: {
      accountSid: process.env.TWILIO_SID,
      authToken: process.env.TWILIO_TOKEN,
      from: '+1234567890',
    },
  },
};
```

## Usage

The module exports a singleton `sms` object. It handles lazy-loading of the driver and configuration automatically upon the first request.

A paylod template will be created that you can customise and use in your services.

### Basic Send
```javascript
import { sms } from '@semantq/sms';

const result = await sms.send('+27820000000', 'Hello from your company!');

if (result.success) {
  console.log(`Dispatched via ${result.provider}. ID: ${result.messageId}`);
} else {
  console.error(`Failed: ${result.error}`);
}
```

### Response Object
Every `send()` call returns a standardized object regardless of the provider:
| Property | Type | Description |
| :--- | :--- | :--- |
| `success` | Boolean | Whether the API accepted the message. |
| `provider` | String | The driver used (`smsportal`, `twilio`, or `mock`). |
| `messageId`| String | The unique reference ID from the provider. |
| `error` | String | Error message (only present if success is false). |

## Drivers

### 1. SMSPortal (Primary)
Optimized for South African routing. Uses the REST v1 API with Base64 Basic Authentication.

### 2. Twilio (Global)
Uses the Twilio Messages API. Requires E.164 formatted numbers (e.g., `+27...`).

### 3. Mock (Development)
The default driver for `development` environments. It bypasses network calls and logs the SMS content directly to your terminal to save credits and prevent accidental spam.


## License
© 2026 Semantq ICT Innovation. Proprietary / Internal Use.