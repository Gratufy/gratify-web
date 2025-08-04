"use client";

import { useEffect } from "react"; //, Suspense
import { useSearchParams } from "next/navigation";
export const dynamic = "force-dynamic";

export default function PopupCallback() {
  const params = useSearchParams();

  // const params = useSearchParams();

  useEffect(() => {
    // const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (!code) {
      window.close();
      return;
    }

    const channel = new BroadcastChannel("popup-channel");
    channel.postMessage({ authResultCode: code });
    channel.close();

    window.close();
  }, [params]);

  return null;
}
// export default function PopupCallback() {
//   return (
//     <Suspense fallback={null}>
//       <PopupCallbackInner />
//     </Suspense>
//   );
// }
