"use client";

import { useState } from "react";
import { Task } from "@/lib/schema";
import { Plus, Trash2, ChevronDown, AlertCircle, Minus, ArrowDown } from "lucide-react";
import clsx from "clsx";

const PRIORITIES = ["high", "medium", "low"] as const;
const STATUSES = ["todo", "in_progress", "done"] as const;

const priorityConfig = {
  high: { label: "High", className: "priority-high", icon: AlertCircle },
  medium: { label: "Med", className: "priority-medium", icon: Minus },
  low: { label: "Low", className: "priority-low", icon: ArrowDown },
};

export default function TasksPanel({
  tasks,
  onRefresh,
  today,
  expanded = false,
}: {
  tasks: Task[];
  onRefresh: () => void;
  today: string;
  expanded?: boolean;
}) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [filter, setFilter] = useState<"all" | "todo" | "done">("all");
  const [loading, setLoading] = useState(false);

  const filtered = tasks.filter(t => {
    if (filter === "all") return true;
    if (filter === "todo") return t.status !== "done";
    if (filter === "done") return t.status === "done";
    return true;
  });

  async function addTask() {
    if (!title.trim()) return;
    setLoading(true);
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), priority }),
    });
    setTitle("");
    setPriority("medium");
    setAdding(false);
    setLoading(false);
    onRefresh();
  }

  async function toggleTask(task: Task) {
    const newStatus = task.status === "done" ? "todo" : "done";
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    onRefresh();
  }

  async function deleteTask(id: number) {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    onRefresh();
  }

  return (
    <div className="card p-5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-xl text-[var(--text-primary)]">Tasks</h2>
          <p className="text-[var(--text-muted)] text-xs">
            {tasks.filter(t => t.status === "done").length} of {tasks.length} complete
          </p>
        </div>
        <button
          onClick={() => setAdding(!adding)}
          className="w-8 h-8 rounded-lg bg-[var(--lavender)] hover:bg-[var(--lavender-dark)] flex items-center justify-center transition-colors"
        >
          <Plus size={16} className="text-white" strokeWidth={2.5} />
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-4">
        {(["all", "todo", "done"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              "px-3 py-1 rounded-full text-xs font-medium capitalize transition-all",
              filter === f
                ? "bg-[var(--lavender)] text-white"
                : "bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Add Task Form */}
      {adding && (
        <div className="card-elevated p-3 mb-4 space-y-2">
          <input
            type="text"
            className="input-dark text-sm"
            placeholder="What needs to be done?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addTask()}
            autoFocus
          />
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {PRIORITIES.map(p => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={clsx(
                    "pill text-[10px] transition-all",
                    priority === p ? priorityConfig[p].className : "bg-[var(--bg-deep)] text-[var(--text-muted)]"
                  )}
                >
                  {priorityConfig[p].label}
                </button>
              ))}
            </div>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => setAdding(false)}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] px-2 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={addTask}
                disabled={loading || !title.trim()}
                className="text-xs bg-[var(--lavender)] text-white px-3 py-1 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className={clsx("space-y-1 overflow-y-auto", expanded ? "max-h-[600px]" : "max-h-80")}>
        {filtered.length === 0 && (
          <div className="text-center py-8 text-[var(--text-muted)] text-sm">
            No tasks yet. Add one above ↑
          </div>
        )}
        {filtered.map((task) => {
          const PIcon = priorityConfig[task.priority as keyof typeof priorityConfig]?.icon || Minus;
          return (
            <div
              key={task.id}
              className={clsx(
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                "hover:bg-[var(--bg-elevated)]",
                task.status === "done" && "opacity-50"
              )}
            >
              <input
                type="checkbox"
                className="custom-checkbox"
                checked={task.status === "done"}
                onChange={() => toggleTask(task)}
              />
              <div className="flex-1 min-w-0">
                <p
                  className={clsx(
                    "text-sm leading-snug truncate",
                    task.status === "done"
                      ? "line-through text-[var(--text-muted)]"
                      : "text-[var(--text-primary)]"
                  )}
                >
                  {task.title}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span
                  className={clsx(
                    "pill text-[10px]",
                    priorityConfig[task.priority as keyof typeof priorityConfig]?.className
                  )}
                >
                  {priorityConfig[task.priority as keyof typeof priorityConfig]?.label}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="ml-1 w-6 h-6 rounded flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--coral)] hover:bg-[rgba(244,114,90,0.1)] transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
