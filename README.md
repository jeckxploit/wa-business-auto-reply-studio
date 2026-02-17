# 💬 Auto Reply Studio

<div align="center">

Professional Auto Reply Template Generator for Modern Businesses

**Generate, customize, and manage response templates with ease.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2d3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

[Live Demo](#) • [Features](#-features) • [Architecture](#-architecture) • [Getting Started](#-getting-started)

</div>

---

## 📸 Screenshots

### Desktop View (Light Mode)
![Desktop Light Mode](./screenshots/desktop-light.png)

### Desktop View (Dark Mode)
![Desktop Dark Mode](./screenshots/desktop-dark.png)

### Mobile View
![Mobile View](./screenshots/mobile.png)

### Dashboard Stats
![Dashboard Stats](./screenshots/dashboard.png)

### Saved Templates
![Saved Templates](./screenshots/templates.png)

### Lighthouse Performance Score
![Lighthouse Score](./screenshots/lighthouse.png)

---

## ✨ Features

### 🎨 **Smart Template Engine**
- **5 Template Categories**: Business Open, Business Closed, Promotion, Order Confirmation, Payment Reminder
- **3 Tone Variations**: Formal, Semi-Formal, and Casual response styles
- **Real-time Preview**: See changes instantly as you customize
- **Placeholder System**: Dynamic fields (`{{name}}`, `{{business}}`, `{{hours}}`)

### 🛠️ **Advanced Functionality**
- **Character Counter**: Track message length (WhatsApp limit: 1000 characters)
- **WhatsApp Link Generator**: Create shareable `wa.me` links with pre-filled messages
- **Template Management**: Save, load, and delete your templates
- **One-click Copy**: Copy templates to clipboard instantly
- **Export as .txt**: Download templates as text files

### 🎯 **Professional Features**
- **Mini Dashboard**: Track generated templates, saved templates, and most used category
- **Dark/Light Mode**: System preference detection with localStorage persistence
- **Responsive Design**: Mobile-first approach with smooth transitions
- **Micro-interactions**: Hover effects, animations, and visual feedback
- **Noise Texture Background**: Subtle pattern in dark mode for depth

### 🔒 **Security First**
- **Input Sanitization**: All user inputs are sanitized to prevent XSS attacks
- **Server-side Validation**: All operations validated on the backend
- **Safe Database Queries**: Prisma ORM prevents SQL injection
- **XSS Prevention**: Regex-based safe placeholder replacement

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React UI   │  │  Zustand    │  │   React     │      │
│  │  (Page.tsx)  │  │   Store     │  │   Hooks     │      │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘      │
│         │                 │                                  │
│         └─────────────────┼──────────────────┐              │
│                           │                  │              │
│                    fetch() API            Toast             │
└───────────────────────────┼──────────────────┼──────────────┘
                            │                  │
                            ▼                  │
┌─────────────────────────────────────────────────────────────┐
│                   Next.js App Router                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                API Routes                              │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │ /templates  │  │ /templates/ │  │ /templates/ │  │  │
│  │  │    GET      │  │    POST     │  │  /generate  │  │  │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  │  │
│  │         │                │                │          │  │
│  │         └────────────────┼────────────────┘          │  │
│  │                          │                             │  │
│  │                  ┌───────▼────────┐                    │  │
│  │                  │  Validation    │                    │  │
│  │                  │  & Sanitization│                    │  │
│  │                  └───────┬────────┘                    │  │
│  └──────────────────────────┼─────────────────────────────┘  │
│                             │                                 │
└─────────────────────────────┼─────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Prisma ORM                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Template Model                            │  │
│  │  - id, customerName, businessName                     │  │
│  │  - operationalHours, status, tone                     │  │
│  │  - category, content, timestamps                      │  │
│  └────────────────────────┬─────────────────────────────┘  │
└───────────────────────────┼─────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   SQLite Database                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Templates Table                           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Decisions

#### Why Next.js 16 with App Router?

**Decision**: Next.js 16 with App Router was chosen as the core framework.

**Reasoning**:

1. **Server Components by Default**: Reduces client-side JavaScript bundle, improving First Contentful Paint (FCP) and Time to Interactive (TTI).

2. **Streaming & Suspense**: Progressive rendering allows showing UI parts as they become ready, improving perceived performance.

3. **File-based Routing**: Intuitive routing with layouts, error boundaries, and loading states built-in.

4. **Type Safety**: Full TypeScript support with route parameters typed automatically.

5. **Optimized Images & Fonts**: `next/image` and `next/font` prevent layout shifts and optimize assets automatically.

6. **API Routes**: Built-in backend functionality without needing a separate server.

**Trade-off**: More complex than simple React apps, but benefits outweigh complexity for production applications.

#### Why Prisma ORM?

**Decision**: Prisma 6 as the database ORM layer.

**Reasoning**:

1. **Type Safety**: Auto-generated TypeScript types based on schema eliminate "any" types and provide IDE autocomplete.

2. **Intuitive API**: Readable query syntax that's easier to maintain than raw SQL.

3. **Migration System**: Version-controlled schema changes with rollback support.

4. **Connection Pooling**: Automatic database connection management for better performance.

5. **Security**: Parameterized queries prevent SQL injection attacks.

6. **Multi-database Support**: Easy to switch from SQLite (dev) to PostgreSQL (prod).

**Code Example**:
```typescript
// Type-safe with autocomplete
const templates = await db.template.findMany({
  where: { category: 'promo' },
  orderBy: { createdAt: 'desc' }
})
// ✅ Full TypeScript inference
```

**Trade-off**: Slight performance overhead vs raw SQL, but negligible for this use case.

#### Why Zustand for State Management?

**Decision**: Zustand instead of React Context or Redux.

**Reasoning**:

1. **Minimal Boilerplate**: No providers, no action creators, no reducers.
```typescript
// Simple vs Complex
const { templates, fetchTemplates } = useTemplateStore()
// vs
<Provider store={store}>
  <Templates />
</Provider>
```

2. **Performance**: Selective subscriptions prevent unnecessary re-renders.

3. **Small Bundle**: ~1KB minified vs Redux Toolkit (~10KB).

4. **TypeScript Native**: Full type inference without extra configuration.

5. **Developer Experience**: Simple API, easy to test, no middleware complexity.

**Trade-off**: Less structured than Redux, but sufficient for this app's state complexity.

#### Why shadcn/ui Components?

**Decision**: shadcn/ui over component libraries like Material-UI or Chakra UI.

**Reasoning**:

1. **Full Ownership**: Components copied into codebase, no vendor lock-in.

2. **Radix UI Foundation**: WCAG-compliant accessibility built-in.

3. **Tailwind CSS**: Easy customization using utility classes.

4. **Tree-shakeable**: Only bundle components you use.

5. **Modern Design**: Beautiful, accessible components out of the box.

6. **TypeScript**: Full type safety with all components.

**Example Customization**:
```tsx
// Easy to modify
<Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:scale-105">
  Generate
</Button>
```

**Trade-off**: More setup than pre-styled libraries, but gives complete control.

---

## 📈 Scalability

### Current Architecture (Single-User)

```
User → Browser → Next.js Server → SQLite DB
```

### Multi-User SaaS Architecture (Future)

```
                 ┌──────────────────┐
                 │  CDN / Edge      │
                 │  (Vercel Edge)   │
                 └────────┬─────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Region 1   │  │   Region 2   │  │   Region 3   │
│   (US East)  │  │  (EU West)   │  │  (Asia)     │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └─────────────────┼─────────────────┘
                         │
                ┌────────▼────────┐
                │  Load Balancer  │
                └────────┬────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Next.js     │  │  Next.js     │  │  Next.js     │
│  Instance 1  │  │  Instance 2  │  │  Instance 3  │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └─────────────────┼─────────────────┘
                         │
                ┌────────▼────────┐
                │   PostgreSQL    │
                │   (Primary DB)  │
                └────────┬────────┘
                         │
                ┌────────▼────────┐
                │   PostgreSQL    │
                │   (Replica DB)  │
                └─────────────────┘
```

### Scalability Roadmap

#### Phase 1: Multi-User Support
- **Authentication**: NextAuth.js with OAuth (Google, GitHub)
- **User Model**: Add User table to Prisma schema
- **Data Isolation**: Filter templates by user ID
- **Session Management**: JWT tokens with refresh rotation

```typescript
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  templates Template[]
  createdAt DateTime @default(now())
}

model Template {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  // ... other fields
}
```

#### Phase 2: Database Scaling
- **Migrate to PostgreSQL**: Better for concurrent connections
- **Connection Pooling**: PgBouncer or Prisma's built-in pool
- **Read Replicas**: Separate read/write queries for performance
- **Redis Caching**: Cache frequently accessed templates

```typescript
// With Redis caching
const cached = await redis.get(`templates:${userId}`)
if (cached) return JSON.parse(cached)

const templates = await db.template.findMany({ where: { userId } })
await redis.setex(`templates:${userId}`, 3600, JSON.stringify(templates))
```

#### Phase 3: Performance Optimization
- **CDN**: Serve static assets via Vercel Edge Network
- **Image Optimization**: Next.js Image component with custom loader
- **Code Splitting**: Dynamic imports for heavy components
- **Rate Limiting**: Protect API routes from abuse

```typescript
// Rate limiting middleware
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
})
```

#### Phase 4: Monitoring & Analytics
- **Error Tracking**: Sentry for production errors
- **Performance Monitoring**: Vercel Analytics
- **User Analytics**: PostHog or Amplitude
- **Logging**: Structured logs with Winston

---

## 🔐 Security Strategy

### Security Implementation Flow

```
User Input
    │
    ▼
┌─────────────────────┐
│  Client Validation  │
│  - Required fields  │
│  - Type checking    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Send to API Route  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Server Validation  │
│  - Schema check     │
│  - Business rules   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Input Sanitization │
│  - HTML entities    │
│  - Script tags      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Prisma Query       │
│  - Parameterized    │
│  - Type-safe        │
└──────────┬──────────┘
           │
           ▼
    Database Storage
```

### Security Measures

#### 1. Input Sanitization

**Implementation**: All user inputs are sanitized before processing or storage.

```typescript
function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')         // Encode ampersands
    .replace(/</g, '&lt;')           // Encode less than
    .replace(/>/g, '&gt;')           // Encode greater than
    .replace(/"/g, '&quot;')         // Encode double quotes
    .replace(/'/g, '&#x27;')         // Encode single quotes
    .replace(/\//g, '&#x2F;')        // Encode forward slashes
}

// Usage in template generation
const safeData = {
  name: sanitizeInput(data.name),
  business: sanitizeInput(data.business),
  hours: sanitizeInput(data.hours)
}
```

**Why**: Prevents XSS (Cross-Site Scripting) attacks where malicious scripts could be injected through template fields.

#### 2. XSS Prevention

**Implementation**: Safe placeholder replacement using regex instead of `eval()` or template literals.

```typescript
// ✅ Safe - Regex replacement
const content = template.replace(/{{(\w+)}}/g, (match, key) => {
  return safeData[key] || match
})

// ❌ Dangerous - Template literal injection
const content = eval(`\`${template}\``)
```

**Why**: Direct string interpolation could execute JavaScript if template contains malicious code.

#### 3. Server-Side Validation

**Implementation**: All API routes validate inputs before processing.

```typescript
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { businessName, content } = body

  // Required field validation
  if (!businessName) {
    return NextResponse.json(
      { error: 'Business name is required' },
      { status: 400 }
    )
  }

  // Content validation
  if (content && content.length > 10000) {
    return NextResponse.json(
      { error: 'Content too long' },
      { status: 400 }
    )
  }

  // Process validated data
  const template = await db.template.create({ data: body })
  return NextResponse.json(template, { status: 201 })
}
```

**Why**: Client-side validation can be bypassed. Server validation ensures data integrity.

#### 4. Safe Database Queries

**Implementation**: Prisma ORM uses parameterized queries automatically.

```typescript
// ✅ Safe - Prisma handles escaping
await db.template.create({
  data: {
    businessName: userInput,  // Automatically escaped
    content: userInput
  }
})

