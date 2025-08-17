"use client";
import React from "react";
import { useBusiness } from "@/hooks/useBusinesses";
import { useUserVote, useVoteBusiness } from "@/hooks/useVoteBusiness";
import { useUserStore } from "@/stores/useUserStore";

type KarmaProps = {
  businessId: string;
};
function Karma({ businessId }: KarmaProps) {
  const { data: business } = useBusiness(businessId);
  const { data: userVote } = useUserVote(businessId);
  const voteMutation = useVoteBusiness(businessId);
  const user = useUserStore((state) => state.profile);
  console.log("user", user);
  console.log("userVote", userVote);
  return (
    <div className="flex gap-4 mt-4">
      <button
        className={`cursor-pointer  w-8 h-8 rounded-xl flex items-center justify-center ${
          userVote?.vote === 1 ? "bg-blue-400" : ""
        }`}
        onClick={() => voteMutation.mutate(1)}
        disabled={voteMutation.isPending}
      >
        👍
      </button>

      <p>Karma: {business?.karma}</p>

      <button
        className={`cursor-pointer w-8 h-8 rounded-xl flex items-center justify-center ${
          userVote?.vote === -1 ? "bg-red-400" : ""
        }`}
        onClick={() => voteMutation.mutate(-1)}
        disabled={voteMutation.isPending}
      >
        👎
      </button>
    </div>
  );
}

export default Karma;
