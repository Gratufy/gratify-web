import FavoritesHomeClient from '@/components/favorites/FavoritesHomeClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Обрані бізнеси',
  description: 'Збережені бізнеси користувача',
};
export default function UserFavorites() {
  return (
    <div className="flex flex-col items-center pl-0 pr-0">
      <FavoritesHomeClient />
    </div>
  );
}
