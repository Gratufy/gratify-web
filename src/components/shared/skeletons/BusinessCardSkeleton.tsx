import React from 'react';

function BusinessCardSkeleton() {
  return (
    <div className="flex min-h-screen flex-col items-center px-4 pt-10 lg:pt-14">
      <div className="w-full max-w-xl animate-pulse space-y-4">
        <div className="dark:bg-background-main-100 bg-background-grey-100 h-8 w-2/3 rounded" />
        <div className="dark:bg-background-main-100 bg-background-grey-100 h-6 w-1/2 rounded" />
        <div className="dark:bg-background-main-50 bg-background-grey-100/50 h-6 w-3/4 rounded" />
        <div className="dark:bg-background-main-50 bg-background-grey-100/50 h-40 w-full rounded" />
      </div>
    </div>
  );
}

export default BusinessCardSkeleton;
