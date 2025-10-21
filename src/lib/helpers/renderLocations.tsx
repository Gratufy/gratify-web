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
      return (
        <>
          <ul className="space-y-4">
            {b.locations
              .slice() // not to mutate original array
              .sort((a, b) => a.city.localeCompare(b.city, 'uk'))
              .map((loc, idx) => (
                <li key={idx}>
                  <address className="not-italic">
                    <span className="title-h6">
                      м. {loc.city}, {loc.address?.trim() || 'не додано'}{' '}
                    </span>
                  </address>
                </li>
              ))}
          </ul>
        </>
      );
    }
    if (b.isOnline && b.locations.length === 0) {
      return (
        <div>
          <p className="placeholder-sm text-center">Бізнес працює онлайн</p>
          {b.website && (
            <a
              href={
                b.website.startsWith('http')
                  ? b.website
                  : `https://${b.website}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="link-big mx-auto block text-center"
            >
              дивіться вебсайт
            </a>
          )}
        </div>
      );
    }
    if (!b.isOnline && b.locations.length > 0) {
      return (
        <ul className="space-y-4">
          {b.locations
            .slice() // not to mutate original array
            .sort((a, b) => a.city.localeCompare(b.city, 'uk'))
            .map((loc, idx) => (
              <li key={idx}>
                <address className="not-italic">
                  <span className="title-h6">
                    м. {loc.city}, {loc.address?.trim() || 'не додано'}{' '}
                  </span>
                </address>
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
        <p className="title-h6 mb-1">м. {selectedCityLabel}</p>

        {cityLocations.length ? (
          <ul className="space-y-4">
            {cityLocations.map((loc, idx) => (
              <li key={idx}>
                <address className="not-italic">
                  <span className="title-h6">
                    {loc.address?.trim() || 'не додано'}
                  </span>
                </address>
              </li>
            ))}
          </ul>
        ) : (
          <p className="placeholder-xs text-center">Адреса не додана</p>
        )}
      </>
    );
  }

  if (b.isOnline) {
    return (
      <div>
        <p className="placeholder-sm text-center">Бізнес працює онлайн</p>
        {b.website && (
          <a
            href={
              b.website.startsWith('http') ? b.website : `https://${b.website}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="link-big mx-auto block text-center"
          >
            дивіться вебсайт
          </a>
        )}
      </div>
    );
  }

  // if no address in this city and not online → not in the list
  return null;
}
