"use client";
import React from "react";
import { useBusiness } from "@/hooks/useBusinesses";
import BackButton from "../ui/BackButton";
import { useUserVote, useVoteBusiness } from "@/hooks/useVoteBusiness";
import { useUserStore } from "@/stores/useUserStore";

interface Props {
  id: string;
  href: string;
}

function BusinessDetails({ id, href }: Props) {
  const { data: userVote } = useUserVote(id);
  const voteMutation = useVoteBusiness(id);
  const { data, isLoading, error } = useBusiness(id);

  const user = useUserStore((state) => state.profile);
  console.log("user", user);
  console.log("voteMutation", voteMutation);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <BackButton href={href} />
      <h1 className="text-4xl font-bold mb-4">
        Business Details for {data?.name}
      </h1>
      <div className="flex flex-col items-center justify-center  p-4">
        <p className="text-2xl mb-4">Name: {data?.name}</p>
        <p className="text-2xl mb-4">City: {data?.city}</p>
        <p className="text-2xl ">Category: {data?.categoryName}</p>
        <p className="text-2xl ">Status: {data?.status}</p>
        {/* karma */}
        <div className="flex gap-4 mt-4">
          <button
            className={`cursor-pointer  w-8 h-8 rounded-xl flex items-center justify-center ${
              userVote?.vote === 1 ? "bg-blue-400" : ""
            }`}
            onClick={() => voteMutation.mutate(-1)}
            disabled={voteMutation.isPending}
          >
            👍
          </button>

          <p>Karma: {data?.karma}</p>

          <button
            className={`cursor-pointer w-8 h-8 rounded-xl flex items-center justify-center ${
              userVote?.vote === -1 ? "bg-red-400" : ""
            }`}
            onClick={() => voteMutation.mutate(1)}
            disabled={voteMutation.isPending}
          >
            👎
          </button>
        </div>
        {/* end karma */}
      </div>
    </div>
  );
}

export default BusinessDetails;
