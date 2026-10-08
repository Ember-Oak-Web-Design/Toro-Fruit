import type { ImageMetadata } from "astro";

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/fruit/*.png",
  { eager: true },
);

/** Resolves a product's cut-out from the key stored in its data. */
export function fruitImage(key: string): ImageMetadata {
  const match = images[`/src/assets/fruit/${key}.png`];
  if (!match) throw new Error(`No fruit image found for "${key}".`);
  return match.default;
}

/** Sorts collection entries by their `order` field. */
export const byOrder = <T extends { data: { order: number } }>(a: T, b: T) =>
  a.data.order - b.data.order;

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const MONTH_SHORT = MONTH_NAMES.map((name) => name.slice(0, 3));

/** The run of months a product is available, as short and long labels. */
export function seasonLabel(months: number[]) {
  if (months.length === 12) return { short: "All year", long: "All year" };
  const set = new Set(months);
  const start = months.find((m) => !set.has(m === 1 ? 12 : m - 1)) ?? months[0];
  let end = start;
  while (set.has(end === 12 ? 1 : end + 1)) end = end === 12 ? 1 : end + 1;
  if (start === end) {
    return { short: MONTH_SHORT[start - 1], long: MONTH_NAMES[start - 1] };
  }
  return {
    short: `${MONTH_SHORT[start - 1]}–${MONTH_SHORT[end - 1]}`,
    long: `${MONTH_NAMES[start - 1]} to ${MONTH_NAMES[end - 1]}`,
  };
}
