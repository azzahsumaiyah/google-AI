import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Todo,
  CategoryInfo,
  FilterStatus,
  SortOption,
  Priority,
} from './types/todo';
import {
  getStoredTodos,
  saveStoredTodos,
  getStoredCategories,
  saveStoredCategories,
  getStoredTheme,
  saveStoredTheme,
  INITIAL_TODOS,
  DEFAULT_CATEGORIES,
} from './utils/storage';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { TaskInput } from './components/TaskInput';
import { TaskFilters } from './components/TaskFilters';
import { TaskItem } from './components/TaskItem';
import { EmptyState } from './components/EmptyState';
import { CategoryModal } from './components/CategoryModal';
import { CheckCheck, Undo2, ArrowUpRight } from 'lucide-react';

export default function App() {
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getStoredTheme());

  // Todos & Categories State
  const [todos, setTodos] = useState<Todo[]>(() => getStoredTodos());
  const [categories, setCategories] = useState<CategoryInfo[]>(() => getStoredCategories());

  // Filter & Search State
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('createdAt');

  // UI Modals & Notifications
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [lastDeletedTodo, setLastDeletedTodo] = useState<Todo | null>(null);
  const [undoTimeoutId, setUndoTimeoutId] = useState<number | null>(null);

  // Ref to track previous completion percentage to fire confetti only on reaching 100%
  const prevCompletionRef = useRef<number | null>(null);

  // Sync theme with DOM documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    saveStoredTheme(theme);
  }, [theme]);

  // Sync todos with localStorage
  useEffect(() => {
    saveStoredTodos(todos);
  }, [todos]);

  // Sync categories with localStorage
  useEffect(() => {
    saveStoredCategories(categories);
  }, [categories]);

  // Completion calculation & Confetti on finishing all tasks
  const totalCount = todos.length;
  const completedCount = useMemo(() => todos.filter((t) => t.completed).length, [todos]);
  const currentPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  useEffect(() => {
    if (
      prevCompletionRef.current !== null &&
      prevCompletionRef.current < 100 &&
      currentPercentage === 100 &&
      totalCount > 0
    ) {
      // Fire subtle celebratory confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ec4899'],
        disableForReducedMotion: true,
      });
    }
    prevCompletionRef.current = currentPercentage;
  }, [currentPercentage, totalCount]);

  // Toggle Theme
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Add Task
  const handleAddTask = (newTaskData: {
    title: string;
    description?: string;
    category: string;
    priority: Priority;
    dueDate?: string;
  }) => {
    const newTodo: Todo = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: newTaskData.title,
      description: newTaskData.description,
      category: newTaskData.category,
      priority: newTaskData.priority,
      dueDate: newTaskData.dueDate,
      completed: false,
      createdAt: Date.now(),
    };

    setTodos((prev) => [newTodo, ...prev]);
  };

  // Toggle Task Completion
  const handleToggleTask = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          const willComplete = !todo.completed;
          return {
            ...todo,
            completed: willComplete,
            completedAt: willComplete ? Date.now() : undefined,
          };
        }
        return todo;
      })
    );
  };

  // Delete Task with Undo capability
  const handleDeleteTask = (id: string) => {
    const target = todos.find((t) => t.id === id);
    if (!target) return;

    if (undoTimeoutId) {
      window.clearTimeout(undoTimeoutId);
    }

    setLastDeletedTodo(target);
    setTodos((prev) => prev.filter((t) => t.id !== id));

    const timeout = window.setTimeout(() => {
      setLastDeletedTodo(null);
    }, 4500);
    setUndoTimeoutId(timeout);
  };

  // Undo Delete
  const handleUndoDelete = () => {
    if (!lastDeletedTodo) return;
    setTodos((prev) => [lastDeletedTodo, ...prev]);
    setLastDeletedTodo(null);
    if (undoTimeoutId) {
      window.clearTimeout(undoTimeoutId);
      setUndoTimeoutId(null);
    }
  };

  // Update Task
  const handleUpdateTask = (id: string, updates: Partial<Todo>) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo))
    );
  };

  // Mark all visible as completed
  const handleMarkAllCompleted = () => {
    setTodos((prev) =>
      prev.map((todo) => ({
        ...todo,
        completed: true,
        completedAt: todo.completedAt || Date.now(),
      }))
    );
  };

  // Clear completed tasks
  const handleClearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  // Reset to initial demo tasks
  const handleResetDemo = () => {
    if (window.confirm('Reset daftar tugas ke contoh awal? Semua tugas saat ini akan digantikan.')) {
      setTodos(INITIAL_TODOS);
      setCategories(DEFAULT_CATEGORIES);
      setSelectedCategory(null);
      setFilterStatus('all');
      setSearchQuery('');
    }
  };

  // Category Management
  const handleAddCategory = (newCategory: CategoryInfo) => {
    setCategories((prev) => [...prev, newCategory]);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    }
  };

  // Filtered & Sorted Todos
  const filteredTodos = useMemo(() => {
    let result = [...todos];

    // Status Filter
    if (filterStatus === 'active') {
      result = result.filter((t) => !t.completed);
    } else if (filterStatus === 'completed') {
      result = result.filter((t) => t.completed);
    }

    // Category Filter
    if (selectedCategory) {
      result = result.filter((t) => t.category === selectedCategory);
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          t.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      // Completed items always sort towards bottom if in 'all' view
      if (filterStatus === 'all' && a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      if (sortOption === 'createdAt') {
        return b.createdAt - a.createdAt;
      }
      if (sortOption === 'alphabetical') {
        return a.title.localeCompare(b.title, 'id');
      }
      if (sortOption === 'priority') {
        const priorityWeight: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      if (sortOption === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      return 0;
    });

    return result;
  }, [todos, filterStatus, selectedCategory, searchQuery, sortOption]);

  const categoryMap = useMemo(() => {
    const map = new Map<string, CategoryInfo>();
    categories.forEach((c) => map.set(c.name, c));
    return map;
  }, [categories]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col transition-colors duration-200">
      {/* Top Bar */}
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onResetDemo={handleResetDemo}
        completedCount={completedCount}
        totalCount={totalCount}
      />

      {/* Main Content Viewport */}
      <main className="grow w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-6">
        {/* Progress Bar & Productivity Insight */}
        <section aria-label="Progress Ringkasan">
          <ProgressBar total={totalCount} completed={completedCount} />
        </section>

        {/* Task Input Section */}
        <section aria-label="Tambah Tugas">
          <TaskInput
            categories={categories}
            onAddTask={handleAddTask}
            onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
          />
        </section>

        {/* Filter, Search & Segmented Controls */}
        <section aria-label="Filter dan Pencarian">
          <TaskFilters
            filterStatus={filterStatus}
            onChangeFilterStatus={setFilterStatus}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            categories={categories}
            counts={{
              all: todos.length,
              active: todos.filter((t) => !t.completed).length,
              completed: completedCount,
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortOption={sortOption}
            onChangeSortOption={setSortOption}
            onClearCompleted={handleClearCompleted}
          />
        </section>

        {/* Task List */}
        <section aria-label="Daftar Tugas" className="flex flex-col gap-2.5">
          {filteredTodos.length > 0 ? (
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredTodos.map((todo) => (
                <TaskItem
                  key={todo.id}
                  todo={todo}
                  categoryInfo={categoryMap.get(todo.category)}
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                  onUpdate={handleUpdateTask}
                />
              ))}
            </AnimatePresence>
          ) : (
            <EmptyState
              filterStatus={filterStatus}
              hasSearch={Boolean(searchQuery.trim())}
              onClearFilters={() => {
                setSearchQuery('');
                setSelectedCategory(null);
                setFilterStatus('all');
              }}
              onFocusInput={() => {
                const el = document.querySelector('input[placeholder*="Tambah tugas"]') as HTMLInputElement | null;
                el?.focus();
              }}
            />
          )}
        </section>

        {/* Quick Batch Actions (Mark all done) */}
        {todos.length > 0 && todos.some((t) => !t.completed) && (
          <div className="flex items-center justify-between pt-4 text-xs text-neutral-400 dark:text-neutral-500">
            <button
              onClick={handleMarkAllCompleted}
              className="flex items-center gap-1.5 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Tandai Semua Selesai</span>
            </button>
            <span>
              {todos.filter((t) => !t.completed).length} tugas tersisa
            </span>
          </div>
        )}
      </main>

      {/* Floating Undo Notification Toast */}
      <AnimatePresence>
        {lastDeletedTodo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-40 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 text-xs"
          >
            <span>Tugas &ldquo;{lastDeletedTodo.title.slice(0, 28)}{lastDeletedTodo.title.length > 28 ? '...' : ''}&rdquo; dihapus.</span>
            <button
              onClick={handleUndoDelete}
              className="font-semibold underline flex items-center gap-1 text-emerald-400 dark:text-emerald-600 hover:opacity-80 transition-opacity"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Batal</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Management Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      {/* Minimal Notion/Apple Aesthetic Footer */}
      <footer className="w-full border-t border-neutral-200/60 dark:border-neutral-800/60 py-6 text-center text-xs text-neutral-400 dark:text-neutral-500 transition-colors">
        <div className="max-w-3xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>Klar — Fokus dan selesaikan rencanamu setiap hari.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Data tersimpan otomatis di perangkat</span>
            <span>·</span>
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="hover:text-neutral-700 dark:hover:text-neutral-300 underline"
            >
              Kelola Kategori
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
