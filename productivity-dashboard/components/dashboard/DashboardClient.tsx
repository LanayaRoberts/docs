"use client";

import { useState } from "react";
import { Task, Habit, HabitLog, Note } from "@/lib/schema";
import { format } from "date-fns";
import TasksPanel from "./TasksPanel";
import HabitsPanel from "./HabitsPanel";
import NotesPanel from "./NotesPanel";
import StatsBar from "./StatsBar";
import PomodoroWidget from "./PomodoroWidget";
import Sidebar from "./Sidebar";

interface DashboardClientProps {
  tasks: Task[];
  habits: Habit[];
  notes: Note[];
  habitLogs: HabitLog[];
  stats: {
    completedToday: number;
    totalTasks: number;
    totalHabits: number;
    weeklyPomodoros: number;
  };
  today: string;
}

export default function DashboardClient({
  tasks: initialTasks,
  habits: initialHabits,
  notes: initialNotes,
  habitLogs: initialHabitLogs,
  stats: initialStats,
  today,
}: DashboardClientProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [habits, setHabits] = useState(initialHabits);
  const [notes, setNotes] = useState(initialNotes);
  const [habitLogs, setHabitLogs] = useState(initialHabitLogs);
  const [activeView, setActiveView] = useState<"overview" | "tasks" | "habits" | "notes" | "timer">("overview");

  const completedTasks = tasks.filter(t => t.status === "done").length;
  const pendingTasks = tasks.filter(t => t.status !== "done").length;

  const todayLogs = habitLogs.filter(l => l.completedDate === today);
  const habitsCompletedToday = todayLogs.length;

  async function refreshTasks() {
    const res = await fetch("/api/tasks");
    if (res.ok) {
      const data = await res.json();
      setTasks(data);
    }
  }

  async function refreshHabits() {
    const res = await fetch("/api/habits");
    if (res.ok) {
      const { habits: h, logs: l } = await res.json();
      setHabits(h);
      setHabitLogs(l);
    }
  }

  async function refreshNotes() {
    const res = await fetch("/api/notes");
    if (res.ok) {
      const data = await res.json();
      setNotes(data);
    }
  }

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="noise-bg min-h-screen flex">
      {/* Sidebar */}
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 relative z-10">
        {/* Header */}
        <header className="mb-8 animate-fade-in-up">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[var(--text-muted)] text-sm font-mono mb-1">
                {format(new Date(), "EEEE, MMMM do")}
              </p>
              <h1 className="font-display text-4xl text-[var(--text-primary)]">
                {greeting()}, LaNaya
              </h1>
            </div>
            <div className="text-right">
              <p className="text-[var(--text-muted)] text-xs font-mono mb-1">daily progress</p>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--lavender)] to-[var(--jade)] rounded-full transition-all duration-1000"
                    style={{
                      width: `${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="text-[var(--text-secondary)] text-sm font-mono">
                  {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Bar */}
        <StatsBar
          completedTasks={completedTasks}
          pendingTasks={pendingTasks}
          habitsCompletedToday={habitsCompletedToday}
          totalHabits={habits.length}
          weeklyPomodoros={initialStats.weeklyPomodoros}
        />

        {/* Content Grid */}
        {activeView === "overview" && (
          <div className="grid grid-cols-12 gap-6 mt-6">
            {/* Tasks Column */}
            <div className="col-span-5 animate-fade-in-up delay-200">
              <TasksPanel
                tasks={tasks.slice(0, 8)}
                onRefresh={refreshTasks}
                today={today}
              />
            </div>

            {/* Middle Column */}
            <div className="col-span-4 flex flex-col gap-6 animate-fade-in-up delay-300">
              <HabitsPanel
                habits={habits.slice(0, 5)}
                habitLogs={habitLogs}
                onRefresh={refreshHabits}
                today={today}
              />
              <PomodoroWidget tasks={tasks.filter(t => t.status !== "done")} />
            </div>

            {/* Notes Column */}
            <div className="col-span-3 animate-fade-in-up delay-400">
              <NotesPanel
                notes={notes.slice(0, 4)}
                onRefresh={refreshNotes}
              />
            </div>
          </div>
        )}

        {activeView === "tasks" && (
          <div className="mt-6 animate-fade-in-up">
            <TasksPanel tasks={tasks} onRefresh={refreshTasks} today={today} expanded />
          </div>
        )}

        {activeView === "habits" && (
          <div className="mt-6 animate-fade-in-up">
            <HabitsPanel
              habits={habits}
              habitLogs={habitLogs}
              onRefresh={refreshHabits}
              today={today}
              expanded
            />
          </div>
        )}

        {activeView === "notes" && (
          <div className="mt-6 animate-fade-in-up">
            <NotesPanel notes={notes} onRefresh={refreshNotes} expanded />
          </div>
        )}

        {activeView === "timer" && (
          <div className="mt-6 animate-fade-in-up flex justify-center">
            <PomodoroWidget tasks={tasks.filter(t => t.status !== "done")} expanded />
          </div>
        )}
      </main>
    </div>
  );
}
