import React from 'react';

interface ReviewsSkeletonProps {
  count?: number;
}
function ReviewsSkeleton({ count = 3 }: ReviewsSkeletonProps) {
  return (
    <div className="animate-pulse space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse space-y-2">
          <div className="h-4 w-1/3 rounded bg-gray-300"></div>
          <div className="h-3 w-full rounded bg-gray-200"></div>
        </div>
      ))}
    </div>
  );
}

export default ReviewsSkeleton;
