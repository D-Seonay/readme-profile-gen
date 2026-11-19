'use client';

import React, { useRef } from 'react';
import { toast } from 'sonner';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * JSON export / import of the whole configuration. Returns the actions plus
 * the hidden file input to render once (menus and the palette share it).
 */
export const useConfigTransfer = () => {
  const exportConfig = useReadmeStore((state) => state.exportConfig);
  const importConfig = useReadmeStore((state) => state.importConfig);
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

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

  const openImport = () => inputRef.current?.click();

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept="application/json,.json"
      onChange={handleImport}
      className="hidden"
      tabIndex={-1}
      aria-hidden="true"
    />
  );

  return { handleExport, openImport, fileInput };
};
