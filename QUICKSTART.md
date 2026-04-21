# Brainwave Quick Start Guide

Get Brainwave running in 5 minutes.

## TL;DR - 3 Steps

### 1. Set Environment Variables
Create `.env.local`:
```env
DATABASE_URL="your_neon_connection_string"
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"
ANTHROPIC_API_KEY="your_claude_key"
OPENAI_API_KEY="your_gpt_key"
GROQ_API_KEY="your_groq_key"
```

### 2. Install & Setup
```bash
pnpm install
pnpm prisma migrate deploy
pnpm dev
```

### 3. Open Browser
Visit `http://localhost:3000` and start building!

---

## Detailed Quick Start

### Prerequisites Checklist
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] API keys obtained (see below)
- [ ] 15 minutes free time

### Get API Keys (5 min)

#### OpenAI
1. Visit https://platform.openai.com/api/keys
2. Click "Create new secret key"
3. Copy and save

#### Anthropic (Claude)
1. Visit https://console.anthropic.com/keys
2. Click "Create Key"
3. Copy and save

#### Groq (Optional)
1. Visit https://console.groq.com/keys
2. Create API key
3. Copy and save

#### Vercel Blob
1. Go to https://vercel.com/dashboard
2. Storage → Blob → Create
3. Copy BLOB_READ_WRITE_TOKEN

#### Neon Database
1. Visit https://neon.tech
2. Create new project
3. Copy connection string

### Installation (5 min)

```bash
# Clone repository
git clone <repo-url>
cd brainwave

# Install dependencies
pnpm install

# Create .env.local
cat > .env.local << 'EOF'
DATABASE_URL="your_neon_url"
BLOB_READ_WRITE_TOKEN="your_blob_token"
ANTHROPIC_API_KEY="your_anthropic_key"
OPENAI_API_KEY="your_openai_key"
GROQ_API_KEY="your_groq_key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
EOF

# Setup database
pnpm prisma migrate deploy

# Start server
pnpm dev
```

### First Project (5 min)

1. Open http://localhost:3000
2. Click "Start Building"
3. Write a prompt:
   ```
   Create a modern SaaS landing page for an AI email assistant.
   Include hero section, features, pricing, and sign-up form.
   Use modern design with purple accent color.
   ```
4. Click "Generate PRD"
5. Review the PRD → Click "Approve & Generate Frontend"
6. See live preview render
7. Click "Approve & Generate Backend"
8. View API code
9. Run tests → Download ZIP

### Deployment (5 min)

**Vercel:**
```bash
# Push to GitHub
git add .
git commit -m "initial"
git push origin main

# Go to vercel.com/new
# Connect your GitHub repo
# Add environment variables
# Deploy!
```

---

## Troubleshooting

### "Cannot find module '@prisma/client'"
```bash
pnpm install
pnpm prisma generate
```

### "DATABASE_URL not set"
Check `.env.local` exists with correct DATABASE_URL

### "ANTHROPIC_API_KEY not set"
Verify API key is in `.env.local` and server restarted

### "Blob upload failed"
Confirm BLOB_READ_WRITE_TOKEN in `.env.local`

### Build fails
```bash
pnpm install
rm -rf .next
pnpm dev
```

---

## Next Steps

1. **Explore the UI**
   - Try different prompts
   - Review generated code
   - Check live previews

2. **Customize**
   - Modify color theme in `app/globals.css`
   - Edit components in `components/`
   - Tweak AI prompts in `app/api/ai/`

3. **Deploy**
   - Push to GitHub
   - Deploy to Vercel
   - Share with users

4. **Extend**
   - Add authentication (next-auth)
   - Save projects to database
   - Build project dashboard
   - Add more AI models

---

## Key Docs

- **README.md** - Full documentation
- **SETUP.md** - Detailed setup guide
- **ARCHITECTURE.md** - Technical deep dive
- **ROADMAP.md** - Future features

---

## Need Help?

- Check **SETUP.md** for detailed instructions
- Read **README.md** for complete docs
- Check GitHub Issues
- Email: support@brainwave.ai

---

**You're all set! Happy building! 🚀**

Next: Visit `http://localhost:3000` and create your first AI website!
