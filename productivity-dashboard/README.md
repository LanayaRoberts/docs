# Focus — Personal Productivity Dashboard

A beautiful, dark-themed productivity dashboard built with Next.js 14, Neon PostgreSQL, and Drizzle ORM. Features task management, habit tracking with streaks, quick notes, and a Pomodoro timer.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Neon PostgreSQL (serverless)
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

---

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd productivity-dashboard
npm install
```

### 2. Set up Neon Database

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. From the dashboard, go to **Connection Details**
4. Copy the **Connection string** (it looks like `postgres://user:pass@host/db?sslmode=require`)

### 3. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
DATABASE_URL=your_neon_connection_string_here
```

### 4. Initialize the Database

Open your Neon dashboard → **SQL Editor** and run the contents of `drizzle/init.sql`:

```sql
-- Copy and paste the contents of drizzle/init.sql
```

Or if you want to use Drizzle Kit:
```bash
npm install -g drizzle-kit
npx drizzle-kit push:pg
```

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

### Option A: Vercel + Neon Integration (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. In the Vercel dashboard, go to **Storage** → **Connect Store** → **Neon**
4. This automatically sets `DATABASE_URL` for you
5. Deploy!

### Option B: Manual Environment Variable

1. Push to GitHub and import to Vercel
2. In Vercel project settings → **Environment Variables**
3. Add `DATABASE_URL` = your Neon connection string
4. Deploy

---

## Project Structure

```
productivity-dashboard/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Dashboard page (server component)
│   ├── globals.css         # Global styles & design tokens
│   └── api/
│       ├── tasks/          # GET, POST, PATCH, DELETE tasks
│       ├── habits/         # GET, POST habits + log toggling
│       ├── notes/          # GET, POST, PATCH, DELETE notes
│       └── pomodoro/       # POST pomodoro sessions
├── components/
│   └── dashboard/
│       ├── DashboardClient.tsx   # Main client wrapper
│       ├── Sidebar.tsx           # Navigation sidebar
│       ├── StatsBar.tsx          # Top stats row
│       ├── TasksPanel.tsx        # Task management
│       ├── HabitsPanel.tsx       # Habit tracker with streaks
│       ├── NotesPanel.tsx        # Quick notes
│       └── PomodoroWidget.tsx    # Focus timer
├── lib/
│   ├── db.ts               # Neon + Drizzle connection
│   └── schema.ts           # Database schema
├── drizzle/
│   └── init.sql            # SQL to create tables
└── drizzle.config.ts       # Drizzle Kit config
```

## Features

| Feature | Description |
|---------|-------------|
| ✅ Tasks | Add, complete, delete tasks with priority levels (High/Med/Low) |
| 🔥 Habits | Track daily habits with 7-day grid view and streak counter |
| 📝 Notes | Quick notes with color coding and pin support |
| ⏱️ Pomodoro | 25/5/15 min timer with auto phase switching, logs sessions |
| 📊 Stats | Live dashboard stats — completed tasks, habits, weekly sessions |
| 🌙 Dark theme | Deep ink + lavender/gold/jade accent palette |

## Customization

- **Change your name**: Edit `DashboardClient.tsx` line with `{greeting()}, LaNaya`
- **Add more habits**: Use the + button in the Habits panel
- **Timer durations**: Edit `PHASES` in `PomodoroWidget.tsx`
- **Colors**: Modify CSS variables in `globals.css`

## Database Schema

```sql
tasks          -- id, title, description, priority, status, due_date, timestamps
habits         -- id, name, description, color, icon, frequency, created_at
habit_logs     -- id, habit_id, completed_date (unique per habit per day)
notes          -- id, title, content, color, pinned, timestamps
pomodoro_sessions -- id, task_id, duration, type, completed_at
```
