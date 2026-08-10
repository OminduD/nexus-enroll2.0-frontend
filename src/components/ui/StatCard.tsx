import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: 'brand' | 'emerald' | 'amber' | 'cyan' | 'purple' | 'coral' | 'teal';
  progress?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendUp = true,
  color = 'brand',
  progress,
}) => {
  const colorMap = {
    brand: {
      accent: 'from-teal-600 via-teal-700 to-teal-800',
      iconBg: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200/90 dark:border-teal-800/80 glow-box-teal',
      badge: 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
      valueText: 'text-teal-900 dark:text-teal-100',
      bar: 'bg-teal-600',
    },
    teal: {
      accent: 'from-teal-600 via-teal-700 to-teal-800',
      iconBg: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200/90 dark:border-teal-800/80 glow-box-teal',
      badge: 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
      valueText: 'text-teal-900 dark:text-teal-100',
      bar: 'bg-teal-600',
    },
    emerald: {
      accent: 'from-teal-500 via-emerald-600 to-teal-700',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/90 dark:border-emerald-800/80',
      badge: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      valueText: 'text-slate-900 dark:text-emerald-100',
      bar: 'bg-emerald-500',
    },
    amber: {
      accent: 'from-coral-400 via-amber-500 to-coral-600',
      iconBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/90 dark:border-amber-800/80 glow-box-coral',
      badge: 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      valueText: 'text-slate-900 dark:text-amber-100',
      bar: 'bg-amber-500',
    },
    coral: {
      accent: 'from-coral-500 via-coral-600 to-rose-600',
      iconBg: 'bg-coral-50 dark:bg-rose-950/60 text-coral-600 dark:text-coral-300 border-coral-200/90 dark:border-rose-800/80 glow-box-coral',
      badge: 'bg-coral-50 dark:bg-rose-950 text-coral-600 dark:text-coral-300 border-coral-200 dark:border-rose-800',
      valueText: 'text-slate-900 dark:text-coral-100',
      bar: 'bg-coral-500',
    },
    cyan: {
      accent: 'from-cyan-500 via-teal-600 to-teal-700',
      iconBg: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200/90 dark:border-cyan-800/80',
      badge: 'bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
      valueText: 'text-slate-900 dark:text-cyan-100',
      bar: 'bg-cyan-500',
    },
    purple: {
      accent: 'from-indigo-600 via-purple-600 to-teal-700',
      iconBg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200/90 dark:border-purple-800/80',
      badge: 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      valueText: 'text-slate-900 dark:text-purple-100',
      bar: 'bg-purple-500',
    },
  };

  const currentTheme = colorMap[color] || colorMap.brand;

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-teal-900/10 dark:hover:shadow-teal-500/5 hover:border-teal-500/40 dark:hover:border-teal-500/40 transition-all duration-300 group"
    >
      {/* Top Accent Gradient Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${currentTheme.accent} opacity-90 group-hover:opacity-100 transition-opacity`} />

      {/* Decorative background glow circle */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-teal-500/5 group-hover:bg-teal-500/15 transition-colors pointer-events-none blur-xl" />

      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-1.5 flex-1 pr-2">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h4 className={`text-2xl sm:text-3xl font-black ${currentTheme.valueText} tracking-tight font-mono leading-none pt-0.5`}>
            {value}
          </h4>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{subtitle}</p>
          )}

          {typeof progress === 'number' && (
            <div className="pt-2 w-full max-w-[180px]">
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${currentTheme.bar} transition-all duration-500`}
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
              </div>
            </div>
          )}

          {trend && (
            <div className="pt-1">
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${
                  trendUp
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/90 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border-rose-200/90 dark:border-rose-800'
                }`}
              >
                {trendUp ? <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <TrendingDown className="w-3 h-3 text-rose-500" />}
                {trend}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3.5 rounded-2xl border ${currentTheme.iconBg} shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-xs`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
    </motion.div>
  );
};


