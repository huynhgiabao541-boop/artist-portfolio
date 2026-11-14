# Hướng Dẫn Tích Hợp CloudFly Object Storage Vào Dự Án Node.js

Tài liệu hướng dẫn chi tiết cách cấu hình và sử dụng **CloudFly Object Storage** (tương thích giao thức S3) trong dự án **Node.js (Express)** để upload, download và xóa hình ảnh / file.

---

## 1. Lưu ý quan trọng về CloudFly trong Node.js

- **Giao thức:** CloudFly tương thích hoàn toàn với chuẩn AWS S3 API.
- **Thư viện khuyến nghị:** Sử dụng **AWS SDK v3** (`@aws-sdk/client-s3`) thay vì SDK v2 (đã deprecated).
- **2 Cấu hình bắt buộc khi khởi tạo S3 Client:**
  1. `endpoint`: Phải trỏ về `https://s3.cloudfly.vn`.
  2. `forcePathStyle: true`: Bắt buộc bật để URL có định dạng `https://s3.cloudfly.vn/{bucket}/{key}` (CloudFly không hỗ trợ virtual-hosted bucket qua subdomain của S3).
  3. `region`: Điền giá trị giả lập như `us-east-1` (SDK v3 yêu cầu trường này dù CloudFly không phân chia region như AWS).

---

## 2. Cài đặt các thư viện cần thiết

Trong thư mục dự án Node.js, chạy lệnh:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner multer dotenv express cors
```

- `@aws-sdk/client-s3`: Thao tác với Object Storage (Put, Get, Delete).
- `@aws-sdk/s3-request-presigner`: Tạo Pre-signed URL cho upload/download bảo mật (nếu bucket private).
- `multer`: Middleware xử lý `multipart/form-data` khi người dùng upload file từ client.
- `dotenv`: Đọc biến môi trường từ file `.env`.

---

## 3. Cấu hình biến môi trường (`.env`)

Tạo file `.env` tại thư mục gốc của dự án Node.js:

```env
PORT=5000

# Cấu hình CloudFly S3
S3_ENDPOINT=https://s3.cloudfly.vn
S3_REGION=us-east-1
S3_ACCESS_KEY=your_cloudfly_access_key_here
S3_SECRET_KEY=your_cloudfly_secret_key_here
S3_BUCKET_NAME=your_bucket_name_here
```

> **Bảo mật:** Không bao giờ push file `.env` chứa key thật lên Git! Hãy thêm `.env` vào `.gitignore`.

---

## 4. Cấu trúc thư mục khuyến nghị

```text
my-node-project/
├── .env
├── package.json
├── server.js
└── src/
    ├── config/
    │   └── s3.config.js
    ├── middlewares/
    │   └── upload.middleware.js
    ├── services/
    │   └── cloudfly.service.js
    ├── controllers/
    │   └── upload.controller.js
    └── routes/
        └── upload.route.js
```

---

## 5. Triển khai mã nguồn chi tiết

### Bước 1: Khởi tạo S3 Client (`src/config/s3.config.js`)

```javascript
require('dotenv').config();
const { S3Client } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT || 'https://s3.cloudfly.vn',
  region: process.env.S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  forcePathStyle: true, // BẮT BUỘC ĐỐI VỚI CLOUDFLY
});

module.exports = { s3Client };
```

---

### Bước 2: Cấu hình Middleware Multer (`src/middlewares/upload.middleware.js`)

Multer dùng `memoryStorage` để lưu file tạm vào RAM dạng `Buffer`, sau đó đẩy trực tiếp lên CloudFly:

```javascript
const multer = require('multer');

// Lưu file tạm vào RAM
const storage = multer.memoryStorage();

// Lọc file (chỉ cho phép định dạng ảnh)
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file hình ảnh (jpg, png, webp, gif, ...)!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
  },
});

