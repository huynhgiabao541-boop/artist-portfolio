const express = require('express');
const { initFirebaseAuth } = require('./config/firebase');
const { createS3Client } = require('./config/s3');
const { createApiLimiter } = require('./middlewares/rateLimit');
const { createCorsMiddleware } = require('./middlewares/cors');
const { createRequireAdminAuth } = require('./middlewares/auth');
const { createUploadMiddleware } = require('./middlewares/upload');
const { jsonErrorHandler } = require('./middlewares/errorHandler');
const { getHealth } = require('./controllers/healthController');
const { createUploadHandler, createDeleteHandler } = require('./controllers/mediaController');

/**
 * Khởi tạo và lắp ráp ứng dụng Express.
 */
function createApp() {
  const app = express();
  const firebaseAuth = initFirebaseAuth();
  const s3 = createS3Client();
  const requireAdminAuth = createRequireAdminAuth(firebaseAuth);
  const upload = createUploadMiddleware();

  app.use('/api/', createApiLimiter());
  app.use(createCorsMiddleware());
  app.use(express.json());

  app.get('/api/health', getHealth);
  app.post('/api/upload', requireAdminAuth, upload.single('image'), createUploadHandler(s3));
  app.delete('/api/delete', requireAdminAuth, createDeleteHandler(s3));

  app.use(jsonErrorHandler);

  return app;
}

module.exports = { createApp };

