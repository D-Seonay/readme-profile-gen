'use client';

import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useReadmeStore } from '@/store/useReadmeStore';
import { SHARE_URL_SOFT_LIMIT, buildShareUrl, decodeShareToken, encodeShareToken, readShareToken } from '@/lib/shareCodec';
import { fill } from '@/lib/format';
import { Button, useEngineText } from './ui';

/** Copie dans le presse-papiers un lien qui contient toute la configuration (compressée dans le fragment d'URL). */
export const ShareLinkButton = () => {
  const getShareableConfig = useReadmeStore((s) => s.getShareableConfig);
  const { e } = useEngineText();
  const [busy, setBusy] = useState(false);

  const share = async () => {
    setBusy(true);
    try {
      const token = await encodeShareToken(getShareableConfig());
      const url = buildShareUrl(window.location.href, token);
      await navigator.clipboard.writeText(url);
      toast.success(e.share.copied);
      if (url.length > SHARE_URL_SOFT_LIMIT) toast.warning(fill(e.share.tooLong, { length: url.length }));
    } catch {
      toast.error(e.share.failed);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button onClick={share} disabled={busy} aria-busy={busy}>
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M10 13a5 5 0 007.07 0l3-3a5 5 0 00-7.07-7.07l-1.5 1.5" />
        <path d="M14 11a5 5 0 00-7.07 0l-3 3a5 5 0 007.07 7.07l1.5-1.5" />
      </svg>
      {e.share.button}
    </Button>
  );
};

/** Boîte de confirmation minimale (Atelier), utilisée avant d'écraser le travail en cours. */
export const ConfirmDialog = ({ open, title, description, confirmLabel, cancelLabel, onConfirm, onCancel }: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  const confirmRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();
    const onKey = (ev: KeyboardEvent) => { if (ev.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center p-4">
      <div className="absolute inset-0 bg-canvas/80 backdrop-blur-sm" onClick={onCancel} aria-hidden />
      <div role="alertdialog" aria-modal="true" aria-labelledby="engine-confirm-title" aria-describedby="engine-confirm-desc" className="relative w-full max-w-md animate-rise space-y-4 rounded-sm border border-line-strong bg-surface p-6 shadow-hard-lg">
        <h2 id="engine-confirm-title" className="font-display text-2xl italic text-ink">{title}</h2>
        <p id="engine-confirm-desc" className="text-sm leading-relaxed text-ink-soft">{description}</p>
        <div className="flex justify-end gap-2">
          <Button onClick={onCancel}>{cancelLabel}</Button>
          <Button ref={confirmRef} variant="primary" onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
};

/**
 * À monter une fois dans le builder : lit `#cfg=…` au chargement, valide la configuration
 * (même sanitisation que l'import JSON) et demande confirmation avant d'écraser un travail existant.
 * Le fragment est ensuite retiré de l'URL pour ne pas être réappliqué au rechargement.
 */
export const ShareLinkLoader = () => {
  const { e } = useEngineText();
  const [pending, setPending] = useState<unknown>(null);
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;
    const token = readShareToken(window.location.hash);
    if (!token) return;
    const clearHash = () => window.history.replaceState(null, '', window.location.pathname + window.location.search);

    void decodeShareToken(token).then((config) => {
      clearHash();
      if (!config || typeof config !== 'object') {
        toast.error(e.share.invalid);
        return;
      }
      if (useReadmeStore.getState().hasUnsavedWork()) setPending(config);
      else load(config);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- lecture unique du lien au montage
  }, []);

  const load = (config: unknown) => {
    const store = useReadmeStore.getState();
    if (!store.applyConfig(config)) {
      toast.error(e.share.invalid);
      return;
    }
    toast.success(e.share.loaded);
    const { githubUsername, followersMode, showFollowers, showFollowing } = useReadmeStore.getState();
    // Les listes d'abonnés ne voyagent pas dans le lien : on les récupère si la grille d'avatars les affiche.
    if (githubUsername && followersMode === 'grid' && (showFollowers || showFollowing)) void store.fetchSocialData(githubUsername);
  };

  return (
    <ConfirmDialog
      open={pending !== null}
      title={e.share.loadTitle}
      description={e.share.loadDescription}
      confirmLabel={e.share.loadConfirm}
      cancelLabel={e.share.loadCancel}
      onConfirm={() => { load(pending); setPending(null); }}
      onCancel={() => setPending(null)}
    />
  );
};
