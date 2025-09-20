import { UKRAINE_REGIONAL_CENTERS } from '@/const/regions';
import { BusinessWithCategoryName } from '@/types';

export function renderLocations(
  b: BusinessWithCategoryName,
  selectedCity: string
) {
  const selectedCityLabel =
    selectedCity === '__all__'
      ? '__all__'
      : UKRAINE_REGIONAL_CENTERS.find((c) => c.value === selectedCity)?.label;
  // 1. city = "__all__"
  if (selectedCityLabel === '__all__') {
    if (b.isOnline && b.locations.length > 0) {
      console.log('object', b.locations);
      return (
        <>
          <p>ONLINE</p>
          <ul>
            {b.locations
              .slice() // not to mutate original array
              .sort((a, b) => a.city.localeCompare(b.city, 'uk'))
              .map((loc, idx) => (
                <li key={idx}>
                  {loc.city} — {loc.address?.trim() || 'не додано'}
                </li>
              ))}
          </ul>
        </>
      );
    }
    if (b.isOnline && b.locations.length === 0) {
      return <p>ONLINE</p>;
    }
    if (!b.isOnline && b.locations.length > 0) {
      return (
        <ul>
          {b.locations
            .slice() // not to mutate original array
            .sort((a, b) => a.city.localeCompare(b.city, 'uk'))
            .map((loc, idx) => (
              <li key={idx}>
                {loc.city} — {loc.address?.trim() || 'не додано'}
              </li>
            ))}
        </ul>
      );
    }
    // !b.isOnline && no locations → not in the list
    return null;
  }

  // 2.city != "__all__"  we filter by specific city
  const cityLocations = b.locations.filter(
    (loc) => loc.city === selectedCityLabel
  );

  if (cityLocations.length > 0) {
    return (
      <>
        <p>{selectedCityLabel}</p>
        <ul>
          {cityLocations.length ? (
            cityLocations.map((loc, idx) => (
              <li key={idx}>{loc.address?.trim() || 'не додано'}</li>
            ))
          ) : (
            <li>Немає адрес</li>
          )}
        </ul>
      </>
    );
  }

  if (b.isOnline) {
    return <p>ONLINE</p>;
  }

  // if no address in this city and not online → not in the list
  return null;
}
