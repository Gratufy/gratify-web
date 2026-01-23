'use client';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-icons-color-white hover-focus-card-dark flex w-8 items-center justify-center p-1.5">
      {mounted ? (
        resolvedTheme === 'dark' ? (
          <Sun
            onClick={() => setTheme('light')}
            className="dark:text-icons-main-800 size-5 cursor-pointer"
            aria-label="Switch to light"
          />
        ) : (
          <Moon
            onClick={() => setTheme('dark')}
            className="text-icons-main-600 size-5 cursor-pointer"
            aria-label="Switch to dark"
          />
        )
      ) : (
        <Spinner size={20} />
      )}
    </div>
  );
}
