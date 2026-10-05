import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Check,
  Trash2,
  Edit2,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { Todo, CategoryInfo, Priority } from '../types/todo';

interface TaskItemProps {
  todo: Todo;
  categoryInfo?: CategoryInfo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  todo,
  categoryInfo,
  onToggle,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editDueDate, setEditDueDate] = useState(todo.dueDate || '');
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleSaveEdit = () => {
    const cleanTitle = editTitle.trim();
    if (!cleanTitle) {
      // If cleared, cancel edit
      setEditTitle(todo.title);
      setIsEditing(false);
      return;
    }
    onUpdate(todo.id, {
      title: cleanTitle,
      description: editDescription.trim() ? editDescription.trim() : undefined,
      dueDate: editDueDate || undefined,
      priority: editPriority,
    });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(todo.title);
    }
  };

  // Helper to format due date relative to today
  const formatDueDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(dateStr);
    targetDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: `Terlambat (${Math.abs(diffDays)} hari)`, isOverdue: true };
    }
    if (diffDays === 0) {
      return { label: 'Hari ini', isToday: true };
    }
    if (diffDays === 1) {
      return { label: 'Besok', isSoon: true };
    }

    const formatted = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
    }).format(targetDate);
    return { label: formatted };
  };

  const dueInfo = formatDueDate(todo.dueDate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative bg-white dark:bg-neutral-900/60 border rounded-xl p-3.5 sm:p-4 transition-all duration-200 ${
        todo.completed
          ? 'border-neutral-200/60 dark:border-neutral-800/40 opacity-75 dark:opacity-60 bg-neutral-50/50 dark:bg-neutral-950/20'
          : 'border-neutral-200/90 dark:border-neutral-800/90 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-2xs hover:shadow-xs'
      }`}
    >
      {isEditing ? (
        /* Edit Mode */
        <div className="flex flex-col gap-2.5">
          <input
            ref={editInputRef}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full text-sm sm:text-base font-medium bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />

          <input
            type="text"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Catatan tambahan (opsional)..."
            className="w-full text-xs bg-neutral-50 dark:bg-neutral-800/50 px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 focus:outline-none"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              {/* Priority Select */}
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value as Priority)}
                className="text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md px-2 py-1 text-neutral-800 dark:text-neutral-200 focus:outline-none"
              >
                <option value="low">Prioritas: Rendah</option>
                <option value="medium">Prioritas: Sedang</option>
                <option value="high">Prioritas: Mendesak</option>
              </select>

              {/* Due Date */}
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md px-2 py-1 text-neutral-800 dark:text-neutral-200 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(todo.title);
                }}
                className="px-2.5 py-1 text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-3 py-1 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 rounded-md transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Normal Display Mode */
        <div className="flex items-start gap-3">
          {/* Checkbox Button */}
          <button
            type="button"
            onClick={() => onToggle(todo.id)}
            aria-label={todo.completed ? 'Tandai belum selesai' : 'Tandai selesai'}
            className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center shrink-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
              todo.completed
                ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                : 'border border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-400 bg-transparent'
            }`}
          >
            {todo.completed && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
          </button>

          {/* Content Area */}
          <div className="grow min-w-0" onDoubleClick={() => setIsEditing(true)}>
            <div className="flex items-start justify-between gap-2">
              <p
                className={`text-sm sm:text-base font-normal tracking-tight leading-snug break-words transition-all duration-200 ${
                  todo.completed
                    ? 'line-through text-neutral-400 dark:text-neutral-500'
                    : 'text-neutral-900 dark:text-neutral-100'
                }`}
              >
                {todo.title}
              </p>

              {/* Action Buttons (Edit & Delete) */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  aria-label="Edit tugas"
                  className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(todo.id)}
                  aria-label="Hapus tugas"
                  className="p-1 rounded-md text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Optional Description */}
            {todo.description && (
              <p
                className={`mt-1 text-xs leading-relaxed ${
                  todo.completed
                    ? 'line-through text-neutral-400/80 dark:text-neutral-600'
                    : 'text-neutral-500 dark:text-neutral-400'
                }`}
              >
                {todo.description}
              </p>
            )}

            {/* Unboxed Metadata Line (per zero-pill discipline) */}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              {/* Category indicator */}
              <span className="inline-flex items-center gap-1 font-medium">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    categoryInfo?.dotColor || 'bg-neutral-400'
                  }`}
                />
                <span>{todo.category}</span>
              </span>

              {/* Priority */}
              {todo.priority === 'high' && (
                <>
                  <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                  <span className="text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    Mendesak
                  </span>
                </>
              )}
              {todo.priority === 'low' && (
                <>
                  <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                  <span className="text-neutral-400 dark:text-neutral-500">Santai</span>
                </>
              )}

              {/* Due Date */}
              {dueInfo && (
                <>
                  <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                  <span
                    className={`inline-flex items-center gap-1 ${
                      dueInfo.isOverdue && !todo.completed
                        ? 'text-rose-600 dark:text-rose-400 font-medium'
                        : dueInfo.isToday && !todo.completed
                        ? 'text-amber-600 dark:text-amber-400 font-medium'
                        : 'text-neutral-500 dark:text-neutral-400'
                    }`}
                  >
                    <Calendar className="w-3 h-3" />
                    <span>{dueInfo.label}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