// ❌ Dangerous - Raw SQL (NOT USED)
await db.$queryRaw(`
  INSERT INTO templates (businessName, content)
  VALUES ('${userInput}', '${userInput}')
`)
```

**Why**: Parameterized queries prevent SQL injection attacks.

#### 5. Type Safety

**Implementation**: Strict TypeScript configuration eliminates type-related vulnerabilities.

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUncheckedIndexedAccess": true
  }
}
```

**Why**: Catches potential security issues at compile time.

#### 6. Content Security Policy (Future)

**Planned Implementation**:

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data:;
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim()
  }
]
```

**Why**: CSP prevents unauthorized script execution.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Bun or npm
- Git

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd wa-business-auto-reply-studio

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env

# Initialize database
bun run db:push

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

### Environment Variables

```env
# Database
DATABASE_URL="file:./db/custom.db"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Available Scripts

```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint
bun run db:push      # Push schema to database
bun run db:generate  # Generate Prisma Client
```

---

## 📊 Performance & Optimization

### Performance Goals

| Metric | Target | Notes |
|--------|-------|-------|
| Performance | 95+ | Optimized for production build |
| Accessibility | 95+ | WCAG compliance |
| Best Practices | 95+ | Security & code quality |
| SEO | 95+ | Meta tags & semantic HTML |

