# Database Setup Guide

## Setting up PostgreSQL and Prisma

### Step 1: Install Dependencies

```bash
npm install prisma @prisma/client bcryptjs @types/bcryptjs -D
```

(Press `n` if zsh asks to correct the package name)

### Step 2: Ensure PostgreSQL is Running

Make sure you have PostgreSQL installed and running locally, or update `DATABASE_URL` in `.env.local` with your database connection string.

```env
DATABASE_URL="postgresql://username:password@localhost:5432/pizza_dev?schema=public"
```

### Step 3: Generate Prisma Client

```bash
npx prisma generate
```

### Step 4: Create Database and Run Migrations

```bash
# Create the database tables
npx prisma db push

# Or use migrations for production-ready schema management
npx prisma migrate dev --name init
```

### Step 5: (Optional) View Database

View your database in Prisma Studio:

```bash
npx prisma studio
```

This opens a visual database browser at http://localhost:5555

---

## SMS Verification Setup (Optional)

### Development Mode (FREE) ✓

SMS codes are automatically **logged to the console** during development. No setup needed!

### Production Mode - AWS SNS (FREE TIER)

AWS SNS includes **100 free SMS messages per month** globally.

1. **Create AWS Account** (if you don't have one)
   - Go to https://aws.amazon.com
   - Free tier includes 100 SMS/month

2. **Get AWS Credentials**

   ```bash
   # Install AWS CLI: https://aws.amazon.com/cli/
   aws configure
   ```

3. **Add to .env.local**

   ```env
   # AWS SMS (100 free/month)
   AWS_ACCESS_KEY_ID="your_access_key"
   AWS_SECRET_ACCESS_KEY="your_secret_key"
   AWS_REGION="us-east-1"
   ```

4. **Install AWS SDK** (when ready for production)

   ```bash
   npm install @aws-sdk/client-sns
   ```

5. **Uncomment AWS SNS code** in `lib/sms.ts`

### Alternative Free Options

- **Vonage SMS API**: €2 free credit (~40 SMS)
- **MessageBird**: €10 free trial credit

---

## Database Schema Overview

The schema includes:

- **User**: Phone auth, profile data, password (bcrypt hashed)
- **Account**: OAuth provider data (Google, Facebook)
- **Address**: Saved delivery addresses
- **Order**: Order history with guest support

All models include timestamps and proper relations.

---

## Troubleshooting

**Error: "Can't reach database server"**

- Ensure PostgreSQL is running: `sudo service postgresql status`
- Check DATABASE_URL in `.env.local`

**Error: "Environment variable not found: DATABASE_URL"**

- Make sure `.env.local` exists and contains DATABASE_URL
- Restart dev server after adding environment variables

**Migration issues**

- Reset database: `npx prisma migrate reset` (⚠️ deletes all data)
- Force push schema: `npx prisma db push --force-reset`
