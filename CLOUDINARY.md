# Cloudinary — fast image uploads (Qurtaba School ERP)

## Your account

| Setting | Value |
|---------|--------|
| Cloud name | `dtntbsnii` |
| API Key | `144944283674719` |
| Folder prefix | `qurtaba-school/{category}` |

## Environment variables

Add to `.env.local` and **Vercel → Project → Environment Variables**:

```
CLOUDINARY_URL=cloudinary://144944283674719:YOUR_API_SECRET@dtntbsnii
```

Or:

```
CLOUDINARY_CLOUD_NAME=dtntbsnii
CLOUDINARY_API_KEY=144944283674719
CLOUDINARY_API_SECRET=YOUR_API_SECRET
```

After changing env on Vercel, redeploy:

```powershell
npx vercel deploy --prod --scope nasrofficcial-8156s-projects --yes
```

## How uploads work

1. Browser sends file to `POST /api/upload` with `category` (student, program, staff, etc.).
2. Server compresses with **Sharp** (WebP/PNG, resized by category).
3. Server uploads to **Cloudinary** CDN (auto quality + format).
4. API returns HTTPS URL, e.g. `https://res.cloudinary.com/dtntbsnii/image/upload/...`

## Frontend usage

```javascript
// In any form with a file input:
const url = await uploadOptimizedFile(file, 'program', {
  onStart: () => { btn.disabled = true; btn.textContent = 'Uploading…'; },
  onDone: (url) => { btn.textContent = 'Done'; }
});
// Save `url` in MongoDB (programs, students, staff, etc.)

// Display:
img.src = resolveImageUrl(storedUrl);
```

Categories: `student` | `staff` | `program` | `facility` | `logo` | `document` | `general`

## Vercel production

```powershell
$cloud = "cloudinary://144944283674719:7IeThJ76qNxGVInJ9C3kq5Ur4OM@dtntbsnii"
$cloud | npx vercel env add CLOUDINARY_URL production --scope nasrofficcial-8156s-projects --force
```

## Security

- Never commit API secret to Git (`.env*` is gitignored).
- Rotate secret in [Cloudinary Console](https://console.cloudinary.com) if exposed.
