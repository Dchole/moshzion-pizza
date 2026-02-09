# Vercel Deployment Guide (Prisma 7)

## Quick Fix for Your Current Issue

### Problem 1: Migrations Not Run ❌

The database tables don't exist in production.

### Problem 2: Prisma 7 Configuration ⚠️

Prisma 7 moved database URLs from `schema.prisma` to `prisma.config.ts`.

## Solution: Configure Environment Variables & Run Migrations

### Method 1: Using Vercel CLI (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Link to your project
vercel link

# 4. Pull production environment variables
vercel env pull .env.production

# 5. Run migrations
npx prisma migrate deploy
```

### Method 2: Automatic on Each Deploy

Update your **Vercel Project Settings**:

1. Go to: Settings → General → Build & Development Settings
2. Override Build Command:
   ```bash
   npx prisma migrate deploy && npm run build
   ```

This runs migrations automatically before each build.

---

## Complete Setup Guide

### Step 1: Create Vercel Postgres Database

1. Go to your Vercel project dashboard
2. Navigate to **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Choose a region (e.g., `us-east-1`)
6. Name it (e.g., `moshzion-pizza-db`)
7. Click **Create**

Vercel automatically adds these environment variables:

- `POSTGRES_URL` - Direct connection
- `POSTGRES_PRISMA_URL` - Connection pooled (for app queries)
- `POSTGRES_URL_NON_POOLING` - Direct connection (for migrations)

### Step 2: Set Environment Variables

Vercel automatically creates `DATABASE_URL` and `POSTGRES_URL` when you add Postgres Storage.

**You only need to add:**

```env
# NextAuth (CRITICAL - Generate new for production!)
AUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=https://your-domain.vercel.app
```

**How it works:**
- Vercel automatically provides `DATABASE_URL` when you add Postgres
- Both your migrations and app use this automatically
- Your code also checks `POSTGRES_URL` as a fallback (same value)
- No manual configuration needed!

#### Optional (for full functionality):

```env
# Hubtel SMS (for OTP in production - Ghana-based, cheapest option)
# Sign up at https://hubtel.com
HUBTEL_CLIENT_ID=your-client-id
HUBTEL_CLIENT_SECRET=your-client-secret
HUBTEL_SENDER_ID=Moshzion

# OAuth (if using Google/Facebook login)
GOOGLE_CLIENT_ID=your-id
GOOGLE_CLIENT_SECRET=your-secret
```

### Step 3: Update Build Settings

In **Project Settings → General → Build & Development Settings**:

- **Framework Preset**: Next.js
- **Build Command**:
  ```bash
  npx prisma generate && npx prisma migrate deploy && next build
  ```
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Step 4: Deploy

```bash
# Push to GitHub (triggers auto-deploy)
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

Or deploy directly:

```bash
vercel --prod
```

---

## Troubleshooting

### Issue: "Table does not exist"

**Solution**: Run migrations:

```bash
vercel env pull .env.production
npx prisma migrate deploy
```

### Issue: SSL Mode Warning

**Solution**: Update connection strings to use `sslmode=verify-full`:

```env
DATABASE_URL="postgres://user:pass@host/db?sslmode=verify-full"
```

### Issue: Environment Variables Not Working

**Solution**:

1. Check they're set in **Production** environment
2. Redeploy after adding variables
3. Pull them locally: `vercel env pull`

### Issue: OTP Not Sending in Production

**Solution**:

- In development: OTPs are logged to console (check Vercel logs)
- In production: Set up Hubtel SMS (Ghana-based, ~$0.003-0.006 per SMS)

---

## Local Development vs Production (Prisma 7)

### How It Works

Vercel automatically creates `DATABASE_URL` when you add Postgres Storage - same name you use locally!

### Local (.env.local)

```env
DATABASE_URL="postgres://postgres:postgres@localhost:51214/template1?sslmode=disable"
SHADOW_DATABASE_URL="postgres://postgres:postgres@localhost:51215/template1?sslmode=disable"
NEXTAUTH_URL="http://localhost:3000"
```

### Production (Vercel - Auto-provided)

When you add Vercel Postgres, it automatically creates:
```env
DATABASE_URL=<postgres-connection-string>
POSTGRES_URL=<same-as-database_url>
PRISMA_DATABASE_URL=<accelerate-url-optional>
```

**You only add:**
```env
AUTH_SECRET=<your-production-secret>
NEXTAUTH_URL=https://your-domain.vercel.app
```

**Why it's simple:**
- ✅ Same `DATABASE_URL` name in both environments
- ✅ No manual mapping or configuration needed
- ✅ Just add Postgres in Vercel and it works!

---

## About Prisma Accelerate (Optional)

### Do You Need Accelerate?

**Short answer: NO** - Your current setup with `@prisma/adapter-pg` and Vercel Postgres pooling is sufficient.

### Current Setup (What You Have)

```typescript
// lib/db.ts - Using direct adapter (Prisma 7 recommended approach)
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
```

This provides:

- ✅ Connection pooling (via Vercel Postgres or pg.Pool)
- ✅ Edge-ready (works on Vercel Edge Functions)
- ✅ No extra cost
- ✅ Prisma 7 best practice

### When to Use Accelerate

Only consider Accelerate if you need:

- Global query caching
- Connection pooling at CDN edge locations worldwide
- Sub-10ms response times globally

For most apps (including yours), the current setup is perfect.

---

## Post-Deploy Checklist

- [ ] Vercel Postgres database created
- [ ] Environment variables set (especially `AUTH_SECRET`)
- [ ] Build command includes `prisma migrate deploy`
- [ ] First deployment successful
- [ ] Can access the site
- [ ] Can sign in with phone + OTP
- [ ] Check Vercel logs for any errors
- [ ] Test address/payment method saving

---

## Monitoring

### Check Database

```bash
# Pull production env
vercel env pull .env.production

# Open Prisma Studio
npx prisma studio
```

### Check Logs

```bash
vercel logs --prod
```

Or view in dashboard: Deployments → [Latest] → Logs
