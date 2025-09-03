'use client';
import React from 'react';
import { useBusiness } from '@/hooks/useBusinesses';
import { useUserVote, useVoteBusiness } from '@/hooks/useVoteBusiness';
import { useUserStore } from '@/stores/useUserStore';
import { Plus } from 'lucide-react';
import { Minus } from 'lucide-react';

type KarmaProps = {
  businessId: string;
};
function Karma({ businessId }: KarmaProps) {
  const { data: business } = useBusiness(businessId);
  const { data: userVote } = useUserVote(businessId);
  const voteMutation = useVoteBusiness(businessId);
  const user = useUserStore((state) => state.profile);

  function handleVote(vote: 1 | -1) {
    if (!user) {
      alert('Please log in to vote');
      return;
    }
    voteMutation.mutate(vote);
  }
  return (
    <div className="flex items-center gap-3 lg:gap-2">
      <button
        className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-xl ${
          userVote?.vote === 1 ? 'bg-icons-color-success/50' : ''
        }`}
        onClick={() => handleVote(1)}
        disabled={voteMutation.isPending}
      >
        <Plus className="h-4 w-4 xl:h-5 xl:w-5" />
      </button>

      <p className="placeholder-sm xl:placeholder-base font-medium">
        {business?.karma}
      </p>

      <button
        className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded-xl xl:h-6 xl:w-6 ${
          userVote?.vote === -1 ? 'bg-icons-color-error/50' : ''
        }`}
        onClick={() => handleVote(-1)}
        disabled={voteMutation.isPending}
      >
        <Minus className="h-4 w-4 xl:h-5 xl:w-5" />
      </button>
    </div>
  );
}

export default Karma;
