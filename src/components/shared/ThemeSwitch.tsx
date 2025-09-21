'use client';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <div className="bg-icons-grey-50 p-1.5">
      {resolvedTheme === 'dark' ? (
        <Sun
          onClick={() => setTheme('light')}
          className="size-5 cursor-pointer"
          aria-label="Switch to light"
        />
      ) : (
        <Moon
          onClick={() => setTheme('dark')}
          className="size-5 cursor-pointer"
          aria-label="Switch to dark"
        />
      )}
    </div>
  );
}
