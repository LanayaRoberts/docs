"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Task } from "@/lib/schema";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import clsx from "clsx";

type Phase = "work" | "short_break" | "long_break";

const PHASES: Record<Phase, { label: string; duration: number; color: string }> = {
  work: { label: "Focus", duration: 25 * 60, color: "var(--lavender)" },
  short_break: { label: "Short Break", duration: 5 * 60, color: "var(--jade)" },
  long_break: { label: "Long Break", duration: 15 * 60, color: "var(--gold)" },
};

export default function PomodoroWidget({
  tasks,
  expanded = false,
}: {
  tasks: Task[];
  expanded?: boolean;
}) {
  const [phase, setPhase] = useState<Phase>("work");
  const [timeLeft, setTimeLeft] = useState(PHASES.work.duration);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const currentPhase = PHASES[phase];
  const totalTime = currentPhase.duration;
  const progress = (timeLeft / totalTime) * 100;

  const completeSession = useCallback(async () => {
    setSessions(s => s + 1);
    // Log to DB
    await fetch("/api/pomodoro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskId: selectedTask,
        duration: Math.floor(totalTime / 60),
        type: phase,
      }),
    });
    // Auto-advance
    const newPhase: Phase =
      phase === "work"
        ? sessions > 0 && (sessions + 1) % 4 === 0
          ? "long_break"
          : "short_break"
        : "work";
    setPhase(newPhase);
    setTimeLeft(PHASES[newPhase].duration);
    setRunning(false);
  }, [phase, sessions, selectedTask, totalTime]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            completeSession();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, completeSession]);

  function reset() {
    setRunning(false);
    setTimeLeft(currentPhase.duration);
  }

  function skip() {
    const phases: Phase[] = ["work", "short_break", "long_break"];
    const idx = phases.indexOf(phase);
    const next = phases[(idx + 1) % phases.length];
    setPhase(next);
    setTimeLeft(PHASES[next].duration);
    setRunning(false);
  }

  function switchPhase(p: Phase) {
    setPhase(p);
    setTimeLeft(PHASES[p].duration);
    setRunning(false);
  }

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  const radius = expanded ? 100 : 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (progress / 100) * circumference;

  return (
    <div className={clsx("card p-5", expanded && "max-w-md w-full")}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl text-[var(--text-primary)]">Focus Timer</h2>
        <span className="pill bg-[var(--bg-elevated)] text-[var(--text-muted)] text-[10px]">
          {sessions} sessions
        </span>
      </div>

      {/* Phase selector */}
      <div className="flex gap-1 mb-5">
        {(Object.keys(PHASES) as Phase[]).map(p => (
          <button
            key={p}
            onClick={() => switchPhase(p)}
            className={clsx(
              "flex-1 py-1.5 rounded-lg text-xs font-medium transition-all",
              phase === p
                ? "text-white"
                : "text-[var(--text-muted)] bg-[var(--bg-elevated)] hover:text-[var(--text-secondary)]"
            )}
            style={phase === p ? { background: currentPhase.color } : {}}
          >
            {PHASES[p].label}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div className={clsx("flex justify-center mb-5", expanded ? "my-8" : "")}>
        <div className="relative">
          <svg
            width={expanded ? 240 : 160}
            height={expanded ? 240 : 160}
            className="transform -rotate-90"
          >
            {/* Background ring */}
            <circle
              cx={expanded ? 120 : 80}
              cy={expanded ? 120 : 80}
              r={radius}
              fill="none"
              stroke="var(--bg-elevated)"
              strokeWidth={expanded ? 8 : 6}
            />
            {/* Progress ring */}
            <circle
              cx={expanded ? 120 : 80}
              cy={expanded ? 120 : 80}
              r={radius}
              fill="none"
              stroke={currentPhase.color}
              strokeWidth={expanded ? 8 : 6}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - strokeDash}
              style={{ transition: "stroke-dashoffset 1s linear", filter: `drop-shadow(0 0 8px ${currentPhase.color}60)` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={clsx("font-mono font-light leading-none", expanded ? "text-5xl" : "text-3xl")}
              style={{ color: currentPhase.color }}
            >
              {mm}:{ss}
            </span>
            <span className="text-[var(--text-muted)] text-xs mt-1">{currentPhase.label}</span>
          </div>
        </div>
      </div>

      {/* Task selector (expanded only) */}
      {expanded && tasks.length > 0 && (
        <div className="mb-4">
          <label className="text-[var(--text-muted)] text-xs mb-1 block">Working on</label>
          <select
            value={selectedTask || ""}
            onChange={e => setSelectedTask(e.target.value ? Number(e.target.value) : null)}
            className="input-dark text-sm"
          >
            <option value="">No specific task</option>
            {tasks.map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={reset}
          className="w-9 h-9 rounded-xl bg-[var(--bg-elevated)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
        >
          <RotateCcw size={15} />
        </button>
        <button
          onClick={() => setRunning(r => !r)}
          className={clsx(
            "flex items-center justify-center rounded-2xl font-semibold text-white transition-all",
            expanded ? "w-16 h-16 text-sm" : "w-12 h-12",
            "hover:scale-105 active:scale-95"
          )}
          style={{
            background: currentPhase.color,
            boxShadow: `0 0 24px ${currentPhase.color}50`,
          }}
        >
          {running ? <Pause size={expanded ? 22 : 18} /> : <Play size={expanded ? 22 : 18} className="ml-0.5" />}
        </button>
        <button
          onClick={skip}
          className="w-9 h-9 rounded-xl bg-[var(--bg-elevated)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
        >
          <SkipForward size={15} />
        </button>
      </div>
    </div>
  );
}
