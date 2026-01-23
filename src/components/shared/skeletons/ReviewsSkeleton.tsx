import React from 'react';

interface ReviewsSkeletonProps {
  count?: number;
}
function ReviewsSkeleton({ count = 3 }: ReviewsSkeletonProps) {
  return (
    <div className="animate-pulse space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse space-y-2">
          <div className="bg-background-grey-300 dark:bg-background-main-50 h-4 w-1/3 rounded"></div>
          <div className="bg-background-grey-200 dark:bg-background-main-50 h-3 w-full rounded"></div>
        </div>
      ))}
    </div>
  );
}

export default ReviewsSkeleton;
