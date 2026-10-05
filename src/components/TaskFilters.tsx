import React from 'react';
import { Search, X, SlidersHorizontal, Trash2 } from 'lucide-react';
import { FilterStatus, CategoryInfo, SortOption } from '../types/todo';

interface TaskFiltersProps {
  filterStatus: FilterStatus;
  onChangeFilterStatus: (status: FilterStatus) => void;
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  categories: CategoryInfo[];
  counts: {
    all: number;
    active: number;
    completed: number;
  };
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: SortOption;
  onChangeSortOption: (sort: SortOption) => void;
  onClearCompleted: () => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filterStatus,
  onChangeFilterStatus,
  selectedCategory,
  onSelectCategory,
  categories,
  counts,
  searchQuery,
  onSearchChange,
  sortOption,
  onChangeSortOption,
  onClearCompleted,
}) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Top Filter Row: Status Segmented Control + Search + Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Segmented Control: Semua | Aktif | Selesai */}
        <div className="flex items-center p-1 bg-neutral-200/60 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 rounded-xl shrink-0 self-start sm:self-auto">
          <button
            onClick={() => onChangeFilterStatus('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              filterStatus === 'all'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-2xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <span>Semua</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-neutral-100 dark:bg-neutral-700/60 tabular-nums">
              {counts.all}
            </span>
          </button>
          <button
            onClick={() => onChangeFilterStatus('active')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              filterStatus === 'active'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-2xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <span>Aktif</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-neutral-100 dark:bg-neutral-700/60 tabular-nums">
              {counts.active}
            </span>
          </button>
          <button
            onClick={() => onChangeFilterStatus('completed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              filterStatus === 'completed'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-2xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <span>Selesai</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-neutral-100 dark:bg-neutral-700/60 tabular-nums">
              {counts.completed}
            </span>
          </button>
        </div>

        {/* Search Bar & Sort Dropdown */}
        <div className="flex items-center gap-2 grow sm:max-w-xs">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari tugas..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative shrink-0">
            <select
              value={sortOption}
              onChange={(e) => onChangeSortOption(e.target.value as SortOption)}
              className="appearance-none text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-2.5 py-1.5 pr-6 text-neutral-600 dark:text-neutral-300 font-medium cursor-pointer focus:outline-none"
            >
              <option value="createdAt">Waktu Dibuat</option>
              <option value="dueDate">Tenggat Waktu</option>
              <option value="priority">Prioritas</option>
              <option value="alphabetical">Nama (A-Z)</option>
            </select>
            <SlidersHorizontal className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Category Tabs / Chips Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => onSelectCategory(null)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              selectedCategory === null
                ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            Semua Kategori
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? null : cat.name)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${cat.dotColor}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Clear Completed Action */}
        {counts.completed > 0 && (
          <button
            onClick={onClearCompleted}
            className="flex items-center gap-1 text-[11px] font-medium text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 whitespace-nowrap shrink-0 transition-colors ml-auto"
          >
            <Trash2 className="w-3 h-3" />
            <span>Hapus Selesai ({counts.completed})</span>
          </button>
        )}
      </div>
    </div>
  );
};
