import React from 'react';
import { CheckCircle2, Inbox, SearchX, Plus } from 'lucide-react';
import { FilterStatus } from '../types/todo';

interface EmptyStateProps {
  filterStatus: FilterStatus;
  hasSearch: boolean;
  onClearFilters?: () => void;
  onFocusInput?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  filterStatus,
  hasSearch,
  onClearFilters,
  onFocusInput,
}) => {
  if (hasSearch) {
    return (
      <div className="py-16 text-center flex flex-col items-center justify-center px-4">
        <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 flex items-center justify-center text-neutral-400 mb-3">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
          Tidak ada hasil pencarian
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mb-4">
          Coba periksa kembali ejaan atau hapus kata kunci pencarian.
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg transition-colors"
          >
            Hapus Pencarian
          </button>
        )}
      </div>
    );
  }

  if (filterStatus === 'completed') {
    return (
      <div className="py-16 text-center flex flex-col items-center justify-center px-4">
        <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 flex items-center justify-center text-neutral-400 mb-3">
          <CheckCircle2 className="w-6 h-6 text-neutral-400" />
        </div>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
          Belum ada tugas selesai
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs">
          Centang lingkaran pada tugas aktif yang telah kamu rampungkan untuk memindahkannya ke sini.
        </p>
      </div>
    );
  }

  if (filterStatus === 'active') {
    return (
      <div className="py-16 text-center flex flex-col items-center justify-center px-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
          Semua tugas aktif beres!
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mb-4">
          Tidak ada tugas tertunda saat ini. Santai sejenak atau tambahkan rencana baru.
        </p>
        {onFocusInput && (
          <button
            onClick={onFocusInput}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Tugas Baru</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="py-16 text-center flex flex-col items-center justify-center px-4">
      <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 flex items-center justify-center text-neutral-400 mb-3">
        <Inbox className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
        Daftar tugas masih kosong
      </h3>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mb-4">
        Tulis target atau tugas pertamamu di kolom input di atas untuk memulai.
      </p>
    </div>
  );
};
