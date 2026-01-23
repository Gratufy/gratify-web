'use client';
import React, { useState, useEffect } from 'react';
import IconUser from '@/assets/icons/general/icon-user.svg';
import { useRouter } from 'next/navigation';
import { useUserVote, useVoteBusiness } from '@/hooks/useVoteBusiness';

import { Plus } from 'lucide-react';
import { Minus } from 'lucide-react';
import { VoteValue } from '@/types/enums';

interface KarmaProps {
  businessId: string;
  initialKarma: number;

  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoggedIn: boolean;
  setAlertTitle: React.Dispatch<React.SetStateAction<string>>;
  setActionContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  setOnConfirm: React.Dispatch<React.SetStateAction<() => void>>;
}

function Karma({
  businessId,
  initialKarma,

  setOpen,
  isLoggedIn,
  setAlertTitle,
  setActionContent,
  setOnConfirm,
}: KarmaProps) {
  const router = useRouter();
  const [karma, setKarma] = useState(initialKarma);
  const [currentVote, setCurrentVote] = useState<VoteValue>(0);
  // if props change, update karma

  const { data: userVote } = useUserVote(businessId);
  const voteMutation = useVoteBusiness(businessId);

  useEffect(() => {
    setKarma(initialKarma);
  }, [initialKarma]);

  function normalizeVote(vote?: number): VoteValue {
    if (vote === 1 || vote === -1) return vote;
    return 0;
  }
  useEffect(() => {
    setCurrentVote(normalizeVote(userVote?.vote));
  }, [userVote?.vote]);

  function handleVote(e: React.MouseEvent, vote: 1 | -1) {
    e.preventDefault(); // Prevent navigating to business detail page
    e.stopPropagation(); // Stop event from bubbling up
    if (!isLoggedIn) {
      setAlertTitle('Для голосування, авторизуйтесь будь ласка');
      setActionContent(
        <>
          <IconUser className="mr-2 inline size-4 xl:size-5" />
          Вхід
        </>
      );
      setOnConfirm(() => () => router.push('/login'));
      setOpen(true);
      return;
    }
    const prev = userVote?.vote ?? 0;
    // const prev = currentVote;
    const newVote = prev === vote ? 0 : vote;

    const delta = newVote - prev;
    setKarma((k) => k + delta);
    setCurrentVote(newVote);
    voteMutation.mutate(vote);
  }
  return (
    <div
      className="title-h6 bg-icons-color-white shadow-menu flex items-center gap-2 py-1"
      onClick={(e) => {
        // e.stopPropagation();
        e.preventDefault();
      }}
      role="group" // optional, для screen reader
      aria-label="Голосування за бізнес"
    >
      <button
        aria-label={
          userVote?.vote === 1
            ? 'Видалити позитивний голос'
            : 'Додати позитивний голос'
        }
        aria-pressed={currentVote === 1}
        className={`hover-focus-card-dark flex h-5 w-5 cursor-pointer items-center justify-center ${
          //  userVote?.vote === 1
          currentVote === 1
            ? 'bg-icons-color-success text-background-white'
            : ''
        }`}
        onClick={(e) => {
          handleVote(e, 1);
        }}
        disabled={voteMutation.isPending}
      >
        <Plus className="h-3 w-3" aria-hidden="true" />
      </button>

      <p aria-label="Поточна карма">{karma}</p>

      <button
        aria-label={
          userVote?.vote === -1
            ? 'Видалити негативний голос'
            : 'Додати негативний голос'
        }
        aria-pressed={currentVote === -1}
        className={`hover-focus-card-dark flex h-5 w-5 cursor-pointer items-center justify-center xl:h-6 xl:w-6 ${
          currentVote === -1 ? 'bg-icons-color-error text-background-white' : ''
        }`}
        onClick={(e) => {
          handleVote(e, -1);
        }}
        disabled={voteMutation.isPending}
      >
        <Minus className="h-3 w-3" aria-hidden="true" />
      </button>
    </div>
  );
}

export default Karma;
