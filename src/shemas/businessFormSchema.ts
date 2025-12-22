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
  // check 1: at least one offer (special or own)
  v.forward(
    v.partialCheck(
      [['specialOffers'], ['ownOffers']],
      (data) => {
        // офлайн → должна быть хотя бы одна локация с городом
        return data.specialOffers.length > 0 || data.ownOffers.length > 0;
      },
      'Будь ласка, додайте принаймні одну спеціальну пропозицію або власну пропозицію.'
    ),
    ['specialOffers']
  ),
  // check 2: if online - true , website is required
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
  // check 3: if online - false , at least one location with city is required
  v.forward(
    v.partialCheck(
      [['isOnline'], ['locations']],
      (data) => {
        if (data.isOnline) return true; // online → do not check

        // offline → it should have at least one location with city
        return (
          data.locations.length > 0 &&
          data.locations.some(
            (loc: LocationFormData) => loc.city && loc.city.trim() !== ''
          )
        );
      },
      'Будь ласка, додайте принаймні одну локацію з містом для офлайн бізнесу.'
    ),
    ['locations']
  )
);
