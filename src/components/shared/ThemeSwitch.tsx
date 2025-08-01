"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return resolvedTheme === "dark" ? (
    <Sun
      onClick={() => setTheme("light")}
      className="cursor-pointer w-6 h-6"
      aria-label="Switch to light"
    />
  ) : (
    <Moon
      onClick={() => setTheme("dark")}
      className="cursor-pointer w-6 h-6"
      aria-label="Switch to dark"
    />
  );
}
