import { db } from "@/lib/db";
import { tasks, habits, habitLogs, notes, pomodoroSessions } from "@/lib/schema";
import { desc, eq, and, gte, count, sql } from "drizzle-orm";
import { format, startOfDay, subDays } from "date-fns";
import DashboardClient from "@/components/dashboard/DashboardClient";

async function getDashboardData() {
  const today = format(new Date(), "yyyy-MM-dd");
  const sevenDaysAgo = format(subDays(new Date(), 7), "yyyy-MM-dd");

  const [
    allTasks,
    allHabits,
    recentNotes,
    recentHabitLogs,
    pomodoroCount,
  ] = await Promise.all([
    db.select().from(tasks).orderBy(desc(tasks.createdAt)).limit(20),
    db.select().from(habits).orderBy(desc(habits.createdAt)),
    db.select().from(notes).orderBy(desc(notes.pinned), desc(notes.updatedAt)).limit(6),
    db.select().from(habitLogs).where(gte(habitLogs.completedDate, sevenDaysAgo)),
    db.select({ count: count() }).from(pomodoroSessions).where(
      gte(pomodoroSessions.completedAt, subDays(new Date(), 7))
    ),
  ]);

  const completedToday = allTasks.filter(t => t.status === "done").length;
  const totalTasks = allTasks.length;
  const todayPomodoros = (pomodoroCount[0]?.count || 0);

  return {
    tasks: allTasks,
    habits: allHabits,
    notes: recentNotes,
    habitLogs: recentHabitLogs,
    stats: {
      completedToday,
      totalTasks,
      totalHabits: allHabits.length,
      weeklyPomodoros: Number(todayPomodoros),
    },
    today,
  };
}

export default async function DashboardPage() {
  try {
    const data = await getDashboardData();
    return <DashboardClient {...data} />;
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="card p-8 max-w-lg text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="font-display text-2xl text-[var(--text-primary)] mb-3">Database Not Connected</h1>
          <p className="text-[var(--text-secondary)] text-sm mb-6">
            Set up your <code className="text-[var(--gold)] bg-[var(--bg-deep)] px-1 py-0.5 rounded">DATABASE_URL</code> environment variable to get started.
          </p>
          <div className="text-left bg-[var(--bg-deep)] rounded-lg p-4 text-xs font-mono text-[var(--jade)]">
            <p className="text-[var(--text-muted)] mb-2"># .env.local</p>
            <p>DATABASE_URL=postgres://...</p>
          </div>
          <p className="text-[var(--text-muted)] text-xs mt-4">
            See <strong className="text-[var(--text-secondary)]">README.md</strong> for setup instructions.
          </p>
        </div>
      </div>
    );
  }
}
