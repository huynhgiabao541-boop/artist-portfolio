const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

/**
 * Lấy base URL công khai cho S3 bucket.
 */
function getPublicBaseUrl(bucketName) {
  if (process.env.S3_PUBLIC_URL) {
    return process.env.S3_PUBLIC_URL.replace(/\/+$/, '');
  }
  const endpoint = (process.env.S3_ENDPOINT || 'https://s3.cloudfly.vn').replace(/\/+$/, '');
  return `${endpoint}/${bucketName}`;
}

/**
 * Upload một buffer lên CloudFly S3 và trả về public URL.
 */
async function uploadToS3(s3, buffer, key, contentType) {
  const bucketName = process.env.S3_BUCKET_NAME;
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  });
  await s3.send(command);

  return `${getPublicBaseUrl(bucketName)}/${key}`;
}

/**
 * Kiểm tra danh sách keys hợp lệ và an toàn (bắt đầu bằng 'artworks/', không có '..').
 */
function areValidArtworkKeys(keys) {
  return keys.every(
    (key) => typeof key === 'string' && key.startsWith('artworks/') && !key.includes('..')
  );
}

/**
 * Xóa hàng loạt keys trên CloudFly S3.
 */
async function deleteKeysFromS3(s3, keys) {
  const bucketName = process.env.S3_BUCKET_NAME;
  await Promise.all(
    keys.map((key) =>
      s3.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: key,
        })
      )
    )
  );
}

module.exports = { getPublicBaseUrl, uploadToS3, areValidArtworkKeys, deleteKeysFromS3 };

