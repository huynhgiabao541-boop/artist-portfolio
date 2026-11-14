# Hướng Dẫn Triển Khai Portfolio (Bản Production v3)
### Kiến trúc: React (Gallery + Admin) + Firebase Auth + Firestore + Node.js Mini Backend + CloudFly S3

Bản v3 gộp toàn bộ v2 (quản lý ảnh) với phần mới: chủ portfolio tự chỉnh sửa link mạng xã hội, nội dung About / Museum / Contact và mô tả từng tác phẩm.

---

## 1. Kiến Trúc Tổng Thể

```text
KHÁCH XEM WEB ──► Firestore (đọc artworks + siteContent/main)
              └─► CloudFly S3 (tải ảnh thumbnail/display trực tiếp)
              (Không chạm tới backend)

ADMIN
  ├─ Đăng nhập Email/Password (Firebase Auth) → lấy ID Token
  ├─ ẢNH  : React → Backend Node.js (verify token, sharp, upload) → CloudFly S3
  │         rồi React ghi metadata ảnh vào Firestore `artworks`
  └─ TEXT : React ghi thẳng vào Firestore `siteContent/main` và `artworks`
            (được bảo vệ bởi Firestore Security Rules theo UID admin)
```

**Phân công:**
- Ảnh đi qua backend (cần xử lý + khóa S3 không được lộ ra client).
- Text/link ghi thẳng từ React vào Firestore, không cần backend.

### Cấu trúc dữ liệu Firestore

```text
siteContent/main
├── social:   { instagram, facebook, behance }
├── about:    { intro, education: [{period, school, major}],
│               achievements: [{year, title, description}] }
├── museum:   { intro }
└── contact:  { email, phone, address, note }

artworks/{id}
└── title, category, description, displayUrl, displayKey,
    thumbUrl, thumbKey, width, height, createdAt
```

---

## 2. Firebase Firestore Security Rules

