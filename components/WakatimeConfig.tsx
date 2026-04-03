'use client';

import React from 'react';
import { useReadmeStore, ServiceStatus } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';

const StatusDot = ({ status }: { status: ServiceStatus }) => {
  if (status === 'checking') return <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse" />;
  if (status === 'online') return <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />;
  return <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />;
};

export const WakatimeConfig = () => {
  const { wakatimeUsername, setWakatimeUsername, servicesStatus, uiTheme } = useReadmeStore();
  const { t } = useTranslation();
  const isDark = uiTheme === 'dark';

  const isOffline = servicesStatus.wakatime === 'offline';

  return (
    <div className={`space-y-6 transition-colors ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <label className={`text-[9px] font-mono uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              {t.wakatime.placeholder}
            </label>
            <div className="flex items-center gap-2">
              <span className={`text-[8px] font-mono uppercase ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>Service Status:</span>
              <StatusDot status={servicesStatus.wakatime} />
            </div>
          </div>
          <input
            type="text"
            value={wakatimeUsername}
            onChange={(e) => setWakatimeUsername(e.target.value)}
            className={`border p-3 rounded font-mono text-sm focus:outline-none focus:border-indigo-500 transition-colors ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-700' : 'bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-300'}`}
            placeholder="e.g. dseonay"
          />
        </div>

        {isOffline && (
          <p className="text-[10px] font-mono text-red-500 italic px-1 bg-red-500/5 p-2 rounded-lg border border-red-500/20">
            // WakaTime statistics service is currently unreachable.
          </p>
        )}
      </div>
    </div>
  );
};
