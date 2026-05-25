# Deploy to nasrofficcial-8156s-projects

**Target workspace:** https://vercel.com/nasrofficcial-8156s-projects  
**Project name:** `qurtaba-academy-of-excellence-bela`

## 1. Log in to the correct Vercel account

The CLI must use the **nasrofficcial** account, not any other account.

```powershell
cd "d:\Qurtaba public school\qurtaba_school_erp"
npx vercel logout
npx vercel login
```

Sign in with the email/Google/GitHub linked to **nasrofficcial-8156s-projects**.

Verify:

```powershell
npx vercel whoami --scope nasrofficcial-8156s-projects
npx vercel teams ls
```

You should see `nasrofficcial-8156s-projects` in the team list.

## 2. MongoDB Atlas — fix “IP isn’t whitelisted” on Sign In

If Sign In shows a connection/whitelist error, Atlas is blocking Vercel and your PC.

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) and sign in.
2. Select your project → **Network Access** (left sidebar).
3. Click **+ ADD IP ADDRESS**.
4. Click **ALLOW ACCESS FROM ANYWHERE** (adds `0.0.0.0/0`).
5. Confirm → wait 1–2 minutes.
6. Test: `npm run db:verify` (should print `Atlas connection: OK`).
7. Redeploy only if you changed env vars; otherwise refresh the site and try Sign In again.

**Default login (after Atlas works):**

- Email: `admin@qurtaba.edu.pk` or username: `superadmin`
- Password: `admin123`

Docs: [Atlas IP whitelist](https://www.mongodb.com/docs/atlas/security-whitelist/)

## 3. Deploy

```powershell
.\scripts\deploy-nasrofficcial.ps1
```

Or manually:

```powershell
Remove-Item -Recurse -Force .vercel -ErrorAction SilentlyContinue
npx vercel link --yes --project qurtaba-academy-of-excellence-bela --scope nasrofficcial-8156s-projects
npx vercel deploy --prod --scope nasrofficcial-8156s-projects --yes
```

Set these env vars in the Vercel dashboard (or via CLI) for **Production**, **Preview**, and **Development**:

| Variable | Value |
|----------|--------|
| `MONGODB_URI` | Your Atlas connection string |
| `JWT_SECRET` | Strong secret (same as `.env.local`) |
| `NEXT_PUBLIC_API_URL` | `/api` |

## 4. Post-deployment verification

```powershell
node scripts/production-verify.mjs https://qurtaba-academy-of-excellence-bela.vercel.app
```

Replace the URL with your actual production domain from the Vercel dashboard.

## Default Super Admin (after Atlas is reachable)

- Email: `admin@qurtaba.edu.pk` or username: `superadmin`
- Password: `admin123`

Or run once locally (with Atlas IP allowed): `npm run db:seed`
