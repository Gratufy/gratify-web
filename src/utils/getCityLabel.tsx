import { UKRAINE_REGIONAL_CENTERS } from '@/const/regions';

// export function getCityLabel(cityValue: string): string {
//   const city = UKRAINE_REGIONAL_CENTERS.find((c) => c.value === cityValue);
//   return city ? city.label : 'Вся Україна';
// }

export function getCityLabel(cityValue: string) {
  return (
    UKRAINE_REGIONAL_CENTERS.find((c) => c.value === cityValue)?.label ??
    'Вся Україна'
  );
}
