# Habit Tracker

Build better habits, one day at a time. Track daily check-ins, streaks, and progress with a GitHub-style heatmap.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: Material UI (MUI) v5
- **Language**: TypeScript
- **Auth + DB**: Supabase (email/password auth + PostgreSQL)

## Features

- Email/password authentication
- Add habits with custom icons and colors
- Daily check-in toggle
- Streak tracking with fire indicator
- GitHub-style 15-week heatmap per habit
- Weekly summary with completion rate
- Motivational quotes
- Dark / light mode

## Setup

```bash
git clone https://github.com/mohashari/habit-tracker.git
cd habit-tracker
npm install
cp .env.example .env.local
# Add your Supabase URL and anon key to .env.local
npm run dev
```

## Database

Run `supabase/schema.sql` in your Supabase SQL editor to create the tables and RLS policies.

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

## Live Demo

_Coming soon_

---

> Part of [mohashari's portfolio](https://github.com/mohashari) — 10 web app projects
