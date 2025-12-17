# Hướng dẫn cấu hình Facebook OAuth 2.0

## Vấn đề thường gặp

Lỗi "Đăng nhập bằng Facebook thất bại" có thể do:
1. Facebook App ID không đúng
2. Facebook SDK chưa được load
3. Origin chưa được thêm vào Facebook App Settings
4. Permissions chưa được cấu hình đúng

## Cách sửa

### 1. Kiểm tra Facebook App ID

Mở Developer Console (F12) và chạy:
```javascript
console.log("Facebook App ID:", process.env.REACT_APP_FACEBOOK_APP_ID || "1387702409762481");
```

### 2. Cấu hình Facebook App

1. Truy cập [Facebook Developers](https://developers.facebook.com/)
2. Chọn App của bạn: App ID `1387702409762481`
3. Vào **Settings** > **Basic**
4. Kiểm tra **App ID** và **App Secret**

### 3. Thêm Valid OAuth Redirect URIs

1. Vào **Settings** > **Basic**
2. Cuộn xuống phần **Add Platform**
3. Chọn **Website**
4. Trong **Site URL**, thêm:
   - `http://localhost:3000` (nếu React chạy ở port 3000)
   - `http://localhost:3001` (nếu chạy ở port khác)
   - URL production khi deploy

**Lưu ý:**
- Phải khớp CHÍNH XÁC với origin hiện tại
- Không có dấu `/` ở cuối
- Có thể thêm nhiều URL (mỗi URL một dòng)

### 4. Cấu hình App Domains

1. Vào **Settings** > **Basic**
2. Trong **App Domains**, thêm:
   - `localhost` (cho development)
   - Domain production khi deploy

### 5. Cấu hình Facebook Login Product

1. Vào **Products** > **Facebook Login** > **Settings**
2. Trong **Valid OAuth Redirect URIs**, thêm:
   - `http://localhost:3000`
   - `http://localhost:3001`
   - URL production

### 6. Kiểm tra Permissions

Đảm bảo App có quyền truy cập:
- `email` - Để lấy email của user
- `public_profile` - Để lấy thông tin cơ bản (tên, ảnh đại diện)

### 7. Environment Variables

Tạo file `.env` trong thư mục `frontelearningenglish`:

```env
REACT_APP_FACEBOOK_APP_ID=1387702409762481
```

Sau đó restart React app.

### 8. Kiểm tra Facebook SDK

Mở Developer Console và kiểm tra:
```javascript
console.log("Facebook SDK loaded:", typeof window.FB !== 'undefined');
console.log("Facebook App ID:", window.FB?.getAppId());
```

## Troubleshooting

### Lỗi "Facebook SDK chưa được load"
- Kiểm tra kết nối internet
- Kiểm tra Facebook SDK script trong `public/index.html`
- Đảm bảo không có trình chặn quảng cáo chặn Facebook SDK

### Lỗi "Invalid OAuth Redirect URI"
- Kiểm tra Valid OAuth Redirect URIs trong Facebook App Settings
- Đảm bảo URL khớp chính xác với origin hiện tại
- Đợi vài phút sau khi cấu hình để Facebook cập nhật

### Lỗi "App Not Setup"
- Đảm bảo Facebook Login product đã được thêm vào App
- Kiểm tra App đang ở chế độ Development hoặc đã được review

### Lỗi "User cancelled"
- User đã đóng popup hoặc từ chối cấp quyền
- Không phải lỗi, chỉ cần thử lại

## So sánh Backend vs Frontend

**Backend mong đợi:**
```csharp
public class FacebookLoginDto
{
    public string AccessToken { get; set; }
    public string State { get; set; }
}
```

**Frontend gửi (sau khi sửa):**
```javascript
{
  AccessToken: response.authResponse.accessToken,
  State: state
}
```

Frontend đã được sửa để khớp với backend.

