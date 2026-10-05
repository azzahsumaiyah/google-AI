export type Priority = 'low' | 'medium' | 'high';

export type DefaultCategory = 'Kerja' | 'Pribadi' | 'Mendesak' | 'Belajar';

export interface CategoryInfo {
  id: string;
  name: string;
  color: string; // Tailwind color accent
  bgLight: string;
  bgDark: string;
  textLight: string;
  textDark: string;
  dotColor: string;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category: string;
  priority: Priority;
  dueDate?: string;
  createdAt: number;
  completedAt?: number;
}

export type FilterStatus = 'all' | 'active' | 'completed';

export type SortOption = 'createdAt' | 'dueDate' | 'priority' | 'alphabetical';
