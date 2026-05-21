import { pgTable, serial, text, boolean, integer, timestamp, date } from "drizzle-orm/pg-core";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority").notNull().default("medium"), // low | medium | high
  status: text("status").notNull().default("todo"), // todo | in_progress | done
  dueDate: date("due_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").notNull().default("#f4c55a"),
  icon: text("icon").notNull().default("⚡"),
  frequency: text("frequency").notNull().default("daily"), // daily | weekly
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const habitLogs = pgTable("habit_logs", {
  id: serial("id").primaryKey(),
  habitId: integer("habit_id")
    .notNull()
    .references(() => habits.id, { onDelete: "cascade" }),
  completedDate: date("completed_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  color: text("color").notNull().default("#f4c55a"),
  pinned: boolean("pinned").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const pomodoroSessions = pgTable("pomodoro_sessions", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id").references(() => tasks.id, { onDelete: "set null" }),
  duration: integer("duration").notNull(), // in minutes
  type: text("type").notNull().default("work"), // work | short_break | long_break
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type Habit = typeof habits.$inferSelect;
export type NewHabit = typeof habits.$inferInsert;
export type HabitLog = typeof habitLogs.$inferSelect;
export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
export type PomodoroSession = typeof pomodoroSessions.$inferSelect;
