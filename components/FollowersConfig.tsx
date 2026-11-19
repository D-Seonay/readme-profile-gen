'use client';

import React, { useEffect } from 'react';
import { useReadmeStore } from '@/store/useReadmeStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Field, Segmented, Slider, SwitchRow } from '@/components/ui';
import { NeedsUsername } from '@/components/builder/NeedsUsername';

export const FollowersConfig = () => {
  const {
    githubUsername,
    showFollowers, toggleFollowers,
    showFollowing, toggleFollowing,
    followersMode, setFollowersMode,
    followersLimit, setFollowersLimit,
    followersList, fetchSocialData,
  } = useReadmeStore();
  const { t } = useTranslation();

  // Charger les données si elles sont vides
  useEffect(() => {
    if (githubUsername && followersList.length === 0) {
      fetchSocialData(githubUsername);
    }
  }, [githubUsername, followersList.length, fetchSocialData]);

  return (
    <div className="space-y-7">
      {!githubUsername && <NeedsUsername message={t.builder.followers.needsUser} />}

      <div className="grid gap-2 sm:grid-cols-2">
        <SwitchRow checked={showFollowers} onCheckedChange={toggleFollowers} label={t.followers.showFollowers} />
        <SwitchRow checked={showFollowing} onCheckedChange={toggleFollowing} label={t.followers.showFollowing} />
      </div>

      <Field kind="group" label={t.followers.mode}>
        <Segmented
          layout="grid"
          className="grid-cols-1 sm:grid-cols-3"
          value={followersMode}
          onChange={setFollowersMode}
          options={[
            { value: 'badges', label: t.followers.badges },
            { value: 'list', label: t.followers.list },
            { value: 'grid', label: t.followers.grid },
          ]}
        />
      </Field>

      {/* Slider visible uniquement en mode GRID */}
      {followersMode === 'grid' && (
        <Field label={t.followers.limit} hint={t.builder.followers.limitHint} className="animate-pop">
          <Slider min={5} max={50} step={5} value={followersLimit} onChange={setFollowersLimit} />
        </Field>
      )}
    </div>
  );
};
