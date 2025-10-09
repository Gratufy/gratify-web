import React from 'react';
import { Spinner } from '@/components/ui/spinner';

function Loading() {
  return (
    <div className="flex min-h-screen justify-center pt-20">
      <Spinner />
    </div>
  );
}

export default Loading;
