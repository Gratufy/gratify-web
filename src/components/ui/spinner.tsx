import { Loader } from 'lucide-react'; // Loader2

export function Spinner({ size = 24 }: { size?: number }) {
  return <Loader className="animate-spin text-gray-500" size={size} />;
}
