'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useConfigTransfer } from '@/hooks/useConfigTransfer';
import { Button } from '@/components/ui';

/** Export / import de toute la configuration en JSON, pour la sauvegarder ou la reprendre ailleurs. */
export const ConfigTransfer = () => {
  const { t } = useTranslation();
  const { handleExport, openImport, fileInput } = useConfigTransfer();

  return (
    <>
      <Button size="xs" icon="download" onClick={handleExport}>
        {t.free.export}
      </Button>
      <Button size="xs" icon="upload" onClick={openImport}>
        {t.free.import}
      </Button>
      {fileInput}
    </>
  );
};
