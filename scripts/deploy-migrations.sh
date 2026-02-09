#!/bin/bash
# Deploy Prisma migrations to Vercel Postgres production database

echo "🔄 Pulling production environment variables from Vercel..."
vercel env pull .env.production --yes

echo "🚀 Running Prisma migrations on production database..."
npx prisma migrate deploy

echo "✅ Migration deployment complete!"
echo ""
echo "Next steps:"
echo "1. Commit and push the trustHost fix: git add . && git commit -m 'Fix: Add trustHost for production' && git push"
echo "2. Test your production deployment at your Vercel URL"
