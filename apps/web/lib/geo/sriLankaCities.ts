/**
 * A stylized, schematic outline of Sri Lanka in the site's blueprint-line
 * aesthetic — deliberately not a surveyed/GPS-accurate map. City coordinates
 * are approximate relative placements on that same illustrative viewBox, good
 * enough for a decorative/interactive pin map, not for navigation.
 */
export const MAP_WIDTH = 300;
export const MAP_HEIGHT = 600;
export const MAP_VIEW_BOX = `0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`;

export const ISLAND_PATH =
  "M150,20 C220,20 260,90 255,160 C250,230 270,280 260,340 C250,400 230,440 200,480 " +
  "C180,510 165,540 150,580 C135,540 120,510 100,480 C70,440 50,400 40,340 " +
  "C30,280 50,230 45,160 C40,90 80,20 150,20 Z";

interface CityPoint {
  x: number;
  y: number;
  label: string;
}

const CITY_COORDS: Record<string, CityPoint> = {
  jaffna: { x: 150, y: 45, label: "Jaffna" },
  trincomalee: { x: 215, y: 180, label: "Trincomalee" },
  anuradhapura: { x: 140, y: 145, label: "Anuradhapura" },
  negombo: { x: 68, y: 305, label: "Negombo" },
  colombo: { x: 65, y: 340, label: "Colombo" },
  nugegoda: { x: 75, y: 350, label: "Nugegoda" },
  kandy: { x: 150, y: 330, label: "Kandy" },
  "nuwara eliya": { x: 155, y: 380, label: "Nuwara Eliya" },
  batticaloa: { x: 228, y: 380, label: "Batticaloa" },
  galle: { x: 110, y: 540, label: "Galle" },
  matara: { x: 140, y: 555, label: "Matara" },
};

/**
 * Resolves a free-text project `location` string (e.g. "Nugegoda, Colombo",
 * "Colombo 03") to a pin position. Tries the full string, then each
 * comma-separated segment, then falls back to substring matching against
 * known city names (longest name first, so "nuwara eliya" wins over any
 * shorter partial match). Returns undefined if nothing matches — callers
 * should skip the pin rather than guess.
 */
export function resolveCityForLocation(location: string): CityPoint | undefined {
  const normalized = location.toLowerCase().trim();
  if (CITY_COORDS[normalized]) return CITY_COORDS[normalized];

  const segments = normalized.split(",").map((segment) => segment.trim());
  for (const segment of segments) {
    if (CITY_COORDS[segment]) return CITY_COORDS[segment];
  }

  const knownCities = Object.keys(CITY_COORDS).sort((a, b) => b.length - a.length);
  for (const city of knownCities) {
    if (normalized.includes(city)) return CITY_COORDS[city];
  }

  return undefined;
}