Chép vào Firebase Console → Firestore → Rules. Thay `YOUR_FIREBASE_ADMIN_UID` bằng UID tài khoản admin (xem ở Firebase Console → Authentication → Users).

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAdmin() {
      return request.auth != null && request.auth.uid == "YOUR_FIREBASE_ADMIN_UID";
    }

    match /artworks/{artworkId} {
      allow read: if true;

      // Tách delete ra riêng vì khi xóa, request.resource = null
      allow create, update: if isAdmin()
        && request.resource.data.title is string
        && request.resource.data.displayUrl is string
        && request.resource.data.thumbUrl is string
        && (!('description' in request.resource.data)
            || (request.resource.data.description is string
                && request.resource.data.description.size() <= 2000));

      allow delete: if isAdmin();
    }

    match /siteContent/{docId} {
      allow read: if true;
      allow write: if isAdmin() && docId == 'main';
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Lưu ý: Firebase API key trong `REACT_APP_*` là thông tin định danh project công khai, bảo mật thực sự nằm ở Rules và Auth.

---

## 3. CloudFly Bucket Policy (Public-Read)

Bật trên giao diện CloudFly để khách xem được ảnh trong `artworks/*`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadArtworks",
      "Effect": "Allow",
      "Principal": "*",
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::YOUR_BUCKET_NAME/artworks/*"]
    }
  ]
}
```

Hãy mở thử một URL ảnh sau khi upload để chắc `S3_PUBLIC_URL` đúng. Nếu CloudFly có domain public/CDN riêng thì dùng domain đó.

---

## 4. Backend Mini (`portfolio-server`)

### 4.1. Cài đặt

```bash
mkdir portfolio-server
cd portfolio-server
npm init -y
npm install express cors dotenv multer @aws-sdk/client-s3 sharp firebase-admin express-rate-limit
```

### 4.2. `.env` (không commit, thêm vào `.gitignore`)

```env
PORT=5000
ALLOWED_ORIGIN=http://localhost:3000,https://your-admin-domain.com

# Service Account: Firebase Console -> Project Settings -> Service Accounts
# Dán JSON trên MỘT dòng
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}
ADMIN_UID=YOUR_FIREBASE_ADMIN_UID

S3_ENDPOINT=https://s3.cloudfly.vn
S3_REGION=us-east-1
S3_ACCESS_KEY=your_cloudfly_access_key
S3_SECRET_KEY=your_cloudfly_secret_key
S3_BUCKET_NAME=your_bucket_name
S3_PUBLIC_URL=https://s3.cloudfly.vn/your_bucket_name
```

### 4.3. `server.js`

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp');
const rateLimit = require('express-rate-limit');
const admin = require('firebase-admin');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const app = express();

// Khi deploy sau proxy (Render...), cần để rate limit nhận đúng IP từng người
app.set('trust proxy', 1);

// 1. Firebase Admin
try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
} catch (err) {
  console.error('Lỗi khởi tạo Firebase Admin SDK:', err.message);
  process.exit(1);
}

// 2. Rate limit
app.use(
  '/api/',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Quá nhiều yêu cầu, vui lòng thử lại sau.' },
  })
);

// 3. CORS chặt
const allowedOrigins = (process.env.ALLOWED_ORIGIN || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Origin bị chặn bởi CORS'));
    },
  })
);

app.use(express.json());

// 4. Xác thực Firebase ID Token + kiểm tra UID admin
const requireAdminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) return res.status(401).json({ error: 'Thiếu token xác thực' });

    const decoded = await admin.auth().verifyIdToken(token);
    if (decoded.uid !== process.env.ADMIN_UID) {
      return res.status(403).json({ error: 'Không có quyền Admin' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Lỗi xác thực token:', error.message);
    return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

// 5. S3 client (CloudFly)
const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  forcePathStyle: true,
});

// 6. Multer: giới hạn dung lượng + định dạng
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = ['image/jpeg', 'image/png', 'image/webp'];
    if (ok.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Chỉ chấp nhận file JPG, PNG hoặc WEBP'));
  },
});

const uploadToS3 = async (buffer, key, contentType) => {
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );
  return `${process.env.S3_PUBLIC_URL}/${key}`;
};

// ============ API ============

// Upload + tối ưu ảnh
app.post('/api/upload', requireAdminAuth, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Không tìm thấy file ảnh' });

    const baseKey = `artworks/${Date.now()}-${Math.round(Math.random() * 1e6)}`;

    // Bản display ~1600px (rotate() sửa hướng EXIF ảnh điện thoại)
    const { data: displayBuffer, info: displayInfo } = await sharp(req.file.buffer)
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer({ resolveWithObject: true });

    // Bản thumbnail ~400px
    const thumbBuffer = await sharp(req.file.buffer)
      .rotate()
      .resize({ width: 400, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const displayKey = `${baseKey}-display.webp`;
    const thumbKey = `${baseKey}-thumb.webp`;

    const [displayUrl, thumbUrl] = await Promise.all([
      uploadToS3(displayBuffer, displayKey, 'image/webp'),
      uploadToS3(thumbBuffer, thumbKey, 'image/webp'),
    ]);

    return res.json({
      success: true,
      displayUrl,
      displayKey,
      thumbUrl,
      thumbKey,
      width: displayInfo.width,
      height: displayInfo.height,
    });
  } catch (error) {
    next(error);
  }
});

// Xóa ảnh (chỉ cho phép key trong artworks/, chống path traversal)
app.delete('/api/delete', requireAdminAuth, async (req, res, next) => {
  try {
    const { keys } = req.body;
    if (!Array.isArray(keys) || keys.length === 0) {
      return res.status(400).json({ error: 'Danh sách keys không hợp lệ' });
    }
    const isSafe = keys.every(
      (k) => typeof k === 'string' && k.startsWith('artworks/') && !k.includes('..')
    );
    if (!isSafe) return res.status(400).json({ error: 'Key file không an toàn' });

    await Promise.all(
      keys.map((Key) =>
        s3.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key }))
      )
    );
    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Xử lý lỗi tập trung (trả JSON thay vì trang HTML)
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  return res.status(err.status || 400).json({ error: err.message || 'Đã có lỗi xảy ra' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend media chạy tại port ${PORT}`));
```

Cách chạy: local chỉ cần `node server.js` khi cần đăng/xóa ảnh. Hoặc deploy Render free (server "ngủ" khi lâu không dùng, lần gọi đầu mất 30-60 giây).

---

## 5. React: Firebase, Auth, Token

### 5.1. `src/firebase.js`

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

`.env` của React chỉ chứa `REACT_APP_FIREBASE_*` và `REACT_APP_API_URL` (địa chỉ backend). **Không đặt bất kỳ secret nào** trong biến `REACT_APP_*` vì chúng lộ ra trình duyệt.

### 5.2. `src/authHelper.js`

```javascript
import { auth } from './firebase';

export const getAdminAuthHeader = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('Chưa đăng nhập tài khoản Admin');
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
};
```

### 5.3. Trang đăng nhập và route bảo vệ

Tạo tài khoản admin trong Firebase Console → Authentication → Sign-in method → bật Email/Password → Users → Add user. Lấy UID dán vào Rules và `.env` backend. Không cần form đăng ký công khai.

```jsx
// src/AdminLogin.js
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError('Email hoặc mật khẩu không đúng');
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 360, margin: '80px auto' }}>
      <h2>Đăng nhập Admin</h2>
      <input type="email" placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Mật khẩu" value={password}
        onChange={(e) => setPassword(e.target.value)} required />
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <button type="submit">Đăng nhập</button>
    </form>
  );
}
```

```jsx
// src/AdminGate.js: chỉ hiển thị admin khi đã đăng nhập
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import AdminLogin from './AdminLogin';

export default function AdminGate({ children }) {
  const [user, setUser] = useState(undefined); // undefined = đang kiểm tra

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  if (user === undefined) return <p>Đang tải...</p>;
  if (!user) return <AdminLogin />;
  return children;
}
```

Gắn vào router: `<Route path="/admin" element={<AdminGate><AdminPage /></AdminGate>} />`. Đây chỉ là lớp tiện lợi; bảo mật thật nằm ở Rules và backend.

---

## 6. Quản Lý Tác Phẩm (Thêm / Sửa / Xóa)

Nguyên tắc: **ghi DB trước, xóa file sau**; nếu ghi DB lỗi thì rollback file vừa upload.

### 6.1. Thêm tác phẩm

```javascript
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { getAdminAuthHeader } from './authHelper';

const API = process.env.REACT_APP_API_URL;

const deleteKeys = async (keys) => {
  const authHeaders = await getAdminAuthHeader();
  await fetch(`${API}/api/delete`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', ...authHeaders },
    body: JSON.stringify({ keys }),
  });
};

export const handleCreateArtwork = async (file, artworkData) => {
  let uploadedKeys = [];
  try {
    const authHeaders = await getAdminAuthHeader();
    const formData = new FormData();
    formData.append('image', file);

    const uploadRes = await fetch(`${API}/api/upload`, {
      method: 'POST',
      headers: { ...authHeaders },
      body: formData,
    });
    if (!uploadRes.ok) {
      const err = await uploadRes.json().catch(() => ({}));
      throw new Error(err.error || 'Upload ảnh thất bại');
    }
    const media = await uploadRes.json();
    uploadedKeys = [media.displayKey, media.thumbKey];

    await addDoc(collection(db, 'artworks'), {
      title: artworkData.title,
      category: artworkData.category,
      description: artworkData.description || '',
      displayUrl: media.displayUrl,
      displayKey: media.displayKey,
      thumbUrl: media.thumbUrl,
      thumbKey: media.thumbKey,
      width: media.width,
      height: media.height,
      createdAt: serverTimestamp(),
    });
    alert('Thêm tác phẩm thành công!');
  } catch (error) {
    console.error('Lỗi tạo tác phẩm:', error);
    if (uploadedKeys.length > 0) {
      try { await deleteKeys(uploadedKeys); }
      catch (e) { console.warn('Rollback S3 lỗi:', e); }
    }
    alert(`Có lỗi xảy ra: ${error.message}`);
  }
};
```

### 6.2. Sửa tác phẩm (text hoặc thay ảnh)

```javascript
import { doc, updateDoc } from 'firebase/firestore';

export const handleUpdateArtwork = async (artworkId, oldKeys, updatedData, newFile = null) => {
  let newUploadedKeys = [];
  try {
    const authHeaders = await getAdminAuthHeader();
    let payload = {
      title: updatedData.title,
      category: updatedData.category,
      description: updatedData.description || '',
    };

    if (newFile) {
      const formData = new FormData();
      formData.append('image', newFile);
      const uploadRes = await fetch(`${API}/api/upload`, {
        method: 'POST',
        headers: { ...authHeaders },
        body: formData,
      });
      if (!uploadRes.ok) throw new Error('Upload ảnh mới thất bại');
      const media = await uploadRes.json();
      newUploadedKeys = [media.displayKey, media.thumbKey];

      payload = {
        ...payload,
        displayUrl: media.displayUrl,
        displayKey: media.displayKey,
        thumbUrl: media.thumbUrl,
        thumbKey: media.thumbKey,
        width: media.width,
        height: media.height,
      };
    }

    // Cập nhật DB trước
    await updateDoc(doc(db, 'artworks', artworkId), payload);

    // Thành công mới xóa ảnh cũ
    if (newFile && oldKeys?.length > 0) {
      try { await deleteKeys(oldKeys); }
      catch (e) { console.warn('Lỗi dọn ảnh cũ:', e); }
    }
    alert('Cập nhật thành công!');
  } catch (error) {
    console.error('Lỗi cập nhật:', error);
    if (newUploadedKeys.length > 0) {
      try { await deleteKeys(newUploadedKeys); }
      catch (e) { console.warn('Rollback ảnh mới lỗi:', e); }
    }
    alert(`Lỗi cập nhật: ${error.message}`);
  }
};
```

### 6.3. Xóa tác phẩm

```javascript
import { doc, deleteDoc } from 'firebase/firestore';

export const handleDeleteArtwork = async (artworkId, keysToDelete) => {
  if (!window.confirm('Bạn có chắc muốn xóa tác phẩm này?')) return;
  try {
    await deleteDoc(doc(db, 'artworks', artworkId)); // DB trước
    if (keysToDelete?.length > 0) {
      try { await deleteKeys(keysToDelete); }           // file sau
      catch (e) { console.warn('Xóa file S3 lỗi (file mồ côi):', e); }
    }
    alert('Đã xóa tác phẩm!');
  } catch (error) {
    console.error('Lỗi xóa:', error);
    alert(`Lỗi khi xóa: ${error.message}`);
  }
};
```

---

## 7. Chỉnh Sửa Nội Dung Site (Link, About, Museum, Contact)

### 7.1. Context đọc nội dung (1 lần đọc cho mọi trang)

```javascript
// src/SiteContentContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export const DEFAULT_CONTENT = {
  social:  { instagram: '', facebook: '', behance: '' },
  about:   { intro: '', education: [], achievements: [] },
  museum:  { intro: '' },
  contact: { email: '', phone: '', address: '', note: '' },
};

const Ctx = createContext({ content: DEFAULT_CONTENT, loading: true, reload: () => {} });
const ref = doc(db, 'siteContent', 'main');

export const SiteContentProvider = ({ children }) => {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const d = snap.data();
        setContent({
          social:  { ...DEFAULT_CONTENT.social,  ...d.social },
          about:   { ...DEFAULT_CONTENT.about,   ...d.about },
          museum:  { ...DEFAULT_CONTENT.museum,  ...d.museum },
          contact: { ...DEFAULT_CONTENT.contact, ...d.contact },
        });
      }
    } catch (e) {
      console.warn('Không tải được nội dung site, dùng mặc định', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return <Ctx.Provider value={{ content, loading, reload: load }}>{children}</Ctx.Provider>;
};

export const useSiteContent = () => useContext(Ctx);

// Ghi từng phần: saveSection('social', {...})
export const saveSection = (section, data) =>
  setDoc(ref, { [section]: data }, { merge: true });

// Chỉ cho http/https, chặn javascript: (XSS)
export const safeUrl = (u) => (/^https?:\/\//i.test(u || '') ? u : null);
```

Bọc `<SiteContentProvider>` quanh `<App />`.

### 7.2. Hiển thị phía khách

```jsx
const { content } = useSiteContent();
const { instagram, facebook, behance } = content.social;

{safeUrl(instagram) && <a href={safeUrl(instagram)} target="_blank" rel="noopener noreferrer">Instagram</a>}
{safeUrl(facebook)  && <a href={safeUrl(facebook)}  target="_blank" rel="noopener noreferrer">Facebook</a>}
{safeUrl(behance)   && <a href={safeUrl(behance)}   target="_blank" rel="noopener noreferrer">Behance</a>}

// About
{content.about.education.map((e, i) => (
  <li key={i}>{e.period} – {e.school} ({e.major})</li>
))}

// Đoạn text nhiều dòng: dùng CSS thay vì dangerouslySetInnerHTML
<p style={{ whiteSpace: 'pre-line' }}>{content.about.intro}</p>
```

Link để trống thì icon tự ẩn. **Không dùng `dangerouslySetInnerHTML`** cho text do người dùng nhập.

### 7.3. Form chỉnh sửa: trường đơn (Social, Contact, Museum)

```jsx
// src/admin/FieldsEditor.js
import { useState, useEffect } from 'react';
import { useSiteContent, saveSection } from '../SiteContentContext';

export default function FieldsEditor({ section, fields }) {
  const { content, reload } = useSiteContent();
  const [form, setForm] = useState(content[section]);
  const [saving, setSaving] = useState(false);

  useEffect(() => setForm(content[section]), [content, section]);

  const onSave = async () => {
    setSaving(true);
    try {
      await saveSection(section, form);
      await reload();
      alert('Đã lưu!');
    } catch (e) {
      alert('Lỗi lưu: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {fields.map(({ key, label, multiline }) => (
        <label key={key} style={{ display: 'block', marginBottom: 12 }}>
          {label}
          {multiline ? (
            <textarea rows={4} value={form[key] || ''}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          ) : (
            <input value={form[key] || ''}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          )}
        </label>
      ))}
      <button onClick={onSave} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
    </div>
  );
}
```

### 7.4. Form About (có danh sách học vấn, thành tích)

```jsx
// src/admin/AboutEditor.js
import { useState, useEffect } from 'react';
import { useSiteContent, saveSection } from '../SiteContentContext';

const ListEditor = ({ label, items, onChange, fields }) => (
  <fieldset style={{ marginBottom: 16 }}>
    <legend>{label}</legend>
    {items.map((item, i) => (
      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        {fields.map(({ key, placeholder }) => (
          <input key={key} placeholder={placeholder} value={item[key] || ''}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...item, [key]: e.target.value };
              onChange(next);
            }} />
        ))}
        <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))}>Xóa</button>
      </div>
    ))}
    <button type="button" onClick={() => onChange([...items, {}])}>+ Thêm dòng</button>
  </fieldset>
);

export default function AboutEditor() {
  const { content, reload } = useSiteContent();
  const [form, setForm] = useState(content.about);
  const [saving, setSaving] = useState(false);

  useEffect(() => setForm(content.about), [content]);

  const onSave = async () => {
    setSaving(true);
    try {
      await saveSection('about', form);
      await reload();
      alert('Đã lưu!');
    } catch (e) {
      alert('Lỗi lưu: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <label style={{ display: 'block', marginBottom: 12 }}>
        Giới thiệu
        <textarea rows={5} value={form.intro || ''}
          onChange={(e) => setForm({ ...form, intro: e.target.value })} />
      </label>

      <ListEditor label="Học vấn" items={form.education || []}
        onChange={(education) => setForm({ ...form, education })}
        fields={[
          { key: 'period', placeholder: '2018-2022' },
          { key: 'school', placeholder: 'Trường' },
          { key: 'major',  placeholder: 'Ngành' },
        ]} />

      <ListEditor label="Thành tích" items={form.achievements || []}
        onChange={(achievements) => setForm({ ...form, achievements })}
        fields={[
          { key: 'year', placeholder: '2024' },
          { key: 'title', placeholder: 'Giải thưởng / triển lãm' },
          { key: 'description', placeholder: 'Mô tả ngắn' },
        ]} />

      <button onClick={onSave} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
    </div>
  );
}
```

### 7.5. Trang Admin gộp các tab

```jsx
// src/admin/AdminPage.js
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import FieldsEditor from './FieldsEditor';
import AboutEditor from './AboutEditor';
// import ArtworksManager from './ArtworksManager'; // form thêm/sửa/xóa dùng các hàm ở mục 6

const TABS = ['Tác phẩm', 'Giới thiệu', 'Museum', 'Liên hệ', 'Mạng xã hội'];

export default function AdminPage() {
  const [tab, setTab] = useState(TABS[0]);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Quản trị Portfolio</h2>
        <button onClick={() => signOut(auth)}>Đăng xuất</button>
      </header>

      <nav style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} disabled={t === tab}>{t}</button>
        ))}
      </nav>

      {tab === 'Tác phẩm' && <p>{/* <ArtworksManager /> */}Danh sách + form thêm/sửa/xóa tác phẩm</p>}
      {tab === 'Giới thiệu' && <AboutEditor />}
      {tab === 'Museum' && (
        <FieldsEditor section="museum" fields={[
          { key: 'intro', label: 'Giới thiệu phòng trưng bày', multiline: true },
        ]} />
      )}
      {tab === 'Liên hệ' && (
        <FieldsEditor section="contact" fields={[
          { key: 'email',   label: 'Email' },
          { key: 'phone',   label: 'Số điện thoại' },
          { key: 'address', label: 'Địa chỉ' },
          { key: 'note',    label: 'Lời nhắn', multiline: true },
        ]} />
      )}
      {tab === 'Mạng xã hội' && (
        <FieldsEditor section="social" fields={[
          { key: 'instagram', label: 'Link Instagram' },
          { key: 'facebook',  label: 'Link Facebook' },
          { key: 'behance',   label: 'Link Behance' },
        ]} />
      )}
    </div>
  );
}
```

Mô tả từng tác phẩm (Museum) nhập ở form thêm/sửa tác phẩm (trường `description`), hiển thị ở lightbox cạnh `displayUrl`.

---

## 8. Phân Trang Gallery (Tiết Kiệm Hạn Mức Spark)

```javascript
import { collection, query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const PAGE_SIZE = 12;

export const getInitialArtworks = async () => {
  const q = query(collection(db, 'artworks'), orderBy('createdAt', 'desc'), limit(PAGE_SIZE));
  const snapshot = await getDocs(q);
  return {
    items: snapshot.docs.map((d) => ({ id: d.id, ...d.data() })),
    lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
  };
};

export const getMoreArtworks = async (lastDoc) => {
  if (!lastDoc) return { items: [], lastDoc: null };
  const q = query(
    collection(db, 'artworks'),
    orderBy('createdAt', 'desc'),
    startAfter(lastDoc),
    limit(PAGE_SIZE)
  );
  const snapshot = await getDocs(q);
  return {
    items: snapshot.docs.map((d) => ({ id: d.id, ...d.data() })),
    lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
  };
};
```

Hiển thị: gallery chỉ dùng `thumbUrl`, gắn sẵn `width`/`height` để tránh layout nhảy; chỉ tải `displayUrl` khi mở lightbox.

```jsx
<img
  src={artwork.thumbUrl}
  alt={artwork.title}
  width={artwork.width}
  height={artwork.height}
  loading="lazy"
  style={{ aspectRatio: `${artwork.width} / ${artwork.height}` }}
  onClick={() => openLightbox(artwork)}
/>
```

---

## 9. Checklist Triển Khai

1. Tạo project Firebase, bật Firestore và Auth (Email/Password), tạo tài khoản admin, lấy UID.
2. Dán Rules (mục 2) với UID thật.
3. Tạo bucket CloudFly, bật Bucket Policy (mục 3), kiểm tra `S3_PUBLIC_URL` bằng một ảnh thật.
4. Cấu hình `.env` backend (mục 4.2), chạy `node server.js`.
5. Cấu hình `.env` React, thêm `AdminGate`, `SiteContentProvider`, route `/admin`.
6. Thêm thử một tác phẩm, sửa, xóa; kiểm tra ảnh trên bucket được tạo và dọn đúng.
7. Điền nội dung ở các tab Giới thiệu / Museum / Liên hệ / Mạng xã hội.

### Lưu ý cuối

- **Chi phí:** Firebase Spark miễn phí (có hạn mức đọc/ngày); Render free sẽ "ngủ" khi không dùng; CloudFly Object Storage thường tính phí theo dung lượng/băng thông, hãy kiểm tra bảng giá thực tế. Nếu cần thật sự 0đ, cân nhắc Cloudflare R2.
- **Email/số điện thoại hiển thị công khai** sẽ bị bot thu thập; nếu lo spam, cân nhắc form liên hệ.
- **Song ngữ Việt/Anh:** nếu cần, đổi mỗi field text thành `{ vi, en }` ngay từ đầu để khỏi phải đổi cấu trúc dữ liệu sau.
- **File mồ côi trên S3:** nếu bước xóa file sau khi xóa DB bị lỗi, file sẽ còn sót; thỉnh thoảng nên đối chiếu bucket với Firestore để dọn.
- Không bao giờ commit `.env` hoặc Service Account JSON.