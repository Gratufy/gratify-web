import React from "react";
import { Spinner } from '@/components/ui/spinner';

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
        <Spinner />
    </div>
  );
}

export default Loading;
