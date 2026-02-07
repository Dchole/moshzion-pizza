#!/bin/bash

# Migration script for passwordless OTP authentication
# This script will regenerate Prisma client and apply database migration

set -e  # Exit on error

echo "🔐 Migrating to Passwordless OTP Authentication..."
echo ""

# Step 1: Regenerate Prisma Client
echo "📦 Step 1: Regenerating Prisma client..."
npx prisma generate
echo "✅ Prisma client generated"
echo ""

# Step 2: Run Database Migration
echo "🗄️  Step 2: Applying database migration..."
npx prisma migrate dev --name remove_password_add_otp
echo "✅ Migration applied"
echo ""

echo "🎉 Migration complete!"
echo ""
echo "Next steps:"
echo "1. Restart your dev server: npm run dev"
echo "2. Test authentication at http://localhost:3000/account"
echo "3. Check console for OTP codes (development mode)"
echo ""
echo "📖 See PASSWORDLESS_AUTH.md for full documentation"
