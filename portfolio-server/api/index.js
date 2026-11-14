if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const { createApp } = require('../src/app');

module.exports = createApp();
