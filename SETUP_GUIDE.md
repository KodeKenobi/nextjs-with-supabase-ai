# Setup Guide for AI Data Repository

## Environment Variables

Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xazhkbgjanwakrmvpqie.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your-supabase-anon-key-here
```

## Getting Your Supabase Anon Key

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the `anon` `public` key
4. Paste it as the value for `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY`

## Running Locally

1. Install dependencies: `npm install`
2. Create `.env.local` with the variables above
3. Run: `npm run dev`
4. Visit: http://localhost:3000

## Deploying to Vercel

1. Push this repository to GitHub
2. Connect it to Vercel
3. Add the environment variables in Vercel dashboard
4. Deploy!

## Next Steps

Once authentication is working, we can add your existing features:

- Dashboard pages
- Content management
- Company search
- Analytics
