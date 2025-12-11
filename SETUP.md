# Setup Guide

This guide will walk you through setting up the Learning Dashboard application from scratch.

## Prerequisites

Before you begin, ensure you have:

- Node.js 18 or higher installed
- A Supabase account (sign up at [supabase.com](https://supabase.com))
- A Google Cloud account (for OAuth credentials)
- Git installed

## Step 1: Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd <repository-name>

# Install dependencies
npm install
```

## Step 2: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in your project details:
   - Name: Choose a name for your project
   - Database Password: Create a strong password
   - Region: Choose the closest region to your users
4. Wait for the project to be created (this may take a few minutes)

## Step 3: Set Up Google OAuth

### Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"
4. Create OAuth credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `https://<your-project-ref>.supabase.co/auth/v1/callback`
     - Find your project ref in Supabase Settings > API
   - Click "Create"
   - Save your Client ID and Client Secret

### Configure Supabase Google OAuth

1. In your Supabase dashboard, go to "Authentication" > "Providers"
2. Find "Google" and click to enable it
3. Enter your Google OAuth credentials:
   - Client ID (from Google Cloud Console)
   - Client Secret (from Google Cloud Console)
4. Save the settings

### Configure URL Settings

1. In Supabase, go to "Authentication" > "URL Configuration"
2. Set:
   - Site URL: `http://localhost:3000` (for development)
   - Redirect URLs: Add `http://localhost:3000/**`
3. For production, you'll need to add your production URL

## Step 4: Configure Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env.local
```

2. Get your Supabase credentials:
   - Go to your Supabase project
   - Click "Settings" > "API"
   - Copy the following values:
     - Project URL
     - anon/public key

3. Update `.env.local` with your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Important:** Never commit `.env.local` to version control!

## Step 5: Set Up Database Tables

1. In your Supabase dashboard, go to "SQL Editor"
2. Copy the contents of `supabase/setup.sql`
3. Paste into the SQL Editor
4. Click "Run" to execute

This will create:
- `subjects` table with RLS policies
- `files` table with RLS policies
- `user_preferences` table with RLS policies
- `ai_conversations` table with RLS policies
- `ai_messages` table with RLS policies
- Necessary indexes for performance
- Automatic `updated_at` triggers

## Step 6: Verify Row-Level Security

1. In Supabase, go to "Authentication" > "Policies"
2. Verify that all tables have RLS enabled
3. Check that policies exist for each table:
   - Users can view own data
   - Users can insert own data
   - Users can update own data
   - Users can delete own data

## Step 7: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 8: Test the Authentication Flow

1. You should be redirected to the login page
2. Click "Continue with Google"
3. Complete the Google OAuth flow
4. You should be redirected to the dashboard
5. Try the following:
   - Toggle between light and dark themes
   - Navigate between different pages
   - Sign out and verify you're redirected to login
   - Try to access `/dashboard` while logged out (should redirect to login)

## Troubleshooting

### OAuth Redirect URI Mismatch

If you get an OAuth error about redirect URI:
- Check that you've added the correct Supabase callback URL to Google Cloud Console
- The format is: `https://<your-project-ref>.supabase.co/auth/v1/callback`
- Make sure there are no typos or extra characters

### Environment Variables Not Loading

- Make sure `.env.local` is in the root directory
- Restart the development server after changing env variables
- Check that variables start with `NEXT_PUBLIC_` for client-side access

### Build Errors

- Run `npm install` to ensure all dependencies are installed
- Delete `.next` folder and rebuild: `rm -rf .next && npm run build`
- Check Node.js version: `node --version` (should be 18+)

### Authentication Not Working

- Check Supabase project URL and anon key are correct
- Verify Google OAuth is enabled in Supabase
- Check browser console for errors
- Verify redirect URLs are configured in both Google Cloud and Supabase

### Database Access Issues

- Verify RLS policies are enabled on all tables
- Check that you're signed in (use Supabase dashboard to verify)
- Look at Supabase logs for policy errors

## Production Deployment

### Deploying to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project" and import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your production URL)
5. Deploy

### Update OAuth Settings for Production

1. Add your production URL to Google OAuth:
   - Authorized redirect URIs: `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - Authorized origins: `https://your-domain.com`

2. Update Supabase redirect URLs:
   - Add your production URL to allowed redirect URLs
   - Update site URL to your production domain

## Next Steps

Now that your app is set up, you can:

1. **Customize the branding**
   - Update colors in `tailwind.config.ts`
   - Change the logo and app name
   - Modify the theme

2. **Add features**
   - Implement subject creation
   - Add file upload functionality
   - Integrate AI chat features

3. **Enhance security**
   - Add rate limiting
   - Implement CORS policies
   - Add email verification

4. **Improve UX**
   - Add loading states
   - Implement error boundaries
   - Add toast notifications

## Support

For issues and questions:
- Check the [Next.js Documentation](https://nextjs.org/docs)
- Read [Supabase Documentation](https://supabase.com/docs)
- Review [shadcn/ui Documentation](https://ui.shadcn.com)

## Security Notes

- Always use RLS policies to protect user data
- Never expose your `service_role` key in client code
- Use environment variables for sensitive data
- Enable 2FA on your Supabase and cloud provider accounts
- Regularly update dependencies: `npm audit fix`
- Review Supabase logs for suspicious activity

## Performance Tips

- Use Next.js Image component for images
- Implement pagination for large datasets
- Use Supabase realtime subscriptions sparingly
- Enable caching where appropriate
- Monitor bundle size: `npm run build` shows the size
