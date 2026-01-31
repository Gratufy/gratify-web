'use client';
import React, { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import IconBack from '@/assets/icons/general/icon-back.svg';

interface BackButtonProps {
  href?: string; // если указан, кнопка ведёт на этот путь
  className?: string;
}

function GoBackButton({ href = '/', className }: BackButtonProps) {
  const router = useRouter();
  const hasHistory = useRef(false);

  useEffect(() => {
    // Проверяем, есть ли история браузера
    // window.history.length > 1 — значит, был переход
    hasHistory.current =
      window.history.length > 1 && window.history.state !== null;
  }, []);
  return (
    <button
      aria-label="Повернутись на попередню сторінку"
      className={`group flex cursor-pointer items-center ${className}`}
      onClick={() => {
        if (hasHistory.current) {
          router.back();
        } else {
          router.push(href);
        }
      }}
    >
      <IconBack
        className="size-6 stroke-[1.5] transition-all group-hover:stroke-[2]"
        aria-hidden="true"
      />
      {/* <span className="sr-only">Повернутись на попередню сторінку</span> */}
    </button>
  );
}

export default GoBackButton;
