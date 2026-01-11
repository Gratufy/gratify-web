import React from 'react';

interface BusinessListSkeletonProps {
  count?: number;
}

function BusinessListSkeleton({ count = 3 }: BusinessListSkeletonProps) {
  return (
    <div className="w-full animate-pulse space-y-5 pl-4 lg:space-y-10 lg:pl-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-[226px] rounded bg-gray-200 lg:h-[248px] xl:h-[260px]"
        ></div>
      ))}
    </div>
  );
}

export default BusinessListSkeleton;
