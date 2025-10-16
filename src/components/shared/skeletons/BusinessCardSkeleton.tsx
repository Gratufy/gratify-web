import React from 'react';

function BusinessCardSkeleton() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center px-4">
      <div className="w-full max-w-3xl animate-pulse space-y-4">
        <div className="h-8 w-1/2 rounded bg-gray-200" />
        <div className="h-6 w-1/3 rounded bg-gray-200" />
        <div className="h-6 w-2/3 rounded bg-gray-200" />
        <div className="h-48 w-full rounded bg-gray-200" />
        <div className="h-48 w-full rounded bg-gray-200" />
      </div>
    </div>
  );
}

export default BusinessCardSkeleton;
