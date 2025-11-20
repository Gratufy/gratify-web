import * as v from 'valibot';
import { LocationFormData } from '@/types';

const emptyToUndefined = v.transform((value: unknown) => {
  if (typeof value === 'string' && value.trim() === '') return undefined;
  return value;
});

export const businessFormSchema = v.pipe(
  v.object({
    isOnline: v.boolean(), // checkbox for online status
    name: v.pipe(v.string(), v.nonEmpty('Будь ласка, введіть назву бізнесу')),
    description: v.pipe(
      v.string(),
      v.nonEmpty('Будь ласка, введіть опис бізнесу')
    ),
    website: v.pipe(
      v.any(),
      emptyToUndefined,
      v.optional(
        v.pipe(v.string(), v.url('Введіть коректне посилання на сайт'))
      )
    ),

    specialOffers: v.array(v.string()),
    ownOffers: v.array(v.string()),
    category: v.pipe(
      v.string(),
      v.nonEmpty('Будь ласка, оберіть категорію бізнесу')
    ),
    locations: v.array(
      v.object({
        city: v.optional(v.string()),
        address: v.optional(v.string()),
        latitude: v.optional(v.number()),
        longitude: v.optional(v.number()),
        // latitude: v.optional(v.nullable(v.number())),
        // longitude: v.optional(v.nullable(v.number())),
      })
    ),
  }),
  // check 1: if online - true , website is required
  v.forward(
    v.partialCheck(
      [['isOnline'], ['website']],
      (data) => {
        // if online but no website -> error
        return !(data.isOnline && !data.website);
      },
      "Посилка на сайт є обов'язковою для онлайн бізнесу."
    ),
    ['website']
  ),

  v.forward(
    v.partialCheck(
      [['isOnline'], ['locations']],
      (data) => {
        if (data.isOnline) return true; // онлайн → не проверяем

        // офлайн → должна быть хотя бы одна локация с городом
        return (
          data.locations.length > 0 &&
          data.locations.every(
            (loc: LocationFormData) => loc.city && loc.city.trim() !== ''
          )
        );
      },
      'Будь ласка, додайте принаймні одну локацію з містом для офлайн бізнесу.'
    ),
    ['locations']
  )
);
