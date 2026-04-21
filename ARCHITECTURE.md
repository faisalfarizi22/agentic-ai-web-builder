# Brainwave Architecture Documentation

In-depth technical documentation of Brainwave's architecture and design decisions.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (Browser)                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Next.js Frontend (React 19)               │ │
│  │  - Landing page                                        │ │
│  │  - Builder interface with 3-panel layout               │ │
│  │  - Dashboard                                           │ │
│  │  - Live preview iframe                                 │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────┬──────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        v             v             v
    ┌───────┐  ┌──────────┐  ┌──────────┐
    │ HTTP  │  │   HTML   │  │WebSockets│
    │ Calls │  │ Streaming│  │ (future) │
    └───────┘  └──────────┘  └──────────┘
        │             │             │
        └─────────────┼─────────────┘
                      │
        ┌─────────────v─────────────┐
        │   Next.js API Routes      │
        │ (Backend Server)          │
        │ ┌───────────────────────┐ │
        │ │  AI Generation        │ │
        │ │  /api/ai/*            │ │
        │ │  - generate-prd       │ │
        │ │  - generate-frontend  │ │
        │ │  - generate-backend   │ │
        │ ├───────────────────────┤ │
        │ │  Project Management   │ │
        │ │  /api/projects/*      │ │
        │ │  - download           │ │
        │ │  - list               │ │
        │ └───────────────────────┘ │
        └────────────┬──────────────┘
        ┌────────────┼──────────────┐
        │            │              │
        v            v              v
    ┌────────┐  ┌─────────────┐  ┌──────────┐
    │AI APIs │  │  PostgreSQL │  │Blob      │
    │        │  │  (Neon)     │  │Storage   │
    │- Claude│  │             │  │(Vercel)  │
    │- OpenAI│  │ Users       │  │          │
    │- Groq  │  │ Projects    │  │Generated │
    │        │  │ Sessions    │  │ZIPs      │
    └────────┘  └─────────────┘  └──────────┘
```

## Data Flow

### 1. Prompt to PRD Generation

```
User Input (Prompt)
    │
    v
/api/ai/generate-prd
    │
    ├─> Claude 3.5 Sonnet
    │   - System Prompt: Product Manager role
    │   - Input: User prompt
    │   - Output: Comprehensive PRD
    │
    v
Store in Database
    │
    v
Return to Frontend
    │
    v
Display in UI for Review
```

### 2. Frontend Code Generation

```
Approved PRD + Original Prompt
    │
    v
/api/ai/generate-frontend
    │
    ├─> GPT-4o
    │   - System Prompt: Frontend Developer role
    │   - Input: PRD + Prompt
    │   - Output: Complete HTML/CSS/JS
    │
    v
Store in Database
    │
    v
Display in Editor + Live Preview
    │
    v
User can see real-time rendering
```

### 3. Backend Code Generation

```
PRD + Frontend Code + Original Prompt
    │
    v
/api/ai/generate-backend
    │
    ├─> GPT-4o
    │   - System Prompt: Backend Engineer role
    │   - Input: PRD + Frontend overview + Prompt
    │   - Output: Express.js + Prisma schema
    │
    v
Store in Database
    │
    v
Display in UI
    │
    v
Ready for Integration Testing
```

### 4. Project Download & Storage

```
All Generated Components
    │
    ├─> Frontend Code
    ├─> Backend Code
    ├─> Database Schema
    ├─> Configuration Files
    ├─> Documentation
    │
    v
Package as ZIP (JSZip)
    │
    v
Upload to Vercel Blob Storage
    │
    v
Store metadata in PostgreSQL
    │
    v
Return download link to user
    │
    v
User downloads complete project
```

## Database Schema Details

### Users Table
```sql
- id (PRIMARY KEY)
- email (UNIQUE)
- name
- created_at
- updated_at
```

### Projects Table
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY → users)
- title
- description
- status (enum: prompt_input, prd_generated, frontend_created, backend_created, testing, completed)
- prompt (original user input)
- prd (generated PRD)
- frontend_code (generated HTML/CSS/JS)
- backend_code (generated Express.js code)
- project_structure (JSON structure of generated files)
- created_at
- updated_at
```

### ProjectContents Table
```sql
- id (PRIMARY KEY)
- project_id (FOREIGN KEY → projects, UNIQUE)
- prd_content (full PRD markdown)
- frontend_content (complete HTML file)
- backend_content (complete backend setup)
- created_at
- updated_at
```

### GeneratedCodes Table
```sql
- id (PRIMARY KEY)
- project_id (FOREIGN KEY → projects)
- stage (enum: prd, frontend, backend)
- code (complete code text)
- language (markdown, html, javascript, typescript)
- created_at
```

### DownloadHistories Table
```sql
- id (PRIMARY KEY)
- project_id (FOREIGN KEY → projects)
- zip_blob_url (Vercel Blob URL)
- file_name (ZIP filename)
- file_size (bytes)
- created_at
```

## Frontend Architecture

### Components Hierarchy

```
App
├── RootLayout
│   └── ThemeProvider
│       ├── LandingPage
│       │   └── LandingHero
│       ├── BuilderPage
│       │   └── BuilderView
│       │       ├── Timeline (left panel)
│       │       ├── ContentArea (center)
│       │       │   ├── PromptStage
│       │       │   ├── PRDStage
│       │       │   ├── FrontendStage
│       │       │   │   ├── CodeEditor (Monaco)
│       │       │   │   └── LivePreview (iframe)
│       │       │   ├── BackendStage
│       │       │   ├── TestingStage
│       │       │   └── DownloadStage
│       │       └── ActionButtons
│       └── DashboardPage
│           └── DashboardView
```

### State Management

Uses React hooks (useState) for local component state:
- Current stage in workflow
- User inputs (prompt, approvals)
- Generated content (PRD, code)
- Loading states
- Error handling

Could be extended with SWR or TanStack Query for:
- Project caching
- Revalidation
- Optimistic updates
- Offline support

### Live Preview Implementation

```
Frontend Code (HTML string)
    │
    v
iframe.srcDoc = frontendCode
    │
    v
Browser renders HTML in sandbox
    │
    v
Sandbox attributes:
  - allow-scripts (for JavaScript)
  - allow-same-origin (for data access)
  - allow-forms (for form submission)
```

## Backend Architecture

### API Endpoints Structure

```
/api/
├── ai/
│   ├── generate-prd/
│   │   └── route.ts (POST)
│   ├── generate-frontend/
│   │   └── route.ts (POST)
│   └── generate-backend/
│       └── route.ts (POST)
└── projects/
    └── download/
        └── route.ts (POST)
```

### API Call Flow

```
Request Validation
    │
    v
Call AI Service
    │
    v
Stream/Process Response
    │
    v
Store in Database
    │
    v
Return to Client
    │
    v
Error Handling (catch block)
```

### Error Handling

- Try-catch blocks around API calls
- Detailed error logging
- User-friendly error messages
- Graceful degradation
- Rate limiting (future)

## AI Model Selection Logic

### PRD Generation: Claude 3.5 Sonnet
**Why Claude?**
- Excels at structured document creation
- Better understanding of PRD requirements
- Consistent formatting
- Long-context support
- Better reasoning for specifications

**System Prompt Focus:**
- Product Manager role
- Structured format
- Comprehensive coverage
- Clear sections

### Frontend Code: GPT-4o
**Why GPT-4o?**
- Excellent at code generation
- Good balance of speed and quality
- Strong understanding of modern web
- Can handle complex CSS/JS
- Good at responsive design

**System Prompt Focus:**
- Frontend developer role
- Production-ready code
- No external dependencies (inline CSS/JS)
- Sandbox-safe code
- Accessibility compliance

### Backend Code: GPT-4o
**Why GPT-4o?**
- Strong backend development knowledge
- Good at API design
- Understands database schemas
- Can generate Prisma schemas
- Node.js/Express expertise

**System Prompt Focus:**
- Backend engineer role
- Express.js/Prisma specific
- Database design
- API best practices
- Error handling

## Security Considerations

### Frontend Security
- **Sandbox Isolation**: Live preview runs in restricted iframe
- **Input Validation**: All user inputs validated
- **No Remote Code Execution**: Generated code runs in browser only
- **XSS Prevention**: Content properly escaped

### Backend Security
- **API Key Protection**: Keys stored in environment variables
- **Rate Limiting**: Prevent abuse (future implementation)
- **Input Sanitization**: Validate all API inputs
- **CORS Configuration**: Restrict cross-origin access

### Data Security
- **Encryption in Transit**: HTTPS/TLS
- **Database Security**: Neon provides SSL connections
- **Access Control**: User data isolated by user_id
- **Blob Storage**: Private access tokens

## Performance Optimization

### Frontend Performance
- **Code Splitting**: Lazy load builder components
- **Image Optimization**: Next.js automatic optimization
- **CSS-in-JS**: Scoped styles with Tailwind
- **Caching**: Browser cache for static assets

### Backend Performance
- **Database Indexing**: Indexes on frequently queried columns
- **API Caching**: Cache AI responses in database
- **Streaming**: Stream long responses
- **Batch Operations**: Combine multiple operations

### Network Performance
- **CDN**: Vercel's global CDN
- **Compression**: Gzip compression enabled
- **Caching Headers**: Proper cache directives
- **Code Splitting**: Only load needed code

## Scalability Architecture

### Horizontal Scaling
- **Stateless API**: Can run on multiple servers
- **Database**: Neon handles scaling
- **Blob Storage**: Vercel Blob auto-scales
- **Load Balancing**: Vercel handles load distribution

### Database Optimization
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Indexed queries
- **Caching Layer**: Cache frequent queries (future)
- **Read Replicas**: For read-heavy workloads

### Future Enhancements
- **Message Queue**: For async job processing
- **Redis Cache**: For session/temporary data
- **CDN Enhancement**: Custom image optimization
- **Background Jobs**: Process heavy generation tasks

## Deployment Architecture

### Development Environment
```
Local Machine
├── Next.js Dev Server (port 3000)
├── Local PostgreSQL (optional)
└── Environment Variables (.env.local)
```

### Staging Environment
```
Vercel Preview Deployment
├── Automatic from PR
├── Full feature parity
└── Staging database
```

### Production Environment
```
Vercel Production
├── Global CDN
├── Auto-scaling
└── Production Database (Neon)
```

## Monitoring & Observability

### Current Implementation
- Browser console logging
- Server-side console logging
- Database query logging

### Future Implementation
- **Error Tracking**: Sentry for error monitoring
- **Performance Monitoring**: Web Vitals tracking
- **Log Aggregation**: Centralized logging
- **Analytics**: User behavior tracking
- **Alerting**: Alert on errors/anomalies

## Cost Optimization

### AI API Usage
- **Claude**: ~$0.003 per 1K input / $0.015 per 1K output tokens
- **GPT-4o**: ~$0.005 per 1K input / $0.015 per 1K output tokens
- **Groq**: Cheaper/free tier available

### Database Cost
- **Neon**: Pay-as-you-go, reasonable pricing
- **Connection pooling**: Reduces connection overhead

### Storage Cost
- **Vercel Blob**: $0.50 per 1GB/month
- **Typical project ZIP**: 1-5MB

### Infrastructure Cost
- **Vercel**: Free tier to $20+/month
- **Reasonable**: For small to medium projects

## Testing Strategy

### Unit Testing (Future)
- Component testing with Vitest
- API endpoint testing
- Utility function testing

### Integration Testing
- Manual testing of complete workflow
- AI generation validation
- Database operations

### E2E Testing (Future)
- Playwright for full workflow testing
- User journey validation
- Cross-browser testing

## Documentation

- **README.md**: Overview and quick start
- **SETUP.md**: Installation and configuration
- **ARCHITECTURE.md**: This document
- **Code Comments**: Inline documentation
- **JSDoc**: Function documentation

---

**Last Updated**: April 2024
**Version**: 1.0.0
