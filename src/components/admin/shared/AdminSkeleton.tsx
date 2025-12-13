import React from 'react';

interface ReviewsSkeletonProps {
  count?: number;
}
function AdminSkeleton({ count = 3 }: ReviewsSkeletonProps) {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse space-y-2">
          <div className="h-14 w-full rounded bg-gray-200"></div>
        </div>
      ))}
    </div>
  );
}

export default AdminSkeleton;
