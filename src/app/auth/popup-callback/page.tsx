"use client";

import { useEffect } from "react"; //, Suspense
import { useSearchParams } from "next/navigation";
export const dynamic = "force-dynamic";

export function PopupCallback() {
  const params = useSearchParams();
  const code = params.get("code");

  useEffect(() => {
    if (!code) {
      window.close();
      return;
    }

    const channel = new BroadcastChannel("popup-channel");
    channel.postMessage({ authResultCode: code });
    channel.close();

    window.close();
  }, [code]);

  return null;
}
// export default function PopupCallback() {
//   return (
//     <Suspense fallback={null}>
//       <PopupCallbackInner />
//     </Suspense>
//   );
// }
