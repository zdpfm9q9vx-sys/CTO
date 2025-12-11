# Learning Dashboard

A modern learning platform built with Next.js 14, TypeScript, TailwindCSS, shadcn UI, and Supabase authentication.

## Features

- 🔐 Google OAuth authentication via Supabase
- 🎨 Light/Dark theme toggle with per-user persistence
- 📱 Responsive design with mobile support
- 🎯 Protected routes with automatic redirects
- 🔒 Row-level security for user data isolation
- 📊 Dashboard with placeholder panes for subjects, files, and AI assistance
- 🎨 Modern UI built with shadcn components

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **UI Components:** shadcn/ui
- **Authentication:** Supabase Auth
- **Database:** Supabase (PostgreSQL)

## Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- Google OAuth credentials configured in Supabase

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Authentication > Providers
3. Enable Google provider and add your OAuth credentials:
   - Get OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/)
   - Add authorized redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback`
4. Add your site URL in Authentication > URL Configuration:
   - Site URL: `http://localhost:3000` (for development)
   - Redirect URLs: `http://localhost:3000/**`

### 4. Configure environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

You can find these values in your Supabase project settings under API.

### 5. Set up Row-Level Security (RLS)

Run the following SQL in your Supabase SQL Editor to enable per-user data isolation:

```sql
-- Enable RLS on tables (example for future tables)
-- When you create tables for subjects, files, etc., add RLS policies like:

-- Example: Create a subjects table with RLS
CREATE TABLE subjects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own subjects
CREATE POLICY "Users can view own subjects"
  ON subjects FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only insert their own subjects
CREATE POLICY "Users can insert own subjects"
  ON subjects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own subjects
CREATE POLICY "Users can update own subjects"
  ON subjects FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can only delete their own subjects
CREATE POLICY "Users can delete own subjects"
  ON subjects FOR DELETE
  USING (auth.uid() = user_id);

-- Repeat similar patterns for files and other user-specific tables
```

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── auth/callback/         # OAuth callback handler
│   ├── dashboard/             # Protected dashboard pages
│   │   ├── subjects/          # Subjects page
│   │   ├── files/             # Files page
│   │   ├── ai/                # AI assistant page
│   │   ├── layout.tsx         # Dashboard layout with auth check
│   │   └── page.tsx           # Dashboard home
│   ├── login/                 # Login page
│   ├── layout.tsx             # Root layout with theme provider
│   └── page.tsx               # Root redirect page
├── components/
│   ├── layout/                # Layout components
│   │   ├── topbar.tsx         # Top navigation bar
│   │   └── sidebar.tsx        # Side navigation
│   ├── providers/             # Context providers
│   │   └── theme-provider.tsx # Theme provider wrapper
│   ├── ui/                    # shadcn UI components
│   └── theme-toggle.tsx       # Theme toggle component
├── lib/
│   ├── supabase/              # Supabase utilities
│   │   ├── client.ts          # Browser client
│   │   ├── server.ts          # Server client & helpers
│   │   └── middleware.ts      # Auth middleware
│   └── utils.ts               # Utility functions
└── middleware.ts              # Next.js middleware for auth
```

## Authentication Flow

1. **Unauthenticated users** are redirected to `/login`
2. User clicks "Continue with Google"
3. Supabase handles OAuth flow with Google
4. User is redirected back to `/auth/callback`
5. Session is established and user is redirected to `/dashboard`
6. **Authenticated users** can access protected routes
7. Theme preference is persisted via localStorage

## Protected Routes

The middleware automatically protects all routes except:
- `/login` - Login page
- `/auth/*` - Auth callback routes
- Static assets

Authenticated users trying to access `/login` are redirected to `/dashboard`.

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Testing Authentication

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. You should be redirected to the login page
4. Click "Continue with Google"
5. Complete Google OAuth flow
6. You should be redirected to the dashboard
7. Try toggling between light and dark themes
8. Sign out and verify redirect to login page

## Per-User Data Isolation

This application implements Row-Level Security (RLS) at the database level to ensure:
- Each user can only access their own data
- Database-level enforcement (not just application-level)
- Protection against malicious queries
- Future-proof as you add more tables

When creating new tables, always:
1. Add a `user_id` column referencing `auth.users(id)`
2. Enable RLS: `ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;`
3. Create policies for SELECT, INSERT, UPDATE, DELETE operations
4. Test policies with different users

## Deployment

This application can be deployed to Vercel, Netlify, or any platform that supports Next.js.

### Vercel Deployment

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Update Supabase redirect URLs with your production URL
5. Deploy

## License

MIT
