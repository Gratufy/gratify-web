'use client';
import React, { useState, useEffect } from 'react';
import IconUser from '@/assets/icons/general/icon-user.svg';
import { useRouter } from 'next/navigation';
import { useUserVote, useVoteBusiness } from '@/hooks/useVoteBusiness';

import { Plus } from 'lucide-react';
import { Minus } from 'lucide-react';

type KarmaProps = {
  businessId: string;
  initialKarma: number;

  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoggedIn: boolean;
  setAlertTitle: React.Dispatch<React.SetStateAction<string>>;
  setActionContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  setOnConfirm: React.Dispatch<React.SetStateAction<() => void>>;
};
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
  // если пропсы обновились (при возврате на страницу) — пересинхронизируем

  //const { data: business } = useBusiness(businessId);
  const { data: userVote } = useUserVote(businessId);
  const voteMutation = useVoteBusiness(businessId);

  useEffect(() => {
    setKarma(initialKarma);
  }, [initialKarma]);

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
    const newVote = prev === vote ? 0 : vote;
    const delta = newVote - prev;
    setKarma((k) => k + delta);
    voteMutation.mutate(vote);
  }
  return (
    <div className="flex items-center gap-3 py-1 lg:gap-2">
      <button
        className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-xl ${
          userVote?.vote === 1 ? 'bg-icons-color-success/50' : ''
        }`}
        onClick={(e) => {
          handleVote(e, 1);
        }}
        disabled={voteMutation.isPending}
      >
        <Plus className="h-4 w-4 xl:h-5 xl:w-5" />
      </button>

      <p className="placeholder-xs lg:placeholder-sm xl:placeholder-base font-medium">
        {karma}
      </p>

      <button
        className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-xl xl:h-6 xl:w-6 ${
          userVote?.vote === -1 ? 'bg-icons-color-error/50' : ''
        }`}
        onClick={(e) => {
          handleVote(e, -1);
        }}
        disabled={voteMutation.isPending}
      >
        <Minus className="h-4 w-4 xl:h-5 xl:w-5" />
      </button>
    </div>
  );
}

export default Karma;
