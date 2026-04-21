# Brainwave - AI Website Builder SaaS

Build professional websites from zero to one in minutes using AI. Describe your vision, and get a complete PRD, frontend code, backend infrastructure, and a downloadable project—all powered by advanced AI models.

## 🌟 Features

- **AI-Generated PRD**: Comprehensive product requirements from a single prompt (Claude 3.5 Sonnet)
- **Professional Frontend**: Beautiful, responsive HTML/CSS/JavaScript code (GPT-4o)
- **Complete Backend**: Node.js/Express API with database schema (GPT-4o)
- **Live Preview**: See your frontend code render in real-time
- **One-Click Download**: Get your entire project as a ZIP file ready to deploy
- **Bright, Lux Design**: Clean, modern interface without excessive gradients or AI-ish elements
- **Full Integration Testing**: Automatic testing of frontend-backend integration
- **Production Ready**: Complete with environment configuration and deployment guides

## 🏗️ Architecture

### Tech Stack

**Frontend**
- Next.js 16 with React 19
- Tailwind CSS for styling
- Shadcn/ui components
- TypeScript for type safety

**Backend**
- Node.js with Express
- PostgreSQL (Neon) for database
- Prisma ORM
- Next.js API Routes

**AI Models**
1. **Claude 3.5 Sonnet** - PRD Generation (detailed, structured documentation)
2. **GPT-4o** - Frontend & Backend Code (creative, production-quality code)
3. **Groq** - Fast inference for real-time features (optional)

**Storage & Infrastructure**
- Vercel Blob for ZIP file storage
- Neon PostgreSQL for data persistence
- Vercel for deployment

### Project Structure

```
ai-website-builder/
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │   ├── generate-prd/
│   │   │   ├── generate-frontend/
│   │   │   └── generate-backend/
│   │   └── projects/
│   │       └── download/
│   ├── builder/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── page.tsx
├── components/
│   ├── builder/
│   │   └── builder-view.tsx
│   ├── ui/
│   ├── landing-hero.tsx
│   └── dashboard-view.tsx
├── lib/
│   ├── ai/
│   └── db/
├── prisma/
│   └── schema.prisma
└── scripts/
    └── init-db.sql
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (pnpm recommended)
- PostgreSQL 13+ (via Neon)
- API Keys:
  - OpenAI API key (for GPT-4o)
  - Anthropic API key (for Claude)
  - Groq API key (optional)

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository>
   cd ai-website-builder
   pnpm install
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your credentials:
   ```
   # Database
   DATABASE_URL="postgresql://user:password@db.neon.tech/dbname"

   # Blob Storage
   BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"

   # AI API Keys
   ANTHROPIC_API_KEY="your_anthropic_key"
   OPENAI_API_KEY="your_openai_key"
   GROQ_API_KEY="your_groq_key"

   # App
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

3. **Setup database**
   ```bash
   # Using Prisma
   pnpm prisma migrate dev --name init

   # Or using raw SQL
   psql $DATABASE_URL < scripts/init-db.sql
   ```

4. **Run development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 How It Works

### The 6-Step Workflow

```
1. PROMPT INPUT
   User describes their website idea

   ↓

2. AI PRD GENERATION
   Claude 3.5 Sonnet creates a comprehensive PRD with:
   - Executive summary
   - Features & functionality
   - User journeys
   - Technical specifications
   - Success metrics

   ↓

3. USER REVIEW & APPROVAL
   User reviews and approves the PRD

   ↓

4. FRONTEND CODE GENERATION
   GPT-4o generates complete, responsive HTML/CSS/JavaScript
   - Live preview available
   - Interactive components
   - Responsive design

   ↓

5. BACKEND CODE GENERATION
   GPT-4o creates Node.js/Express backend with:
   - API routes
   - Database schema (Prisma)
   - Authentication middleware
   - Error handling

   ↓

6. INTEGRATION TESTING & DOWNLOAD
   - Automatic testing of frontend-backend integration
   - All tests pass ✓
   - Download complete project as ZIP
   - Ready to deploy
```

## 🎨 Design System

### Color Palette
- **Background**: Pure white (`oklch(0.99 0 0)`)
- **Foreground**: Near black (`oklch(0.12 0 0)`)
- **Primary**: Deep purple (`oklch(0.3 0.15 280)`)
- **Secondary**: Light gray (`oklch(0.95 0.02 0)`)
- **Accent**: Purple accent (`oklch(0.3 0.15 280)`)

### Typography
- **Headings**: Geist (system font)
- **Body**: Geist (system font)
- **Code**: Geist Mono

