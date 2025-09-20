import { BusinessWithCategoryName } from '@/types';

export function renderLocations(
  b: BusinessWithCategoryName,
  selectedCity: string
) {
  // 1. city = "__all__"
  if (selectedCity === '__all__') {
    if (b.isOnline && b.locations.length > 0) {
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
  const cityLocations = b.locations.filter((loc) => loc.city === selectedCity);

  if (cityLocations.length > 0) {
    return (
      <>
        <p>{selectedCity}</p>
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
