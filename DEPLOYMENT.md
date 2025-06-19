# Deployment Guide for Black Unicorn Design Studio

## Recommended: Vercel + Custom Domain

### Step 1: Deploy to Vercel
```bash
cd landing
npx vercel
```

### Step 2: Configure Environment Variables in Vercel
- Go to your Vercel dashboard
- Navigate to your project settings
- Add these environment variables:
```
DATABASE_URL=your-production-database-url
JWT_SECRET=your-super-secret-production-jwt-key
NEXTAUTH_SECRET=your-nextauth-production-secret
NEXTAUTH_URL=https://your-domain.com
```

### Step 3: Point Your Hostinger Domain to Vercel
1. Log into your Hostinger control panel
2. Go to DNS/Name Servers section
3. Add a CNAME record:
   - **Name**: `www` (or `@` for root domain)
   - **Value**: `cname.vercel-dns.com`
4. Wait for DNS propagation (up to 24 hours)

### Step 4: Configure Custom Domain in Vercel
1. In Vercel dashboard, go to your project
2. Click "Domains" tab
3. Add your custom domain
4. Follow verification steps

## Alternative: Static Version for Hostinger Shared Hosting

If you prefer to use Hostinger's shared hosting, you'll need a simplified version without the database functionality. This would store todos in localStorage instead.

## Database Options for Production

### Option 1: PlanetScale (Free Tier)
- MySQL-compatible
- Generous free tier
- Easy integration with Prisma

### Option 2: Supabase (Free Tier)
- PostgreSQL
- Includes authentication
- Free tier available

### Option 3: Railway (Free Tier)
- PostgreSQL
- Simple setup
- Free tier with usage limits

## Production Checklist

- [ ] Environment variables configured
- [ ] Database deployed and accessible
- [ ] JWT secrets are secure and different from development
- [ ] Create initial admin account using seed script
- [ ] Test authentication flow
- [ ] Test todo functionality
- [ ] Verify responsive design on mobile
- [ ] Set up HTTPS (automatic with Vercel)

## Creating Admin Account in Production

After deployment, create your admin account:

```bash
# If using Vercel with database
npm run db:seed admin@yourdomain.com securepassword123

# Or connect to your production database directly
```

## Troubleshooting

### Common Issues:
1. **Database connection fails**: Check DATABASE_URL format
2. **Authentication not working**: Verify JWT_SECRET is set
3. **Images not loading**: Ensure images are in public/ directory
4. **API routes 404**: Make sure you're not using static export

### Environment Variable Format Examples:
```bash
# PostgreSQL
DATABASE_URL="postgresql://user:password@host:port/database"

# SQLite (development only)
DATABASE_URL="file:./dev.db"
```