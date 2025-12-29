'use client';

import { useEffect } from 'react';

export default function PopupCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (!code) {
      window.close();
      return;
    }

    const channel = new BroadcastChannel('popup-channel');
    channel.postMessage({ authResultCode: code });
    channel.close();

    window.close();
  }, []);

  return null;
}
// export default function PopupCallback() {
//   return (
//     <Suspense fallback={null}>
//       <PopupCallbackInner />
//     </Suspense>
//   );
// }
