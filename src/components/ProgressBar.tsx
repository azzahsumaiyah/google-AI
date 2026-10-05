import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, ListTodo } from 'lucide-react';

interface ProgressBarProps {
  total: number;
  completed: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ total, completed }) => {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  const getMotivationalText = () => {
    if (total === 0) return 'Belum ada tugas hari ini. Tambahkan tugas pertamamu di bawah!';
    if (percentage === 100) return 'Tuntas! Semua tugas hari ini berhasil kamu selesaikan 🎉';
    if (percentage >= 75) return 'Hebat! Kamu sudah hampir menyelesaikan seluruh target.';
    if (percentage >= 50) return 'Sudah separuh jalan, pertahankan fokusmu!';
    if (percentage > 0) return 'Awal yang baik! Terus selesaikan satu per satu.';
    return 'Waktunya produktif. Mulai selesaikan tugas paling penting terlebih dahulu.';
  };

  return (
    <div className="bg-white dark:bg-neutral-900/70 border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl p-5 sm:p-6 shadow-xs backdrop-blur-xs transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400 dark:text-neutral-500">
            Kemajuan Hari Ini
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>{percentage}% Selesai</span>
            {percentage === 100 && total > 0 && (
              <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                Selesai
              </span>
            )}
          </h2>
        </div>

        {/* Counter Pills */}
        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800/60">
            <ListTodo className="w-3.5 h-3.5 text-neutral-400" />
            <span className="font-semibold text-neutral-800 dark:text-neutral-200 tabular-nums">{total}</span> Total
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800/60">
            <Circle className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold text-neutral-800 dark:text-neutral-200 tabular-nums">{total - completed}</span> Aktif
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800/60">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-semibold text-neutral-800 dark:text-neutral-200 tabular-nums">{completed}</span> Selesai
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden relative">
        <motion.div
          className="h-full rounded-full bg-neutral-900 dark:bg-neutral-100"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
        <p className="truncate mr-2">{getMotivationalText()}</p>
        <span className="shrink-0 font-medium tabular-nums">
          {completed} / {total} tugas
        </span>
      </div>
    </div>
  );
};
