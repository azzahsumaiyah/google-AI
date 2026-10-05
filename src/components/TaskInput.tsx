import React, { useState, useRef } from 'react';
import { Plus, Tag, Calendar, AlertCircle, ChevronDown, Check } from 'lucide-react';
import { CategoryInfo, Priority } from '../types/todo';

interface TaskInputProps {
  categories: CategoryInfo[];
  onAddTask: (task: {
    title: string;
    description?: string;
    category: string;
    priority: Priority;
    dueDate?: string;
  }) => void;
  onOpenCategoryModal: () => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({
  categories,
  onAddTask,
  onOpenCategoryModal,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>(categories[0]?.name || 'Kerja');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    onAddTask({
      title: cleanTitle,
      description: description.trim() ? description.trim() : undefined,
      category,
      priority,
      dueDate: dueDate || undefined,
    });

    // Reset fields
    setTitle('');
    setDescription('');
    setDueDate('');
    setIsExpanded(false);
    setIsCategoryDropdownOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const currentCategory = categories.find((c) => c.name === category) || categories[0];

  return (
    <div className="bg-white dark:bg-neutral-900/80 border border-neutral-200/90 dark:border-neutral-800/90 rounded-2xl p-3 sm:p-4 shadow-xs transition-all duration-200 focus-within:ring-2 focus-within:ring-neutral-400 dark:focus-within:ring-neutral-600">
      <form onSubmit={handleSubmit}>
        {/* Main Input Line */}
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-md border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-neutral-400 shrink-0">
            <Plus className="w-3.5 h-3.5" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onKeyDown={handleKeyDown}
            placeholder="Tambah tugas baru... (tekan Enter untuk menyimpan)"
            className="w-full bg-transparent text-sm sm:text-base text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none"
          />

          {/* Quick Submit Button */}
          {title.trim().length > 0 && (
            <button
              type="submit"
              className="shrink-0 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900 rounded-lg text-xs font-semibold tracking-wide transition-colors flex items-center gap-1"
            >
              <span>Tambah</span>
              <kbd className="hidden sm:inline-block text-[10px] opacity-70">↵</kbd>
            </button>
          )}
        </div>

        {/* Expandable Options for Details, Category, Due Date, Priority */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-col gap-2.5">
            {/* Optional Description / Subnote */}
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Catatan tambahan atau detail langkah (opsional)..."
              className="w-full bg-transparent text-xs text-neutral-700 dark:text-neutral-300 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none pl-8"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pl-8 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                {/* Category Picker Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200/70 dark:hover:bg-neutral-700/70 text-neutral-700 dark:text-neutral-300 font-medium transition-colors"
                  >
                    <span className={`w-2 h-2 rounded-full ${currentCategory?.dotColor || 'bg-neutral-400'}`} />
                    <span>{category}</span>
                    <ChevronDown className="w-3 h-3 text-neutral-400" />
                  </button>

                  {isCategoryDropdownOpen && (
                    <div className="absolute left-0 mt-1 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg py-1 z-40">
                      <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                        Pilih Kategori
                      </div>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setCategory(cat.name);
                            setIsCategoryDropdownOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${cat.dotColor}`} />
                            <span>{cat.name}</span>
                          </div>
                          {category === cat.name && <Check className="w-3.5 h-3.5 text-neutral-900 dark:text-neutral-100" />}
                        </button>
                      ))}
                      <div className="border-t border-neutral-100 dark:border-neutral-800 mt-1 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsCategoryDropdownOpen(false);
                            onOpenCategoryModal();
                          }}
                          className="w-full text-left px-2.5 py-1.5 text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-1.5"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Kelola Kategori...</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Priority Selector */}
                <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setPriority('low')}
                    className={`px-2 py-0.5 rounded-md transition-colors ${
                      priority === 'low'
                        ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-2xs font-semibold'
                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800'
                    }`}
                  >
                    Rendah
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriority('medium')}
                    className={`px-2 py-0.5 rounded-md transition-colors ${
                      priority === 'medium'
                        ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-2xs font-semibold'
                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800'
                    }`}
                  >
                    Sedang
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriority('high')}
                    className={`px-2 py-0.5 rounded-md transition-colors ${
                      priority === 'high'
                        ? 'bg-rose-500 text-white shadow-2xs font-semibold'
                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800'
                    }`}
                  >
                    Mendesak
                  </button>
                </div>

                {/* Due Date Picker */}
                <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-lg">
                  <Calendar className="w-3.5 h-3.5" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="bg-transparent text-xs text-neutral-700 dark:text-neutral-300 focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Close Expansion Button */}
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 ml-auto"
              >
                Tutup Pilihan
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
