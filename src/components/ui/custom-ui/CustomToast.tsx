import { toast } from 'sonner';
import { SquareCheckBig, AlertTriangle, CircleX, Info } from 'lucide-react';
import { ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ShowToastProps {
  content: ReactNode;
  type?: ToastType;
  duration?: number;
}

export function CustomToast({
  content,
  type = 'success',
  duration = 4000,
}: ShowToastProps) {
  const icons = {
    success: <SquareCheckBig className="h-5 w-5 text-green-600" />,
    error: <CircleX className="h-5 w-5 text-red-600" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
    info: <Info className="h-5 w-5 text-blue-600" />,
  };

  toast[type](content, {
    icon: icons[type],
    duration,
    closeButton: true,
  });
}

// Usage Example:
// CustomToast({
//   type: 'warning',
//   content: (
//     <>
//       <p className="font-semibold">
//         Будь ласка, вкажить адресу перед перевіркою
//       </p>
//     </>
//   ),
// });
