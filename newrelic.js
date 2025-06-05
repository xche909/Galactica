// filepath: /Users/mac/Desktop/Galactica/newrelic.js
'use strict';
require('dotenv').config();

/**
 * New Relic agent configuration.
 */
exports.config = {
  app_name: ['Galactica Service ' + process.env.ENV_NAME || 'local'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY || 'your-license-key',
  logging: {
    level: 'info', // Set logging level (e.g., 'info', 'debug', 'trace')
  },
  log_forwarding: {
    enabled: true, // <== this is what enables log forwarding
  },
  distributed_tracing: {
    enabled: true,
  },
};
