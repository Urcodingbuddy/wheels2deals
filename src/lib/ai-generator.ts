import { Constants } from "@/types/database";

const { car_category } = Constants.public.Enums;

interface CarDetails {
  brand: string;
  model: string;
  year: number;
  type: string;
  category?: string;
  transmission: string;
  fuel_type: string;
  km_driven: number;
  color?: string;
  location: string;
  owners_count?: number;
}

export function generateCarDescription(details: CarDetails): string {
  const {
    brand,
    model,
    year,
    type,
    category,
    transmission,
    fuel_type,
    km_driven,
    color,
    location,
    owners_count,
  } = details;

  const name = `${year} ${brand} ${model}`;
  const kmFormatted = new Intl.NumberFormat().format(km_driven);

  // Intro variations based on category
  let intro = `Experience the perfect blend of style and performance with this pristine ${name}.`;
  
  if (category === "luxury") {
    intro = `Indulge in unparalleled luxury and sophistication with this magnificent ${name}. A true statement of elegance on the road.`;
  } else if (category === "sports" || category === "exotic") {
    intro = `Unleash pure adrenaline and precision engineering with this breathtaking ${name}. Built for those who demand ultimate performance.`;
  } else if (category === "suv") {
    intro = `Command the road with confidence in this powerful and versatile ${name}. The perfect companion for both urban adventures and off-road excellence.`;
  } else if (category === "economy") {
    intro = `Discover the ideal balance of efficiency, reliability, and modern comfort with this well-maintained ${name}.`;
  }

  // Details section
  const colorPart = color ? ` Finished in a stunning ${color} exterior,` : "";
  const ownerPart = owners_count && owners_count === 1 ? " This vehicle has been loved by a single owner," : "";
  
  const specs = `${colorPart}${ownerPart} this ${type} comes equipped with a smooth ${transmission} transmission and a responsive ${fuel_type} engine. With only ${kmFormatted} KM on the clock, it remains in exceptional condition.`;

  // Closing
  const closing = ` Currently located in ${location}, this ${brand} is ready for its next owner. Contact us today to schedule a viewing or for more information on this exceptional vehicle.`;

  return `${intro}\n\n${specs}\n\n${closing}`;
}
