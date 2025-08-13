import React from "react";
import Link from "next/link";

interface BackButtonProps {
  href: string; // если указан, кнопка ведёт на этот путь
  label?: string; // текст кнопки
}

function BackButton({ href, label = "<-- Go Back" }: BackButtonProps) {
  return (
    <Link
      className="flex justify-center items-center w-30 h-10 rounded-3xl bg-amber-500 text-white"
      href={href}
    >
      {label}
    </Link>
  );
}

export default BackButton;