### Design Principles
- Clean, minimal aesthetics
- Generous whitespace
- Professional rounded corners (0.5rem)
- No excessive gradients
- Subtle shadows only when necessary
- Focus on clarity and readability

## 📚 API Endpoints

### AI Generation

#### POST `/api/ai/generate-prd`
Generate a comprehensive PRD from a prompt
```json
{
  "prompt": "I want to build a modern SaaS landing page..."
}
```

#### POST `/api/ai/generate-frontend`
Generate frontend code
```json
{
  "prompt": "...",
  "prd": "..."
}
```

#### POST `/api/ai/generate-backend`
Generate backend code
```json
{
  "prompt": "...",
  "prd": "...",
  "frontendCode": "..."
}
```

### Projects

#### POST `/api/projects/download`
Generate and upload project ZIP
```json
{
  "prompt": "...",
  "prd": "...",
  "frontendCode": "...",
  "backendCode": "..."
}
```

## 📦 Output - What You Get

Each project download includes:

```
project.zip
├── README.md                 # Project documentation
├── DEPLOYMENT.md            # Deployment instructions
├── package.json            # Project dependencies
├── .env.example            # Environment template
├── frontend/
│   ├── index.html         # Complete HTML file
│   ├── styles.css         # Extracted CSS
│   └── script.js          # Extracted JavaScript
└── backend/
    ├── package.json       # Backend dependencies
    ├── server.js          # Express server
    ├── .env.example       # Backend config template
    └── prisma/
        └── schema.prisma  # Database schema
```

All code is:
- ✅ Production-ready
- ✅ Fully functional
- ✅ Tested and integrated
- ✅ Ready to deploy
- ✅ Well-documented

## 🔒 Security

- **Sandbox iframes**: Frontend previews run in isolated iframes
- **Server-side generation**: All AI calls happen on the backend
- **Environment variables**: Sensitive data never exposed to frontend
- **Database security**: Neon provides enterprise-grade PostgreSQL security
- **Blob storage**: Private access tokens for ZIP files

## 📊 Database Schema

### Users
- Store user accounts and authentication

### Projects
- Track project metadata and status
- Store prompts, PRD, and generated code

### ProjectContents
- Store detailed content for projects
- Structured data for easy retrieval

### GeneratedCodes
- Store each generation stage
- Language tracking (markdown, typescript, javascript)

### DownloadHistories
- Track all downloads
- Storage of generated ZIP files

## 🚀 Deployment

### Deploy Frontend to Vercel

```bash
git push origin main
# Automatically deploys via GitHub integration
```

### Deploy Backend

**Option 1: Railway.app**
```bash
railway link
railway up
```

**Option 2: Render.com**
1. Connect GitHub repository
2. Select Python/Node environment
3. Set environment variables
4. Deploy

**Option 3: Self-hosted (AWS, DigitalOcean)**
- Use Docker for containerization
- Set environment variables
- Configure PostgreSQL connection
- Deploy with your preferred hosting

### Database Setup

**Neon PostgreSQL:**
1. Create project on [neon.tech](https://neon.tech)
2. Copy connection string
3. Set as `DATABASE_URL`

**Migration:**
```bash
pnpm prisma migrate deploy
```

## 🔧 Development

### Adding a New AI Provider

1. Install SDK:
   ```bash
   pnpm add @ai-sdk/provider-name
   ```

2. Create API endpoint in `app/api/ai/`

3. Update environment variables

4. Use in builder workflow

### Customizing Generated Code

Edit system prompts in API endpoints to adjust:
- Code style and formatting
- Feature emphasis
- Technology choices
- Output structure

## 📈 Performance Optimization

- **Streaming responses**: Real-time PRD and code generation
- **Code splitting**: Lazy load builder components
- **Image optimization**: Automatic WebP conversion
- **Database indexing**: Fast queries on project lookup
- **Caching**: Browser and server-side caching

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📄 License

MIT License - feel free to use for commercial projects

## 🆘 Support

- **Documentation**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues**: GitHub Issues
- **Email**: support@brainwave.ai

## 🎯 Roadmap

- [ ] User authentication (next-auth)
- [ ] Project version control
- [ ] Team collaboration
- [ ] Custom domain deployment
- [ ] CI/CD pipeline integration
- [ ] Advanced analytics
- [ ] API rate limiting
- [ ] Batch project generation

## 🙏 Acknowledgments

Built with:
- Next.js & React
- OpenAI & Anthropic APIs
- Tailwind CSS
- Shadcn/ui components
- Neon PostgreSQL
- Vercel Blob

---

**Created with ❤️ by Brainwave AI Team**

Transform your website ideas into production-ready code in minutes.
