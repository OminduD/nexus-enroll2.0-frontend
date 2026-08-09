import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: 'brand' | 'emerald' | 'amber' | 'cyan' | 'purple' | 'coral' | 'teal';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendUp = true,
  color = 'brand',
}) => {
  const colorMap = {
    brand: {
      accent: 'from-teal-600 to-teal-800',
      iconBg: 'bg-teal-50 text-teal-700 border-teal-200 glow-box-teal',
    },
    teal: {
      accent: 'from-teal-600 to-teal-800',
      iconBg: 'bg-teal-50 text-teal-700 border-teal-200 glow-box-teal',
    },
    emerald: {
      accent: 'from-teal-500 to-emerald-600',
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    amber: {
      accent: 'from-coral-400 to-coral-600',
      iconBg: 'bg-coral-50 text-coral-600 border-coral-200 glow-box-coral',
    },
    coral: {
      accent: 'from-coral-400 to-coral-600',
      iconBg: 'bg-coral-50 text-coral-600 border-coral-200 glow-box-coral',
    },
    cyan: {
      accent: 'from-teal-400 to-teal-600',
      iconBg: 'bg-teal-50 text-teal-600 border-teal-200',
    },
    purple: {
      accent: 'from-teal-600 to-slate-700',
      iconBg: 'bg-slate-100 text-[#333333] border-slate-300',
    },
  };

  const currentTheme = colorMap[color] || colorMap.brand;

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-500/40 hover:-translate-y-0.5 transition-all duration-300 group">
      {/* Top Gradient Line Accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${currentTheme.accent} opacity-90 group-hover:opacity-100 transition-opacity`} />

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <h4 className="text-2xl sm:text-3xl font-extrabold text-[#006666] tracking-tight font-mono">
            {value}
          </h4>
          {subtitle && (
            <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
          )}
          {trend && (
            <div className="pt-1">
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  trendUp
                    ? 'bg-teal-50 text-teal-700 border border-teal-200'
                    : 'bg-coral-50 text-coral-600 border border-coral-200'
                }`}
              >
                {trend}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3.5 rounded-2xl border ${currentTheme.iconBg} shrink-0 group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

