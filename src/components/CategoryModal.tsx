import React, { useState } from 'react';
import { X, Plus, Trash2, Check } from 'lucide-react';
import { CategoryInfo } from '../types/todo';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryInfo[];
  onAddCategory: (category: CategoryInfo) => void;
  onDeleteCategory: (categoryId: string) => void;
}

const COLOR_PRESETS = [
  { name: 'blue', dot: 'bg-blue-500', bgLight: 'bg-blue-50', bgDark: 'dark:bg-blue-950/40', textLight: 'text-blue-700', textDark: 'dark:text-blue-300' },
  { name: 'emerald', dot: 'bg-emerald-500', bgLight: 'bg-emerald-50', bgDark: 'dark:bg-emerald-950/40', textLight: 'text-emerald-700', textDark: 'dark:text-emerald-300' },
  { name: 'rose', dot: 'bg-rose-500', bgLight: 'bg-rose-50', bgDark: 'dark:bg-rose-950/40', textLight: 'text-rose-700', textDark: 'dark:text-rose-300' },
  { name: 'indigo', dot: 'bg-indigo-500', bgLight: 'bg-indigo-50', bgDark: 'dark:bg-indigo-950/40', textLight: 'text-indigo-700', textDark: 'dark:text-indigo-300' },
  { name: 'amber', dot: 'bg-amber-500', bgLight: 'bg-amber-50', bgDark: 'dark:bg-amber-950/40', textLight: 'text-amber-700', textDark: 'dark:text-amber-300' },
  { name: 'purple', dot: 'bg-purple-500', bgLight: 'bg-purple-50', bgDark: 'dark:bg-purple-950/40', textLight: 'text-purple-700', textDark: 'dark:text-purple-300' },
  { name: 'cyan', dot: 'bg-cyan-500', bgLight: 'bg-cyan-50', bgDark: 'dark:bg-cyan-950/40', textLight: 'text-cyan-700', textDark: 'dark:text-cyan-300' },
];

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAddCategory,
  onDeleteCategory,
}) => {
  const [newCatName, setNewCatName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_PRESETS[0]);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newCatName.trim();
    if (!cleanName) return;

    if (categories.some((c) => c.name.toLowerCase() === cleanName.toLowerCase())) {
      setError('Kategori dengan nama ini sudah ada.');
      return;
    }

    const newCategory: CategoryInfo = {
      id: cleanName,
      name: cleanName,
      color: selectedColor.name,
      bgLight: selectedColor.bgLight,
      bgDark: selectedColor.bgDark,
      textLight: selectedColor.textLight,
      textDark: selectedColor.textDark,
      dotColor: selectedColor.dot,
    };

    onAddCategory(newCategory);
    setNewCatName('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/40 backdrop-blur-xs">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              Kelola Kategori
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Atur tag kategori untuk mengelompokkan tugasmu
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Existing Categories List */}
        <div className="my-4 max-h-48 overflow-y-auto flex flex-col gap-1.5 pr-1">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 text-xs font-medium text-neutral-800 dark:text-neutral-200"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${cat.dotColor}`} />
                <span>{cat.name}</span>
              </div>
              {/* Allow delete if more than 1 category */}
              {categories.length > 1 && (
                <button
                  type="button"
                  onClick={() => onDeleteCategory(cat.id)}
                  title="Hapus kategori"
                  className="text-neutral-400 hover:text-rose-500 p-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add New Category Form */}
        <form onSubmit={handleAdd} className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-col gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Tambah Kategori Baru
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => {
                  setNewCatName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Contoh: Finansial, Olahraga..."
                className="grow text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
              <button
                type="submit"
                className="shrink-0 px-3 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900 rounded-lg flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Simpan</span>
              </button>
            </div>
            {error && <p className="text-[11px] text-rose-500 mt-1">{error}</p>}
          </div>

          {/* Color Palette Choices */}
          <div>
            <span className="block text-[11px] text-neutral-500 dark:text-neutral-400 mb-1.5 font-medium">
              Pilih Warna Aksen
            </span>
            <div className="flex items-center gap-2">
              {COLOR_PRESETS.map((color) => {
                const isSelected = selectedColor.name === color.name;
                return (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-6 h-6 rounded-full ${color.dot} flex items-center justify-center transition-transform ${
                      isSelected ? 'ring-2 ring-offset-2 ring-neutral-900 dark:ring-white scale-110' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
