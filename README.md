# 💬 Auto Reply Studio

<div align="center">

Generator Template Balasan Otomatis Profesional untuk Bisnis Modern

**Buat, sesuaikan, dan kelola template respons dengan mudah.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2d3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

[Demo Langsung](#) • [Fitur](#-fitur) • [Arsitektur](#-arsitektur) • [Memulai](#-memulai)

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

## ✨ Fitur

### 🎨 **Mesin Template Pintar**
- **5 Kategori Template**: Bisnis Buka, Bisnis Tutup, Promosi, Konfirmasi Pesanan, Pengingat Pembayaran
- **3 Variasi Nada**: Gaya respons Formal, Semi-Formal, dan Santai
- **Pratinjau Real-time**: Lihat perubahan secara instan saat menyesuaikan
- **Sistem Placeholder**: Field dinamis (`{{name}}`, `{{business}}`, `{{hours}}`)

### 🛠️ **Fungsionalitas Lanjutan**
- **Penghitung Karakter**: Lacak panjang pesan (batas WhatsApp: 1000 karakter)
- **Generator Link WhatsApp**: Buat link `wa.me` yang dapat dibagikan dengan pesan terisi otomatis
- **Manajemen Template**: Simpan, muat, dan hapus template Anda
- **Salin Satu Klik**: Salin template ke clipboard secara instan
- **Ekspor sebagai .txt**: Unduh template sebagai file teks

### 🎯 **Fitur Profesional**
- **Dashboard Mini**: Lacak template yang dibuat, template tersimpan, dan kategori paling sering digunakan
- **Mode Gelap/Terang**: Deteksi preferensi sistem dengan persistensi localStorage
- **Desain Responsif**: Pendekatan mobile-first dengan transisi halus
- **Mikro-interaksi**: Efek hover, animasi, dan umpan balik visual
- **Latar Belakang Tekstur Noise**: Pola halus dalam mode gelap untuk kedalaman

### 🔒 **Keamanan Utama**
- **Sanitasi Input**: Semua input pengguna disanitasi untuk mencegah serangan XSS
- **Validasi Sisi Server**: Semua operasi divalidasi di backend
- **Query Database Aman**: Prisma ORM mencegah injeksi SQL
- **Pencegahan XSS**: Penggantian placeholder aman berbasis regex

---

## 🏗️ Arsitektur

### Arsitektur Sistem

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

#### Mengapa Next.js 16 dengan App Router?

**Keputusan**: Next.js 16 dengan App Router dipilih sebagai framework inti.

**Alasan**:

1. **Server Components secara Default**: Mengurangi bundle JavaScript sisi klien, meningkatkan First Contentful Paint (FCP) dan Time to Interactive (TTI).

2. **Streaming & Suspense**: Rendering progresif memungkinkan menampilkan bagian UI saat siap, meningkatkan kinerja yang dirasakan.

3. **Routing Berbasis File**: Routing intuitif dengan layout, error boundaries, dan loading states bawaan.

4. **Type Safety**: Dukungan TypeScript penuh dengan parameter route yang diketik otomatis.

5. **Gambar & Font yang Dioptimalkan**: `next/image` dan `next/font` mencegah layout shifts dan mengoptimalkan aset secara otomatis.

6. **API Routes**: Fungsi backend bawaan tanpa perlu server terpisah.

**Trade-off**: Lebih kompleks daripada aplikasi React sederhana, tetapi manfaatnya lebih besar daripada kompleksitas untuk aplikasi produksi.

#### Mengapa Prisma ORM?

**Keputusan**: Prisma 6 sebagai layer ORM database.

**Alasan**:

1. **Type Safety**: Tipe TypeScript yang dihasilkan otomatis berdasarkan schema menghilangkan tipe "any" dan menyediakan autocomplete IDE.

2. **API Intuitif**: Sintaks query yang mudah dibaca dan lebih mudah dipelihara daripada SQL mentah.

3. **Sistem Migrasi**: Perubahan schema yang dikontrol versi dengan dukungan rollback.

4. **Connection Pooling**: Manajemen koneksi database otomatis untuk kinerja lebih baik.

5. **Keamanan**: Query terparameter mencegah serangan injeksi SQL.

6. **Dukungan Multi-database**: Mudah beralih dari SQLite (dev) ke PostgreSQL (prod).

**Contoh Kode**:
```typescript
// Type-safe dengan autocomplete
const templates = await db.template.findMany({
  where: { category: 'promo' },
  orderBy: { createdAt: 'desc' }
})
// ✅ Full TypeScript inference
```

**Trade-off**: Sedikit overhead kinerja vs SQL mentah, tetapi dapat diabaikan untuk kasus penggunaan ini.

#### Mengapa Zustand untuk State Management?

**Keputusan**: Zustand daripada React Context atau Redux.

**Alasan**:

1. **Boilerplate Minimal**: Tidak ada provider, action creators, atau reducers.
```typescript
// Simple vs Complex
const { templates, fetchTemplates } = useTemplateStore()
// vs
<Provider store={store}>
  <Templates />
</Provider>
```

2. **Kinerja**: Langganan selektif mencegah re-render yang tidak perlu.

3. **Bundle Kecil**: ~1KB diminimalkan vs Redux Toolkit (~10KB).

4. **TypeScript Native**: Inferensi tipe penuh tanpa konfigurasi tambahan.

5. **Pengalaman Developer**: API sederhana, mudah ditest, tanpa kompleksitas middleware.

**Trade-off**: Kurang terstruktur daripada Redux, tetapi cukup untuk kompleksitas state aplikasi ini.

#### Mengapa Komponen shadcn/ui?

**Keputusan**: shadcn/ui daripada library komponen seperti Material-UI atau Chakra UI.

**Alasan**:

1. **Kepemilikan Penuh**: Komponen disalin ke codebase, tidak ada vendor lock-in.

2. **Fondasi Radix UI**: Aksesibilitas sesuai WCAG bawaan.

3. **Tailwind CSS**: Kustomisasi mudah menggunakan utility classes.

4. **Tree-shakeable**: Hanya bundle komponen yang Anda gunakan.

5. **Desain Modern**: Komponen yang indah dan aksesibel langsung siap pakai.

6. **TypeScript**: Type safety penuh dengan semua komponen.

**Contoh Kustomisasi**:
```tsx
// Mudah dimodifikasi
<Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:scale-105">
  Generate
</Button>
```

**Trade-off**: Lebih banyak setup daripada library pre-styled, tetapi memberikan kontrol penuh.

---

## 📈 Skalabilitas

### Arsitektur Saat Ini (Single-User)

```
User → Browser → Server Next.js → DB SQLite
```

### Arsitektur Multi-User SaaS (Masa Depan)

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

## 🚀 Memulai

### Prasyarat

- Node.js 18+
- Bun atau npm
- Git

### Instalasi

```bash
# Clone repository
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

Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi Anda.

### Environment Variables

```env
# Database
DATABASE_URL="file:./db/custom.db"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Script yang Tersedia

```bash
bun run dev          # Start development server
bun run build        # Build untuk production
bun run start        # Start production server
bun run lint         # Run ESLint
bun run db:push      # Push schema ke database
bun run db:generate  # Generate Prisma Client
```

---

## 📊 Kinerja & Optimasi

### Target Kinerja

| Metrik | Target | Catatan |
|--------|-------|-------|
| Performance | 95+ | Dioptimalkan untuk production build |
| Accessibility | 95+ | Kepatuhan WCAG |
| Best Practices | 95+ | Kualitas kode & keamanan |
| SEO | 95+ | Meta tag & HTML semantik |

### Indikator Kinerja Utama

- **First Contentful Paint (FCP)**: Target < 1.2s
- **Largest Contentful Paint (LCP)**: Target < 2.5s
- **Cumulative Layout Shift (CLS)**: Target < 0.1
- **Time to Interactive (TTI)**: Target < 3.5s
- **Total Blocking Time (TBT)**: Target < 200ms

### Teknik Optimasi

1. **Code Splitting**: Split otomatis berbasis route
2. **Optimasi Gambar**: Komponen Next.js Image
3. **Optimasi Font**: `next/font` untuk zero layout shift
4. **Analisis Bundle**: Tree-shaking kode yang tidak digunakan
5. **Lazy Loading**: Import dinamis untuk komponen berat
6. **Optimasi CSS**: Tailwind CSS purging

---

## 🎨 Tech Stack

### Framework Inti
- **Next.js 16**: Framework React dengan App Router
- **TypeScript 5**: Development type-safe
- **React 19**: Fitur React terbaru

### Styling
- **Tailwind CSS 4**: Framework CSS utility-first
- **shadcn/ui**: Library komponen yang aksesibel
- **Lucide React**: Library ikon

### State Management
- **Zustand**: State management yang ringan
- **React Hooks**: Hooks bawaan

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
