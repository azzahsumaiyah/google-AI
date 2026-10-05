import { Todo, CategoryInfo } from '../types/todo';

export const STORAGE_KEY_TODOS = 'klar_todos_v1';
export const STORAGE_KEY_CATEGORIES = 'klar_categories_v1';
export const STORAGE_KEY_THEME = 'klar_theme_mode';

export const DEFAULT_CATEGORIES: CategoryInfo[] = [
  {
    id: 'Kerja',
    name: 'Kerja',
    color: 'blue',
    bgLight: 'bg-blue-50',
    bgDark: 'dark:bg-blue-950/40',
    textLight: 'text-blue-700',
    textDark: 'dark:text-blue-300',
    dotColor: 'bg-blue-500',
  },
  {
    id: 'Pribadi',
    name: 'Pribadi',
    color: 'emerald',
    bgLight: 'bg-emerald-50',
    bgDark: 'dark:bg-emerald-950/40',
    textLight: 'text-emerald-700',
    textDark: 'dark:text-emerald-300',
    dotColor: 'bg-emerald-500',
  },
  {
    id: 'Mendesak',
    name: 'Mendesak',
    color: 'rose',
    bgLight: 'bg-rose-50',
    bgDark: 'dark:bg-rose-950/40',
    textLight: 'text-rose-700',
    textDark: 'dark:text-rose-300',
    dotColor: 'bg-rose-500',
  },
  {
    id: 'Belajar',
    name: 'Belajar',
    color: 'indigo',
    bgLight: 'bg-indigo-50',
    bgDark: 'dark:bg-indigo-950/40',
    textLight: 'text-indigo-700',
    textDark: 'dark:text-indigo-300',
    dotColor: 'bg-indigo-500',
  },
];

export const INITIAL_TODOS: Todo[] = [
  {
    id: 'todo-1',
    title: 'Kirim revisi brief proyek ke tim desain & klien',
    description: 'Pastikan file mockup terbaru di Figma sudah diberi akses edit.',
    completed: false,
    category: 'Mendesak',
    priority: 'high',
    dueDate: new Date(Date.now() + 2 * 3600 * 1000).toISOString().split('T')[0],
    createdAt: Date.now() - 1000 * 60 * 180,
  },
  {
    id: 'todo-2',
    title: 'Review laporan mingguan kuartal 3',
    description: 'Cek metrik pertumbuhan pengguna dan KPI sprint.',
    completed: true,
    category: 'Kerja',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: Date.now() - 1000 * 60 * 360,
    completedAt: Date.now() - 1000 * 60 * 30,
  },
  {
    id: 'todo-3',
    title: 'Beli biji kopi arabika & bahan sarapan mingguan',
    description: 'Cari beans single origin dari roast lokal.',
    completed: false,
    category: 'Pribadi',
    priority: 'low',
    dueDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0],
    createdAt: Date.now() - 1000 * 60 * 120,
  },
  {
    id: 'todo-4',
    title: 'Selesaikan 1 bab modul clean code & refactoring',
    description: 'Menerapkan arsitektur komponen modular dan pemisahan concerns.',
    completed: false,
    category: 'Belajar',
    priority: 'medium',
    dueDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString().split('T')[0],
    createdAt: Date.now() - 1000 * 60 * 60,
  },
  {
    id: 'todo-5',
    title: 'Sinkronisasi berkas keuangan ke Google Drive',
    description: 'Arsipkan nota belanja dan receipt invoice bulan lalu.',
    completed: true,
    category: 'Pribadi',
    priority: 'low',
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: Date.now() - 1000 * 60 * 500,
    completedAt: Date.now() - 1000 * 60 * 100,
  },
];

export function getStoredTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TODOS);
    if (!raw) {
      saveStoredTodos(INITIAL_TODOS);
      return INITIAL_TODOS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_TODOS;
  } catch (e) {
    console.error('Failed to parse todos from localStorage', e);
    return INITIAL_TODOS;
  }
}

export function saveStoredTodos(todos: Todo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(todos));
  } catch (e) {
    console.error('Failed to save todos to localStorage', e);
  }
}

export function getStoredCategories(): CategoryInfo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (!raw) {
      saveStoredCategories(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CATEGORIES;
  } catch (e) {
    console.error('Failed to parse categories from localStorage', e);
    return DEFAULT_CATEGORIES;
  }
}

export function saveStoredCategories(categories: CategoryInfo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
  } catch (e) {
    console.error('Failed to save categories to localStorage', e);
  }
}

export function getStoredTheme(): 'light' | 'dark' {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_THEME);
    if (raw === 'light' || raw === 'dark') return raw;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  } catch {
    return 'light';
  }
}

export function saveStoredTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  } catch (e) {
    console.error('Failed to save theme', e);
  }
}
