# Contributing Guide

Thank you for your interest in contributing to the Learning Dashboard project!

## Getting Started

1. Read the [SETUP.md](./SETUP.md) file to get the project running locally
2. Familiarize yourself with the codebase structure
3. Check existing issues or create a new one before working on features

## Development Workflow

### Branch Naming

- `feat/feature-name` - New features
- `fix/bug-name` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions or updates

### Code Style

This project uses:
- **ESLint** for code quality
- **TypeScript** for type safety
- **Prettier** (via ESLint) for formatting

Run checks before committing:
```bash
npm run lint
npm run build
```

### Component Guidelines

#### Server Components (Default)

Use server components when:
- Fetching data from Supabase
- No client-side interactivity needed
- SEO is important

```tsx
// app/example/page.tsx
import { getUser } from "@/lib/supabase/server"

export default async function ExamplePage() {
  const user = await getUser()
  return <div>Hello {user?.email}</div>
}
```

#### Client Components

Use client components when:
- Using React hooks (useState, useEffect, etc.)
- Adding event handlers (onClick, onChange, etc.)
- Using browser APIs (window, localStorage, etc.)

```tsx
"use client"

import { useState } from "react"

export default function ExampleComponent() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### Supabase Usage

#### Client-Side Queries

```tsx
"use client"

import { createClient } from "@/lib/supabase/client"

export function ClientComponent() {
  const supabase = createClient()
  
  const fetchData = async () => {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
    // Handle data
  }
  
  return <div>...</div>
}
```

#### Server-Side Queries

```tsx
import { createClient } from "@/lib/supabase/server"

export async function ServerComponent() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
  
  return <div>...</div>
}
```

### Adding New Features

#### 1. Database Tables

When adding new tables:

```sql
-- Create table
CREATE TABLE example (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE example ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Users can view own data"
  ON example FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data"
  ON example FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data"
  ON example FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own data"
  ON example FOR DELETE
  USING (auth.uid() = user_id);

-- Add index
CREATE INDEX idx_example_user_id ON example(user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_example_updated_at
  BEFORE UPDATE ON example
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### 2. New Routes

Protected routes (require authentication):
```tsx
// app/dashboard/new-feature/page.tsx
import { getUser } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function NewFeaturePage() {
  const user = await getUser()
  
  if (!user) {
    redirect("/login")
  }
  
  return <div>Your content</div>
}
```

Public routes:
```tsx
// app/public-page/page.tsx
export default function PublicPage() {
  return <div>Public content</div>
}
```

#### 3. New UI Components

Follow shadcn/ui patterns:

```tsx
// components/example-component.tsx
import { cn } from "@/lib/utils"

interface ExampleProps {
  className?: string
  children: React.ReactNode
}

export function Example({ className, children }: ExampleProps) {
  return (
    <div className={cn("default-classes", className)}>
      {children}
    </div>
  )
}
```

### TypeScript Guidelines

- Always define prop interfaces
- Use `type` for simple types, `interface` for objects
- Avoid `any` - use `unknown` if truly dynamic
- Use TypeScript's utility types (`Partial<T>`, `Pick<T>`, etc.)

```tsx
interface UserProfile {
  id: string
  email: string
  name?: string
}

type UserStatus = 'active' | 'inactive' | 'pending'

interface ComponentProps {
  user: UserProfile
  status: UserStatus
  onUpdate?: (user: Partial<UserProfile>) => void
}
```

### Testing

Currently, the project focuses on:
- Type checking: `npm run build`
- Linting: `npm run lint`
- Manual testing of auth flows

Future: Add unit and integration tests

### Commit Messages

Follow conventional commits:

- `feat: add subject creation form`
- `fix: resolve login redirect loop`
- `docs: update setup instructions`
- `refactor: extract auth logic to hook`
- `style: format with prettier`
- `test: add auth flow tests`

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run lint` and `npm run build`
5. Commit with clear messages
6. Push to your fork
7. Open a pull request with:
   - Clear description of changes
   - Screenshots for UI changes
   - Testing steps
   - Related issue numbers

## Common Patterns

### Loading States

```tsx
"use client"

import { useState, useEffect } from "react"

export function DataComponent() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      // Fetch data
      setLoading(false)
    }
    fetchData()
  }, [])
  
  if (loading) return <div>Loading...</div>
  return <div>{/* Render data */}</div>
}
```

### Error Handling

```tsx
const { data, error } = await supabase
  .from('subjects')
  .select('*')

if (error) {
  console.error('Error fetching subjects:', error)
  // Show user-friendly message
  return
}

// Use data
```

### Form Handling

```tsx
"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function CreateForm() {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    
    const { error } = await supabase
      .from('subjects')
      .insert({ name })
    
    if (error) {
      console.error('Error:', error)
    } else {
      // Success
    }
    
    setLoading(false)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="name" required />
      <button disabled={loading}>
        {loading ? 'Creating...' : 'Create'}
      </button>
    </form>
  )
}
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## Questions?

Open an issue or discussion on GitHub.