### Key Performance Indicators

- **First Contentful Paint (FCP)**: Target < 1.2s
- **Largest Contentful Paint (LCP)**: Target < 2.5s
- **Cumulative Layout Shift (CLS)**: Target < 0.1
- **Time to Interactive (TTI)**: Target < 3.5s
- **Total Blocking Time (TBT)**: Target < 200ms

### Optimization Techniques

1. **Code Splitting**: Automatic route-based splitting
2. **Image Optimization**: Next.js Image component
3. **Font Optimization**: `next/font` for zero layout shift
4. **Bundle Analysis**: Tree-shaking unused code
5. **Lazy Loading**: Dynamic imports for heavy components
6. **CSS Optimization**: Tailwind CSS purging

---

## 🎨 Tech Stack

### Core Framework
- **Next.js 16**: React framework with App Router
- **TypeScript 5**: Type-safe development
- **React 19**: Latest React features

### Styling
- **Tailwind CSS 4**: Utility-first CSS framework
- **shadcn/ui**: Accessible component library
- **Lucide React**: Icon library

### State Management
- **Zustand**: Lightweight state management
- **React Hooks**: Built-in hooks

### Database
- **Prisma 6**: Type-safe ORM
- **SQLite**: Zero-config database (dev)
- **PostgreSQL**: Production database (planned)

