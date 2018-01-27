const PORT = process.env.PORT || 8081;
const DATABASE_NAME = 'save-my-trip';
const DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || `mongodb://localhost/${DATABASE_NAME}`;
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || `mongodb://localhost/test-${DATABASE_NAME}`
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
module.exports = {
  PORT,
  DATABASE_NAME,
  DATABASE_URL,
  TEST_DATABASE_URL,
  JWT_SECRET,
  JWT_EXPIRY,
  SENDGRID_API_KEY
}