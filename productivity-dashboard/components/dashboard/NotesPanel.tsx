"use client";

import { useState } from "react";
import { Note } from "@/lib/schema";
import { Plus, Trash2, Pin, PinOff } from "lucide-react";
import clsx from "clsx";
import { format } from "date-fns";

const NOTE_COLORS = ["#f4c55a", "#2dd4a0", "#a78bfa", "#f4725a", "#60a5fa"];

export default function NotesPanel({
  notes,
  onRefresh,
  expanded = false,
}: {
  notes: Note[];
  onRefresh: () => void;
  expanded?: boolean;
}) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("#f4c55a");

  async function addNote() {
    if (!title.trim() || !content.trim()) return;
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), content: content.trim(), color }),
    });
    setTitle("");
    setContent("");
    setAdding(false);
    onRefresh();
  }

  async function deleteNote(id: number) {
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    onRefresh();
  }

  async function togglePin(note: Note) {
    await fetch(`/api/notes/${note.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned: !note.pinned }),
    });
    onRefresh();
  }

  return (
    <div className="card p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-xl text-[var(--text-primary)]">Notes</h2>
          <p className="text-[var(--text-muted)] text-xs">{notes.length} saved</p>
        </div>
        <button
          onClick={() => setAdding(!adding)}
          className="w-8 h-8 rounded-lg bg-[var(--gold)] hover:opacity-90 flex items-center justify-center transition-opacity"
        >
          <Plus size={16} className="text-[var(--bg-deep)]" strokeWidth={2.5} />
        </button>
      </div>

      {adding && (
        <div className="card-elevated p-3 mb-4 space-y-2">
          <input
            type="text"
            className="input-dark text-sm"
            placeholder="Title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
          />
          <textarea
            className="input-dark text-sm resize-none"
            placeholder="Note content..."
            rows={3}
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {NOTE_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={clsx(
                    "w-5 h-5 rounded-full transition-transform",
                    color === c ? "scale-125 ring-2 ring-white/40" : "hover:scale-110"
                  )}
                  style={{ background: c }}
                />
              ))}
            </div>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => setAdding(false)}
                className="text-xs text-[var(--text-muted)] px-2 py-1 rounded hover:text-[var(--text-secondary)]"
              >
                Cancel
              </button>
              <button
                onClick={addNote}
                disabled={!title.trim() || !content.trim()}
                className="text-xs bg-[var(--gold)] text-[var(--bg-deep)] px-3 py-1 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={clsx("space-y-2 overflow-y-auto", expanded ? "max-h-[650px]" : "max-h-96")}>
        {notes.length === 0 && (
          <p className="text-center py-8 text-[var(--text-muted)] text-sm">
            No notes yet. Capture a thought ↑
          </p>
        )}
        {notes.map((note) => (
          <div
            key={note.id}
            className="group relative rounded-xl p-3 transition-all hover:scale-[1.01]"
            style={{
              background: `${note.color}10`,
              border: `1px solid ${note.color}25`,
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  {note.pinned && (
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: note.color }}
                    />
                  )}
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                    {note.title}
                  </p>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                  {note.content}
                </p>
                <p className="text-[10px] text-[var(--text-muted)] mt-1.5 font-mono">
                  {format(new Date(note.updatedAt), "MMM d")}
                </p>
              </div>
              <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => togglePin(note)}
                  className="w-6 h-6 rounded flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors"
                >
                  {note.pinned ? <PinOff size={12} /> : <Pin size={12} />}
                </button>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="w-6 h-6 rounded flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--coral)] transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
