import React from 'react';

function AuthHeaderSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-icons-grey-300 size-5" />
      <div className="bg-icons-grey-300 h-3 w-10" />
    </div>
  );
}

export default AuthHeaderSkeleton;
