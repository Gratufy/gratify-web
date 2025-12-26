import IconCategory from '@/assets/icons/menu/icon-category.svg';
import IconModering from '@/assets/icons/menu/icon-modering.svg';
// import IconSettings from '@/assets/icons/admin/icon-setting.svg';
import IconMain from '@/assets/icons/admin/icon-main.svg';
import EditPen from '@/assets/icons/general/feedback-edit.svg';

export const ADMIN_LINKS = [
  { href: '/admin', label: 'Головна', icon: IconMain },
  { href: '/admin/modering', label: 'Модерування', icon: IconModering },
  { href: '/admin/categories', label: 'Категорії', icon: IconCategory },
  { href: '/admin/review', label: 'Відгуки', icon: EditPen },
  //   { href: '/admin/settings', label: 'Налаштування', icon: IconSettings },
];
