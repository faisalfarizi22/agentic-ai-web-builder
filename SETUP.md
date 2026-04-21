# Brainwave Setup Guide

Complete step-by-step guide to get Brainwave up and running.

## 1. Prerequisites

- Node.js 18+ installed
- pnpm or npm installed
- GitHub account (optional, for Vercel deployment)
- The following API credentials:
  - OpenAI API key
  - Anthropic API key
  - Groq API key (optional)

## 2. API Setup

### OpenAI
1. Go to [platform.openai.com/api/keys](https://platform.openai.com/api/keys)
2. Create a new API key
3. Copy the key

### Anthropic (Claude)
1. Go to [console.anthropic.com/keys](https://console.anthropic.com/keys)
2. Create API key
3. Copy the key

### Groq (Optional)
1. Go to [console.groq.com/keys](https://console.groq.com/keys)
2. Create API key
3. Copy the key

## 3. Database Setup

### Using Neon (Recommended)

1. **Create Neon account**
   - Go to [neon.tech](https://neon.tech)
   - Sign up with GitHub or email
   - Create new project

2. **Get connection string**
   - In Neon dashboard, copy the connection string
   - Format: `postgresql://user:password@db.neon.tech/dbname`

3. **Initialize database**
   ```bash
   psql "your-connection-string" < scripts/init-db.sql
   ```

### Using Local PostgreSQL

1. **Install PostgreSQL**
   ```bash
   # macOS
   brew install postgresql
   
   # Ubuntu
   sudo apt-get install postgresql postgresql-contrib
   ```

2. **Create database**
   ```bash
   createdb brainwave_db
   ```

3. **Get connection string**
   ```
   postgresql://username:password@localhost:5432/brainwave_db
   ```

## 4. Vercel Blob Setup

1. **Create/Use Vercel account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up or log in

2. **Create Blob storage**
   - In Vercel dashboard, go to Storage
   - Create new Blob store

3. **Get token**
   - Copy the BLOB_READ_WRITE_TOKEN

## 5. Environment Variables

Create `.env.local` file in project root:

```env
# Database
DATABASE_URL="postgresql://user:password@db.neon.tech/dbname"

# Blob Storage
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"

# AI API Keys
ANTHROPIC_API_KEY="your_anthropic_api_key"
OPENAI_API_KEY="your_openai_api_key"
GROQ_API_KEY="your_groq_api_key"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 6. Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm prisma generate

# Run migrations (if using Prisma)
pnpm prisma migrate deploy

# Or initialize raw database (if using raw SQL)
psql $DATABASE_URL < scripts/init-db.sql
```

## 7. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 8. Test the Application

1. **Landing Page**
   - Visit home page
   - See hero section and features

2. **Create Project**
   - Click "Start Building"
   - Write a prompt describing your website
   - Generate PRD

3. **Review Generated Content**
   - Review the AI-generated PRD
   - Approve to generate frontend

4. **See Live Preview**
   - Generated HTML renders in preview
   - Edit if needed

5. **Complete Workflow**
   - Approve frontend for backend generation
   - View backend code
   - Run tests
   - Download project as ZIP

## 9. Troubleshooting

### Issue: "ANTHROPIC_API_KEY not set"
- Check `.env.local` file exists
- Verify key is correctly copied
- Restart dev server

### Issue: "Database connection failed"
- Verify DATABASE_URL in `.env.local`
- Check PostgreSQL is running (local) or connection works (Neon)
- Try psql connection:
  ```bash
  psql "your-connection-string"
  ```

### Issue: "Blob upload failed"
- Check BLOB_READ_WRITE_TOKEN is correct
- Ensure token has write permissions
- Check Vercel Blob is properly configured

### Issue: AI endpoints return 500 error
- Check all API keys are set
- Verify API keys are valid and have quota
- Check terminal for detailed error messages

## 10. Deployment

### Deploy to Vercel (Frontend)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your GitHub repository
   - Add environment variables
   - Deploy

3. **Set Environment Variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`

### Deploy Backend Separately

If deploying backend separately:

1. **Create server.js** in backend folder
2. **Set environment variables** on hosting platform
3. **Deploy**:
   - Railway.app: `railway deploy`
   - Render.com: Push to GitHub, auto-deploys
   - AWS/DigitalOcean: Use Docker

## 11. Production Checklist

- [ ] All environment variables set
- [ ] Database migrated
- [ ] Blob storage configured
- [ ] API keys have sufficient quota
- [ ] CORS configured correctly
- [ ] Database backups enabled
- [ ] Error monitoring setup (optional)
- [ ] Rate limiting configured
- [ ] API rate limiting in place
- [ ] Monitoring & alerting setup

## 12. Performance Optimization

### Frontend
- Enable Vercel Analytics
- Use CDN for static assets
- Optimize images

### Backend
- Enable database query caching
- Set up Redis for sessions (optional)
- Configure appropriate database indexes

### AI Calls
- Implement request caching
- Rate limit API calls
- Use streaming for long responses

## 13. Security

### Recommendations
- Never commit `.env.local`
- Use `.env.local.example` for template
- Enable Vercel WAF
- Set up rate limiting
- Monitor API usage
- Regular security audits

### Production Security
- Use HTTPS only
- Enable CORS properly
- Implement CSRF protection
- Validate all inputs
- Use secure cookies
- Enable database SSL

## 14. Next Steps

After setup:

1. **Test all features**
2. **Customize design** (if needed)
3. **Configure analytics**
4. **Set up monitoring**
5. **Deploy to production**
6. **Monitor performance**
7. **Gather user feedback**
8. **Iterate and improve**

## Support

- **Documentation**: See README.md
- **Issues**: Check GitHub Issues
- **Contact**: support@brainwave.ai

---

**Happy building with Brainwave! 🚀**
