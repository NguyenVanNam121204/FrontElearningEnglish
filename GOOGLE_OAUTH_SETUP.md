# Hướng dẫn cấu hình Google OAuth 2.0

## Vấn đề "no registered origin" và "invalid_client"

Lỗi này xảy ra khi origin của frontend không khớp với origin đã đăng ký trong Google Cloud Console.

## Cách sửa

### 1. Kiểm tra origin hiện tại của frontend

Mở Developer Console (F12) và chạy:
```javascript
console.log(window.location.origin);
```

Origin sẽ có dạng: `http://localhost:3000` hoặc `https://localhost:3000`

### 2. Cấu hình Google Cloud Console

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Chọn project của bạn
3. Vào **APIs & Services** > **Credentials**
4. Tìm Client ID của bạn: `872783330590-gc3t4a8rf2dve8s87qu2dte766k6f44p.apps.googleusercontent.com`
5. Click vào Client ID để chỉnh sửa

### 3. Thêm Authorized JavaScript origins

Trong phần **Authorized JavaScript origins**, thêm TẤT CẢ các origin sau:

- `http://localhost:3000` (nếu chạy React ở port 3000)
- `http://localhost:3001` (nếu chạy React ở port khác)
- `https://localhost:3000` (nếu dùng HTTPS)
- `http://127.0.0.1:3000` (nếu truy cập bằng IP)
- Origin của production (khi deploy)

**Lưu ý quan trọng:**
- Phải khớp CHÍNH XÁC với origin hiện tại (bao gồm protocol http/https và port)
- Không có dấu `/` ở cuối
- Phải là origin, không phải URL đầy đủ

### 4. Authorized redirect URIs (KHÔNG CẦN cho Google Identity Services)

Với Google Identity Services (One Tap/Button flow), bạn KHÔNG cần redirect URIs.

Tuy nhiên, nếu bạn muốn dùng redirect flow, thêm:
- `http://localhost:3000` (hoặc port bạn đang dùng)
- `http://localhost:3000/auth/google/callback` (nếu có)

### 5. Lưu và đợi

- Click **Save**
- Đợi 5 phút đến vài giờ để cấu hình có hiệu lực
- Thử lại đăng nhập

## Kiểm tra cấu hình

Sau khi cấu hình, kiểm tra:

1. Origin trong console: `console.log(window.location.origin)`
2. Client ID: Phải đúng với Client ID trong Google Cloud Console
3. Google Identity Services đã load: `console.log(window.google)`

## Troubleshooting

### Lỗi "no registered origin"
- Kiểm tra origin hiện tại: `window.location.origin`
- Đảm bảo origin đã được thêm vào Google Cloud Console
- Đảm bảo không có dấu `/` ở cuối

### Lỗi "invalid_client"
- Kiểm tra Client ID có đúng không
- Đảm bảo Client ID đang active trong Google Cloud Console
- Kiểm tra OAuth consent screen đã được cấu hình

### Lỗi "popup blocked"
- Cho phép popup trong browser
- Kiểm tra trình chặn popup

## Environment Variables

Tạo file `.env` trong thư mục `frontelearningenglish`:

```env
REACT_APP_GOOGLE_CLIENT_ID=872783330590-gc3t4a8rf2dve8s87qu2dte766k6f44p.apps.googleusercontent.com
```

Sau đó restart React app.