module.exports = upload;
```

---

### Bước 3: Xây dựng Service CloudFly (`src/services/cloudfly.service.js`)

```javascript
const { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { s3Client } = require('../config/s3.config');
const path = require('path');
const crypto = require('crypto');

const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const ENDPOINT = (process.env.S3_ENDPOINT || 'https://s3.cloudfly.vn').replace(/\/$/, '');

class CloudFlyService {
  /**
   * Tạo key (đường dẫn lưu trữ) duy nhất trên bucket
   */
  generateKey(originalName, folder = 'uploads') {
    const ext = path.extname(originalName).toLowerCase();
    const randomHex = crypto.randomBytes(8).toString('hex');
    const timestamp = Date.now();
    return `${folder}/${timestamp}_${randomHex}${ext}`;
  }

  /**
   * Upload file buffer lên CloudFly
   * @param {Object} file - File object từ req.file của multer
   * @param {string} folder - Thư mục logic trên bucket (vd: 'avatars', 'courses')
   * @param {boolean} isPublic - File có quyền public-read không
   */
  async uploadFile(file, folder = 'uploads', isPublic = true) {
    const key = this.generateKey(file.originalname, folder);

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: isPublic ? 'public-read' : 'private',
    });

    await s3Client.send(command);

    // URL trực tiếp tới file trên CloudFly
    const publicUrl = `${ENDPOINT}/${BUCKET_NAME}/${key}`;

    return {
      key,
      url: publicUrl,
      bucket: BUCKET_NAME,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  /**
   * Xóa file trên CloudFly bằng Key hoặc Full URL
   * @param {string} keyOrUrl 
   */
  async deleteFile(keyOrUrl) {
    let key = keyOrUrl;

    // Nếu truyền vào full URL -> tách lấy key
    if (keyOrUrl.startsWith('http://') || keyOrUrl.startsWith('https://')) {
      const urlPattern = `${ENDPOINT}/${BUCKET_NAME}/`;
      if (keyOrUrl.includes(urlPattern)) {
        key = keyOrUrl.replace(urlPattern, '');
      } else {
        const parts = new URL(keyOrUrl).pathname.split(`/${BUCKET_NAME}/`);
        key = parts[1] || keyOrUrl;
      }
    }

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    return await s3Client.send(command);
  }

  /**
   * Tạo Presigned URL cho Bucket / File Private (Hết hạn sau X giây)
   */
  async getPresignedDownloadUrl(key, expiresInSeconds = 3600) {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    return await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
  }
}

module.exports = new CloudFlyService();
```

---

### Bước 4: Viết Controller (`src/controllers/upload.controller.js`)

```javascript
const cloudFlyService = require('../services/cloudfly.service');

// Upload 1 ảnh (ví dụ: Avatar người dùng)
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn file ảnh để tải lên' });
    }

    // Upload vào thư mục 'avatars'
    const result = await cloudFlyService.uploadFile(req.file, 'avatars');

    return res.status(200).json({
      success: true,
      message: 'Upload avatar thành công',
      data: {
        avatarUrl: result.url,
        key: result.key,
      },
    });
  } catch (error) {
    console.error('Lỗi upload avatar:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Upload nhiều ảnh
exports.uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Không có file nào được gửi lên' });
    }

    const uploadPromises = req.files.map((file) => cloudFlyService.uploadFile(file, 'images'));
    const results = await Promise.all(uploadPromises);

    return res.status(200).json({
      success: true,
      message: `Đã upload ${results.length} file thành công`,
      data: results.map((r) => ({ url: r.url, key: r.key })),
    });
  } catch (error) {
    console.error('Lỗi upload nhiều ảnh:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa ảnh
exports.deleteImage = async (req, res) => {
  try {
    const { fileUrl } = req.body;
    if (!fileUrl) {
      return res.status(400).json({ success: false, message: 'Thiếu đường dẫn fileUrl' });
    }

    await cloudFlyService.deleteFile(fileUrl);
    return res.status(200).json({
      success: true,
      message: 'Xóa ảnh thành công',
    });
  } catch (error) {
    console.error('Lỗi xóa ảnh:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
```

---

### Bước 5: Cấu hình Router (`src/routes/upload.route.js`)

```javascript
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const uploadController = require('../controllers/upload.controller');

// Upload 1 ảnh
router.post('/avatar', upload.single('avatar'), uploadController.uploadAvatar);

// Upload nhiều ảnh (tối đa 5 file)
router.post('/multiple', upload.array('images', 5), uploadController.uploadMultipleImages);

// Xóa file
router.delete('/delete', uploadController.deleteImage);

module.exports = router;
```

---

### Bước 6: Tích hợp vào `server.js`

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./src/routes/upload.route');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Đăng ký route
app.use('/api/upload', uploadRoutes);

// Xử lý lỗi từ Multer (nếu có)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: `Lỗi Multer: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

---

## 6. Hướng dẫn Test API qua Postman / cURL

### 1. Test Upload Avatar:
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/upload/avatar`
- **Body:** Chọn `form-data`
  - Key: `avatar` (chọn type `File`)
  - Value: Chọn 1 ảnh từ máy tính của bạn
- **Response mẫu:**
  ```json
  {
    "success": true,
    "message": "Upload avatar thành công",
    "data": {
      "avatarUrl": "https://s3.cloudfly.vn/my-bucket/avatars/1730105000000_3a8b2c1d.jpg",
      "key": "avatars/1730105000000_3a8b2c1d.jpg"
    }
  }
  ```

### 2. Test Xóa ảnh:
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/upload/delete`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "fileUrl": "https://s3.cloudfly.vn/my-bucket/avatars/1730105000000_3a8b2c1d.jpg"
  }
  ```

---

## 7. Các lỗi phổ biến & Cách khắc phục

| Lỗi | Nguyên nhân | Cách khắc phục |
|---|---|---|
| `PermanentRedirect` / `HostNotFound` | Không bật `forcePathStyle: true` | Đảm bảo trong config S3Client có `forcePathStyle: true`. |
| `AccessDenied` / `InvalidAccessKeyId` | Sai Key hoặc sai tên Bucket | Kiểm tra lại `S3_ACCESS_KEY`, `S3_SECRET_KEY` và `S3_BUCKET_NAME` trong `.env`. |
| Ảnh tải lên nhưng không xem được link | Bucket để chế độ Private | Thêm `ACL: 'public-read'` khi upload hoặc dùng hàm `getPresignedDownloadUrl` để lấy link tạm thời. |
| `File too large` | Kích thước file vượt ngưỡng | Tăng tham số `limits.fileSize` trong file `upload.middleware.js`. |
