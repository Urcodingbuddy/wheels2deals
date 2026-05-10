import type { Tables } from "@/types/database";

type Car = Tables<"cars">;
type SearchableCar = Pick<Car, "brand" | "model" | "title" | "location">;

export const KNOWN_BRANDS = [
  "Abarth",
  "Acura",
  "Alfa Romeo",
  "Alpina",
  "AMG",
  "Arcfox",
  "Aston Martin",
  "Audi",
  "Avatr",
  "BAIC",
  "Baojun",
  "Benelli",
  "Bentley",
  "Bertone",
  "Bestune",
  "BMW",
  "Borgward",
  "Brilliance",
  "Bugatti",
  "Buick",
  "BYD",
  "Cadillac",
  "Chevrolet",
  "Chrysler",
  "Citroen",
  "Corvette",
  "Cupra",
  "Dacia",
  "Daewoo",
  "Datsun",
  "DFSK",
  "Dodge",
  "Dongfeng",
  "DS Automobiles",
  "Ducati",
  "Exeed",
  "FAW",
  "Ferrari",
  "Fiat",
  "Ford",
  "Foton",
  "GAC",
  "GAC Motors",
  "Geely",
  "Genesis",
  "Gillet",
  "GMC",
  "Great Wall",
  "Great Wall GWM",
  "GWM",
  "Haval",
  "Honda",
  "Hongqi",
  "Hummer",
  "Hyundai",
  "Infiniti",
  "Isuzu",
  "JAC",
  "Jaguar",
  "Jeep",
  "Jetour",
  "Kia",
  "Koenigsegg",
  "KTM",
  "Lamborghini",
  "Lancia",
  "Land Rover",
  "Lexus",
  "Lincoln",
  "Lotus",
  "Luxgen",
  "Maserati",
  "Maxus",
  "Mazda",
  "McLaren",
  "Mercedes Benz",
  "MG",
  "Mini",
  "Mitsubishi",
  "Mustang",
  "NIO",
  "Nissan",
  "Opel",
  "Ora",
  "Polestar",
  "Pontiac",
  "Porsche",
  "Qoros",
  "Renault",
  "Rivian",
  "Roewe",
  "Rolls-Royce",
  "Saab",
  "SAIC",
  "Seat",
  "Soueast",
  "Subaru",
  "Suzuki",
  "Tata",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Volvo",
  "W Motors",
  "Wuling",
  "Xpeng",
] as const;

const BRAND_ALIASES: Record<string, string[]> = {
  landrover: ["land rover"],
  landroverrange: ["land rover range rover", "range rover"],
  mercedesbenz: ["mercedes benz", "mercedes-benz"],
  rollsroyce: ["rolls royce"],
  astonmartin: ["aston martin"],
  alfaromeo: ["alfa romeo"],
  dsautomobiles: ["ds automobiles"],
  gacmotors: ["gac motors", "gac"],
  greatwall: ["great wall", "gwm", "great wall gwm"],
  wmotors: ["w motors"],
};

export function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[,%]/g, " ")
    .replace(/[-_/]+/g, " ")
    .replace(/\s+/g, " ");
}

export function compactSearchText(value: string) {
  return normalizeSearchText(value).replace(/\s+/g, "");
}

export function getSearchVariants(value: string) {
  const normalized = normalizeSearchText(value);
  const compact = compactSearchText(value);
  const aliasMatches = [
    ...(BRAND_ALIASES[compact] ?? []),
    ...KNOWN_BRANDS.filter((brand) => compactSearchText(brand).includes(compact)),
  ];

  return [...new Set([normalized, compact, ...aliasMatches])].filter(Boolean);
}

export function matchesCarSearch(car: SearchableCar, query: string) {
  const variants = getSearchVariants(query);
  if (variants.length === 0) return true;

  const searchFields = [car.title, car.brand, car.model, car.location];
  const normalizedFields = searchFields.map(normalizeSearchText);
  const compactFields = searchFields.map(compactSearchText);

  return variants.some((variant) => {
    const compactVariant = compactSearchText(variant);

    return normalizedFields.some((field) => field.includes(variant)) ||
      compactFields.some((field) => field.includes(compactVariant));
  });
}

export function getCarSuggestions(cars: SearchableCar[], query: string) {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const ranked = new Map<
    string,
    { label: string; type: "brand" | "model" | "title"; score: number }
  >();

  for (const car of cars) {
    const candidates = [
      { label: car.brand, type: "brand" as const },
      { label: car.model, type: "model" as const },
      { label: car.title, type: "title" as const },
    ];

    for (const candidate of candidates) {
      if (!matchesLabel(candidate.label, trimmed)) {
        continue;
      }

      const key = `${candidate.type}:${candidate.label.toLowerCase()}`;
      const score = scoreSuggestion(candidate.label, trimmed, candidate.type);
      const existing = ranked.get(key);

      if (!existing || score < existing.score) {
        ranked.set(key, { ...candidate, score });
      }
    }
  }

  return [...ranked.values()]
    .sort((left, right) => left.score - right.score || left.label.localeCompare(right.label))
    .slice(0, 8)
    .map((item) => ({ label: item.label, type: item.type }));
}

function matchesLabel(label: string, query: string) {
  const variants = getSearchVariants(query);
  const normalizedLabel = normalizeSearchText(label);
  const compactLabel = compactSearchText(label);

  return variants.some((variant) => {
    const compactVariant = compactSearchText(variant);

    return (
      normalizedLabel.includes(variant) ||
      compactLabel.includes(compactVariant)
    );
  });
}

function scoreSuggestion(
  label: string,
  query: string,
  type: "brand" | "model" | "title",
) {
  const normalizedLabel = normalizeSearchText(label);
  const normalizedQuery = normalizeSearchText(query);
  const compactLabel = compactSearchText(label);
  const compactQuery = compactSearchText(query);

  let score = type === "brand" ? 0 : type === "model" ? 10 : 20;

  if (normalizedLabel === normalizedQuery || compactLabel === compactQuery) {
    score -= 10;
  } else if (
    normalizedLabel.startsWith(normalizedQuery) ||
    compactLabel.startsWith(compactQuery)
  ) {
    score -= 5;
  }

  score += normalizedLabel.length / 100;

  return score;
}
