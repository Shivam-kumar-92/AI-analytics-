import React from 'react';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  badge?: string;
  badgeColor?: 'emerald' | 'indigo' | 'amber' | 'rose' | 'slate';
  icon?: React.ReactNode;
  confidence?: number;
  infoTooltip?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  badge,
  badgeColor = 'indigo',
  icon,
  confidence,
  infoTooltip,
}) => {
  const badgeStyles = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    slate: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  return (
    <div className="glass-card rounded-2xl p-5 relative overflow-hidden transition-all duration-200 group">
      {/* Subtle background glow */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-all duration-300" />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
            {infoTooltip && (
              <span title={infoTooltip} className="cursor-help text-slate-500 hover:text-slate-300 transition-colors">
                <Info className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl lg:text-3xl font-bold tracking-tight text-white">{value}</span>
            {trendValue && (
              <span
                className={`inline-flex items-center text-xs font-semibold ${
                  trend === 'up'
                    ? 'text-emerald-400'
                    : trend === 'down'
                    ? 'text-rose-400'
                    : 'text-slate-400'
                }`}
              >
                {trend === 'up' && <TrendingUp className="w-3.5 h-3.5 mr-0.5" />}
                {trend === 'down' && <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
                {trend === 'neutral' && <Minus className="w-3.5 h-3.5 mr-0.5" />}
                {trendValue}
              </span>
            )}
          </div>
        </div>

        {icon && (
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-indigo-400">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
        {subtitle && <span className="text-slate-400 truncate max-w-[200px]">{subtitle}</span>}
        {badge && (
          <span
            className={`px-2 py-0.5 text-[11px] font-medium rounded-full border ${badgeStyles[badgeColor]}`}
          >
            {badge}
          </span>
        )}
        {confidence !== undefined && (
          <span className="text-[11px] text-slate-400 font-mono">
            Conf: <strong className="text-slate-200">{confidence}%</strong>
          </span>
        )}
      </div>
    </div>
  );
};
