'use client';

import React, { useRef } from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'sonner';

/** Export / import de toute la configuration en JSON, pour la sauvegarder ou la reprendre ailleurs. */
export const ConfigTransfer = () => {
  const exportConfig = useReadmeStore((state) => state.exportConfig);
  const importConfig = useReadmeStore((state) => state.importConfig);
  const uiTheme = useReadmeStore((state) => state.uiTheme);
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDark = uiTheme === 'dark';

  const buttonClass = `text-[9px] font-mono border ${isDark ? 'border-zinc-800 text-zinc-600 hover:text-zinc-100 hover:border-zinc-500' : 'border-zinc-200 text-zinc-400 hover:text-zinc-900 hover:border-zinc-400'} px-3 py-1.5 rounded transition-all uppercase tracking-widest`;

  const handleExport = () => {
    const url = URL.createObjectURL(new Blob([exportConfig()], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'readme-profile-config.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(t.free.exported);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ''; // permet de réimporter le même fichier
    if (!file) return;
    try {
      if (importConfig(await file.text())) {
        toast.success(t.free.imported);
        return;
      }
    } catch {
      // fichier illisible : même message que pour un JSON invalide
    }
    toast.error(t.free.importError);
  };

  return (
    <>
      <button type="button" onClick={handleExport} className={buttonClass}>{t.free.export}</button>
      <button type="button" onClick={() => fileInputRef.current?.click()} className={buttonClass}>{t.free.import}</button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleImport}
        className="hidden"
        aria-label={t.free.import}
      />
    </>
  );
};
