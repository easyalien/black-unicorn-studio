# Setting Up Neon Database for Vercel Deployment

## Step 1: Create Neon Account
1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub (same account as Vercel)
3. Create a new project called "black-unicorn-studio"

## Step 2: Get Database URL
1. In your Neon dashboard, go to Connection Details
2. Copy the connection string that looks like:
   ```
   postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
   ```

## Step 3: Update Prisma Schema
Update your `prisma/schema.prisma` to use PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Step 4: Add Environment Variables to Vercel
1. Go to https://vercel.com/easyaliens-projects/buds
2. Go to Settings > Environment Variables
3. Add these variables:

```
DATABASE_URL = [your-neon-connection-string]
JWT_SECRET = [generate-32-char-random-string]
NEXTAUTH_SECRET = [generate-32-char-random-string]
NEXTAUTH_URL = https://your-vercel-app.vercel.app
```

## Step 5: Run Database Migration
After setting up environment variables, Vercel will automatically run:
```bash
npx prisma migrate deploy
```

## Step 6: Create Admin Account
After successful deployment, create your admin account:
```bash
npm run db:seed admin@yourdomain.com yourpassword123
```