### Backend
- **Next.js API Routes**: Serverless API
- **Prisma Client**: Database queries

---

## 📁 Project Structure

```
wa-business-auto-reply-studio/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                     # Static assets
│   └── screenshots/           # App screenshots
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── templates/
│   │   │       ├── route.ts           # GET/POST templates
│   │   │       ├── [id]/
│   │   │       │   └── route.ts       # DELETE template
│   │   │       └── generate/
│   │   │           └── route.ts       # Generate template
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Main application page
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   └── theme-provider.tsx        # Dark mode provider
│   ├── hooks/
│   │   └── use-toast.ts              # Toast notifications
│   ├── lib/
│   │   ├── db.ts                     # Prisma client
│   │   └── utils.ts                  # Utility functions
│   └── stores/
│       └── template-store.ts         # Zustand store
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables for Production

```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN bun install
COPY . .
RUN bun run build
EXPOSE 3000
CMD ["bun", "start"]
```

---

## 📈 Future Improvements

### 🚀 Planned Features

#### Multi-User Support
- User authentication with NextAuth.js
- Personal template libraries
- Team collaboration features
- Role-based access control

#### Cloud Database
- PostgreSQL for production
- Database backup strategies
- Connection pooling
- Read replicas for scalability

#### AI Template Generator
- GPT integration for smart suggestions
- Natural language template creation
- Sentiment analysis
- A/B testing templates

#### Multi-Language Support
- Template localization
- Multi-language UI
- RTL language support
- Automatic language detection

#### Advanced Analytics
- Template performance tracking
- Response rate analytics
- Conversion tracking
- Export analytics data

#### Real-time Features
- WebSocket integration
- Live preview updates
- Collaborative editing
- Template versioning

### 🛠️ Technical Improvements

- [ ] Add E2E testing with Playwright
- [ ] Implement Redis caching
- [ ] Add rate limiting to API routes
- [ ] Implement API versioning
- [ ] Add webhook support
- [ ] Create mobile app (React Native)
- [ ] Add Content Security Policy headers
- [ ] Implement request logging
- [ ] Add error tracking (Sentry)
- [ ] Implement feature flags

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation
- Ensure all tests pass
- Run `bun run lint` before committing

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **shadcn** for the beautiful UI components
- **Vercel** for Next.js
- **Prisma** for the excellent ORM
- **Tailwind CSS** for the utility-first CSS framework
- **Radix UI** for accessible component primitives

---

## 📞 Support

For support, email support@yourdomain.com or join our [Discord server](#).

---

<div align="center">

**Built with ❤️ for modern businesses everywhere**

[⬆ Back to Top](#-wa-business-auto-reply-studio)

</div>
