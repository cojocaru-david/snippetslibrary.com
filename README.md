# 🗃️ Snippets Library

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Bun](https://img.shields.io/badge/Bun-000000?style=flat&logo=bun&logoColor=white)](https://bun.sh/)

<p align="center">
  <img src=".github/images/1.png" alt="Snippets Library Preview 1" width="45%" />
  <img src=".github/images/2.png" alt="Snippets Library Preview 2" width="45%" />
</p>
<p align="center">
  <img src=".github/images/3.png" alt="Snippets Library Preview 3" width="45%" />
  <img src=".github/images/4.png" alt="Snippets Library Preview 4" width="45%" />
</p>

A modern, full-stack code snippet manager built with cutting-edge technologies. Store, organize, and share your code snippets with beautiful syntax highlighting and a clean, intuitive interface.

### 🔥 Core Features
- **Smart Code Storage**: Save code snippets with intelligent language detection
- **Syntax Highlighting**: Beautiful syntax highlighting for 20+ programming languages
- **Public/Private Snippets**: Control visibility of your code snippets
- **Instant Search**: Fast search through your snippets by title, description, or content
- **Advanced Filtering**: Filter by language, visibility, and creation date
- **Share Snippets**: Generate shareable links for public snippets
- **Copy to Clipboard**: One-click code copying with visual feedbacks

## 🏗️ Tech Stack

### Frontend
- **React** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript with excellent DX
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **React Router** - Client-side routing

### Backend
- **Bun** - Fast JavaScript runtime and package manager
- **Hono** - Modern web framework for edge computing
- **Drizzle ORM** - Type-safe database ORM
- **PostgreSQL** - Robust relational database

### DevOps & Deployment
- **Cloudflare Workers** - Edge computing platform
- **GitHub Actions** - CI/CD automation
- **Drizzle Kit** - Database migrations and introspection
- **ESLint** - Code linting and formatting

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) installed on your system
- [PostgreSQL database](https://www.postgresql.org/) (local or cloud)
- [GitHub OAuth App](https://github.com/settings/developers) configured

### 1. Clone the Repository
```bash
git clone https://github.com/cojocaru-david/snippetslibrary.com.git
cd snippetslibrary.com
```

### 2. Install Dependencies
```bash
bun install
```

### 3. Environment Setup
Create a `.env` file in the `server` directory:
```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/snippets_library

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Frontend URL (for OAuth redirects)
FRONTEND_URL=http://localhost:5173
```

### 4. Database Setup
```bash
# Navigate to server directory
cd server

# Run database migrations
bun run db:migrate

# (Optional) Seed the database
bun run db:seed
```

### 5. Start Development
```bash
# Start all services (from root directory)
bun run dev

# Or start individually:
bun run dev:server   # Backend on port 8000
bun run dev:client   # Frontend on port 5173
```

Visit `http://localhost:5173` to see the application!

## 📁 Project Structure

```
snippetslibrary.com/
├── client/         # Frontend (React + Vite + Tailwind + shadcn/ui)
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page views
│   │   ├── contexts/     # Global state (Auth, Settings)
│   │   ├── hooks/        # Custom hooks
│   │   ├── lib/          # Utilities (API, helpers)
│   │   └── types/        # TypeScript types
│   └── vite.config.ts
│
├── server/         # Backend (Bun + Hono + Drizzle + JWT)
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── db/           # DB config & schema
│   │   ├── lib/          # Auth & middleware
│   │   └── index.ts      # App entry point
│   ├── drizzle/          # Migrations
│   └── wrangler.jsonc    # Cloudflare Workers config
│
├── shared/         # Shared types across client & server
│   └── src/types/
│
└── package.json     # Root config (monorepo)

```

## 🔧 API Reference

### Authentication
- `GET /api/auth/login` - Initiate GitHub OAuth login
- `GET /api/auth/callback` - Handle OAuth callback
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout user

### Snippets
- `GET /api/snippets` - Get user's snippets (paginated)
- `GET /api/snippets/:id` - Get specific snippet
- `POST /api/snippets` - Create new snippet
- `PUT /api/snippets/:id` - Update snippet
- `DELETE /api/snippets/:id` - Delete snippet
- `POST /api/snippets/:id/share` - Generate share link
- `GET /api/snippets/share/:shareId` - Get shared snippet

### Query Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 50)
- `language` - Filter by programming language
- `search` - Search in title/description
- `public` - Filter by visibility (true/false)

## 🌟 Features in Detail

### Code Highlighting
- Supports 20+ programming languages
- Automatic language detection
- Multiple themes (light/dark)
- Copy code with syntax preservation
- Code formatting

### Sharing System
- Generate unique shareable links
- Public snippets accessible without authentication
- SEO-friendly URLs
- Embed-friendly snippet display

### Search & Filtering
- Real-time search across title, description, and code
- Language-based filtering
- Visibility filtering (public/private)
- Date-based sorting
- Pagination for large result sets

## 🧪 Development

### Available Scripts
```bash
# Development
bun run dev              # Start all services
bun run dev:client       # Start frontend only
bun run dev:server       # Start backend only
bun run dev:shared       # Build shared types in watch mode

# Building
bun run build            # Build all projects
bun run build:client     # Build frontend
bun run build:server     # Build backend
bun run build:shared     # Build shared types

# Database
bun run db:migrate       # Run database migrations
bun run db:reset         # Reset database
bun run db:seed          # Seed database with sample data
bun run db:studio        # Open database studio

# Deployment
bun run deploy:server    # Deploy to Cloudflare Workers
```

## 📊 Database Schema

### Users Table
- `id` - UUID primary key
- `github_id` - GitHub user ID
- `username` - GitHub username
- `email` - User email
- `name` - Display name
- `avatar_url` - Profile picture URL
- `bio` - User biography
- `ui_theme` - UI theme preference
- `code_theme` - Code highlighting theme
- `created_at` - Account creation date
- `updated_at` - Last update date

### Snippets Table
- `id` - UUID primary key
- `title` - Snippet title
- `description` - Optional description
- `code` - Snippet code content
- `language` - Programming language
- `tags` - JSON array of tags
- `is_public` - Visibility flag
- `share_id` - Unique sharing identifier
- `user_id` - Foreign key to users
- `seo_title` - SEO title for public snippets
- `seo_description` - SEO description
- `seo_keywords` - SEO keywords
- `created_at` - Creation date
- `updated_at` - Last update date

### Sessions Table
- `id` - Session ID
- `user_id` - Foreign key to users
- `access_token` - OAuth access token
- `expires_at` - Session expiration
- `created_at` - Session creation date

## 🚢 Deployment

### Cloudflare Workers (Recommended)
```bash
# Build and deploy
bun run build
bun run deploy:server

# Set environment variables in Cloudflare dashboard
# Configure custom domain if needed
```

### Traditional Hosting
```bash
# Build all projects
bun run build

# Deploy client to static hosting (Vercel, Netlify, etc.)
# Deploy server to any Node.js hosting provider
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Update documentation as needed
- Follow the existing code style
- Use conventional commits

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Shiki](https://shiki.style/) for syntax highlighting
- [Drizzle ORM](https://orm.drizzle.team/) for type-safe database queries
- [Hono](https://hono.dev/) for the lightweight web framework
- [Bun](https://bun.sh/) for the fast JavaScript runtime
- [BHVR](https://bhvr.dev/) the base for the project

## 📞 Support

- Create an [issue](https://github.com/cojocaru-david/snippetslibrary.com/issues) for bug reports
- Start a [discussion](https://github.com/cojocaru-david/snippetslibrary.com/discussions) for questions

---

<p align="center">Built with ❤️ by developers, for developers</p>