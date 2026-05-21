"use client";

import { useState } from "react";
import { Habit, HabitLog } from "@/lib/schema";
import { Plus, Trash2, Flame } from "lucide-react";
import clsx from "clsx";
import { format, subDays } from "date-fns";

const HABIT_COLORS = ["#f4c55a", "#2dd4a0", "#a78bfa", "#f4725a", "#60a5fa", "#fb923c"];
const HABIT_ICONS = ["⚡", "🏃", "📚", "💧", "🧘", "🍎", "✍️", "🎯", "🌱", "💪"];

function getStreak(habitId: number, logs: HabitLog[], today: string): number {
  let streak = 0;
  let date = new Date(today);
  while (true) {
    const dateStr = format(date, "yyyy-MM-dd");
    if (logs.some(l => l.habitId === habitId && l.completedDate === dateStr)) {
      streak++;
      date = subDays(date, 1);
    } else {
      break;
    }
  }
  return streak;
}

export default function HabitsPanel({
  habits,
  habitLogs,
  onRefresh,
  today,
  expanded = false,
}: {
  habits: Habit[];
  habitLogs: HabitLog[];
  onRefresh: () => void;
  today: string;
  expanded?: boolean;
}) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("⚡");
  const [color, setColor] = useState("#f4c55a");

  async function addHabit() {
    if (!name.trim()) return;
    await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), icon, color }),
    });
    setName("");
    setAdding(false);
    onRefresh();
  }

  async function toggleHabit(habitId: number) {
    const isLogged = habitLogs.some(
      l => l.habitId === habitId && l.completedDate === today
    );
    await fetch("/api/habits/log", {
      method: isLogged ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId, date: today }),
    });
    onRefresh();
  }

  async function deleteHabit(id: number) {
    await fetch(`/api/habits/${id}`, { method: "DELETE" });
    onRefresh();
  }

  // Last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) =>
    format(subDays(new Date(today), 6 - i), "yyyy-MM-dd")
  );

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-xl text-[var(--text-primary)]">Habits</h2>
          <p className="text-[var(--text-muted)] text-xs">
            {habitLogs.filter(l => l.completedDate === today).length} completed today
          </p>
        </div>
        <button
          onClick={() => setAdding(!adding)}
          className="w-8 h-8 rounded-lg bg-[var(--jade)] hover:opacity-90 flex items-center justify-center transition-opacity"
        >
          <Plus size={16} className="text-white" strokeWidth={2.5} />
        </button>
      </div>

      {adding && (
        <div className="card-elevated p-3 mb-4 space-y-2">
          <input
            type="text"
            className="input-dark text-sm"
            placeholder="Habit name..."
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addHabit()}
            autoFocus
          />
          <div className="flex gap-1 flex-wrap">
            {HABIT_ICONS.map(ic => (
              <button
                key={ic}
                onClick={() => setIcon(ic)}
                className={clsx(
                  "w-7 h-7 rounded text-sm flex items-center justify-center transition-all",
                  icon === ic ? "bg-[var(--lavender)] scale-110" : "bg-[var(--bg-deep)] hover:bg-[var(--bg-elevated)]"
                )}
              >
                {ic}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {HABIT_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={clsx(
                  "w-6 h-6 rounded-full transition-transform",
                  color === c ? "scale-125 ring-2 ring-white/40" : "hover:scale-110"
                )}
                style={{ background: c }}
              />
            ))}
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setAdding(false)}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] px-2 py-1 rounded"
            >
              Cancel
            </button>
            <button
              onClick={addHabit}
              disabled={!name.trim()}
              className="text-xs bg-[var(--jade)] text-white px-3 py-1 rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>
      )}

      <div className={clsx("space-y-2", expanded ? "max-h-[600px]" : "max-h-72", "overflow-y-auto")}>
        {habits.length === 0 && (
          <p className="text-center py-6 text-[var(--text-muted)] text-sm">
            No habits yet. Build your routine ↑
          </p>
        )}
        {habits.map((habit) => {
          const isToday = habitLogs.some(
            l => l.habitId === habit.id && l.completedDate === today
          );
          const streak = getStreak(habit.id, habitLogs, today);

          return (
            <div
              key={habit.id}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--bg-elevated)] transition-all"
            >
              {/* Habit icon */}
              <button
                onClick={() => toggleHabit(habit.id)}
                className={clsx(
                  "w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all duration-300 flex-shrink-0",
                  isToday
                    ? "scale-105"
                    : "opacity-50 hover:opacity-80 grayscale"
                )}
                style={{
                  background: isToday ? `${habit.color}25` : "var(--bg-deep)",
                  border: `2px solid ${isToday ? habit.color : "var(--border-subtle)"}`,
                  boxShadow: isToday ? `0 0 12px ${habit.color}40` : "none",
                }}
              >
                {habit.icon}
              </button>

              <div className="flex-1 min-w-0">
                <p className={clsx(
                  "text-sm font-medium leading-none",
                  isToday ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                )}>
                  {habit.name}
                </p>
                {/* 7-day grid */}
                <div className="flex gap-0.5 mt-1.5">
                  {last7Days.map(d => {
                    const done = habitLogs.some(l => l.habitId === habit.id && l.completedDate === d);
                    return (
                      <div
                        key={d}
                        className="w-3.5 h-3.5 rounded-sm transition-all"
                        style={{
                          background: done ? habit.color : "var(--bg-deep)",
                          opacity: done ? 1 : 0.3,
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Streak */}
              {streak > 0 && (
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="flame-icon text-xs">🔥</span>
                  <span className="text-xs font-mono text-[var(--coral)]">{streak}</span>
                </div>
              )}

              <button
                onClick={() => deleteHabit(habit.id)}
                className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--coral)] hover:bg-[rgba(244,114,90,0.1)] transition-all"
              >
                <Trash2 size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
