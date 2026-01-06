'use server';

import { db } from '@/db';

import { businessLocations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { LocationFormData } from '@/types';

// get business location
export async function getBusinessLocation(businessId: string) {
  const [row] = await db
    .select()
    .from(businessLocations)
    .where(eq(businessLocations.businessId, businessId))
    .limit(1);

  if (!row) return null;

  return {
    businessId: row.businessId,
    latitude: row.latitude,
    longitude: row.longitude,
  };
}

// update coordinates
export async function updateBusinessLocation(vars: {
  businessId: string;
  latitude: number;
  longitude: number;
}) {
  const { businessId, latitude, longitude } = vars;
  const [updated] = await db
    .update(businessLocations)
    .set({ latitude, longitude })
    .where(eq(businessLocations.businessId, businessId))
    .returning();

  if (!updated) throw new Error('Failed to update location');

  return { businessId, latitude, longitude };
}

// check address (OpenStreetMap)
export async function checkAddress(city: string, address: string) {
  //const url = new URL('https://nominatim.openstreetmap.org/search');
  const url = new URL('https://geocode.maps.co/search');
  url.searchParams.set('street', address);
  url.searchParams.set('city', city);
  url.searchParams.set('country', 'Ukraine');
  url.searchParams.set('api_key', process.env.GEO_API_KEY!);

  //   const query = encodeURIComponent(`${address}, ${city}, Ukraine`);
  //   const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`;

  // const response = await fetch(url.toString(), {
  //   headers: {
  //     'User-Agent': 'BusinessFinder/0.1 (contact: zlatta2000@gmail.com)', // Your email here??????
  //     // "Referer": "https://yourdomain.com",
  //   },
  // });
  const response = await fetch(url.toString());

  if (response.status === 403) {
    throw new Error('ACCESS_BLOCKED');
  }
  if (response.status === 429) {
    throw new Error('RATE_LIMIT');
  }
  if (!response.ok) {
    throw new Error('REQUEST_FAILED');
  }

  const data = await response.json();
  if (!data || data.length === 0) return null;

  return {
    latitude: parseFloat(data[0].lat),
    longitude: parseFloat(data[0].lon),
    displayName: data[0].display_name,
  };
}
export async function saveBusinessLocations(
  businessId: string,
  locations: LocationFormData[] = [],
  replaceExisting = false
) {
  if (replaceExisting) {
    await db
      .delete(businessLocations)
      .where(eq(businessLocations.businessId, businessId));
  }

  for (const loc of locations) {
    const city = loc.city ?? null;
    const address = loc.address ?? null;
    let lat = loc.latitude ?? null;
    let lng = loc.longitude ?? null;

    if (!city) continue;

    if ((lat == null || lng == null) && city && address) {
      const coords = await checkAddress(city, address);
      if (coords) {
        lat = coords.latitude;
        lng = coords.longitude;
      }
    }

    // insert only if there is a city
    if (city) {
      await db.insert(businessLocations).values({
        businessId,
        city,
        address,
        latitude: lat,
        longitude: lng,
      });
    }
  }
}
