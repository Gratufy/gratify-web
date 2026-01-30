import React from 'react';

interface ReviewsSkeletonProps {
  count?: number;
}
function AdminSkeleton({ count = 3 }: ReviewsSkeletonProps) {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse space-y-2">
          <div className="bg-background-grey-100 h-14 w-full rounded"></div>
        </div>
      ))}
    </div>
  );
}

export default AdminSkeleton;
