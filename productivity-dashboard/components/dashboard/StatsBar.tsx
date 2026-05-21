"use client";

import { CheckCircle2, Clock3, Flame, Target } from "lucide-react";

export default function StatsBar({
  completedTasks,
  pendingTasks,
  habitsCompletedToday,
  totalHabits,
  weeklyPomodoros,
}: {
  completedTasks: number;
  pendingTasks: number;
  habitsCompletedToday: number;
  totalHabits: number;
  weeklyPomodoros: number;
}) {
  const stats = [
    {
      label: "Completed",
      value: completedTasks,
      sub: "tasks done",
      icon: CheckCircle2,
      color: "var(--jade)",
      glow: "rgba(45,212,160,0.15)",
    },
    {
      label: "Pending",
      value: pendingTasks,
      sub: "still to do",
      icon: Clock3,
      color: "var(--gold)",
      glow: "rgba(244,197,90,0.15)",
    },
    {
      label: "Habits",
      value: `${habitsCompletedToday}/${totalHabits}`,
      sub: "done today",
      icon: Flame,
      color: "var(--coral)",
      glow: "rgba(244,114,90,0.15)",
    },
    {
      label: "Sessions",
      value: weeklyPomodoros,
      sub: "this week",
      icon: Target,
      color: "var(--lavender)",
      glow: "rgba(167,139,250,0.15)",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="card p-4 flex items-center gap-4"
            style={{
              animationDelay: `${i * 80}ms`,
              boxShadow: `0 0 24px ${stat.glow}`,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${stat.glow}`, border: `1px solid ${stat.color}30` }}
            >
              <Icon size={18} style={{ color: stat.color }} strokeWidth={2} />
            </div>
            <div>
              <p
                className="text-2xl font-display leading-none"
                style={{ color: stat.color }}
              >
                {stat.value}
              </p>
              <p className="text-[var(--text-muted)] text-xs mt-0.5">{stat.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
