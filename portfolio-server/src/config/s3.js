const { S3Client } = require('@aws-sdk/client-s3');

/**
 * Khởi tạo S3 Client kết nối CloudFly.
 */
function createS3Client() {
  return new S3Client({
    endpoint: process.env.S3_ENDPOINT || 'https://s3.cloudfly.vn',
    region: process.env.S3_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY || '',
      secretAccessKey: process.env.S3_SECRET_KEY || '',
    },
    forcePathStyle: true,
  });
}

module.exports = { createS3Client };

