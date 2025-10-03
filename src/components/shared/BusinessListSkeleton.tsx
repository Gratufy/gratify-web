import React from 'react';
interface BusinessListSkeletonProps {
  count?: number;
}

function BusinessListSkeleton({ count = 3 }: BusinessListSkeletonProps) {
  return (
    <div className="w-full animate-pulse space-y-4">
      <p>My SKELETON</p>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-24 rounded bg-gray-200"></div>
      ))}
    </div>
  );
}

export default BusinessListSkeleton;
