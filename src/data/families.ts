export const FAMILIES = [
  { id: "citrus", name: "Citrus" },
  { id: "stone", name: "Stone fruit" },
  { id: "berries", name: "Berries" },
  { id: "exotics", name: "Exotics" },
  { id: "melons", name: "Melons & grapes" },
  { id: "veg", name: "Vegetables" },
] as const;

export const FAMILY_IDS = FAMILIES.map((family) => family.id) as [
  (typeof FAMILIES)[number]["id"],
  ...(typeof FAMILIES)[number]["id"][],
];

export type FamilyId = (typeof FAMILIES)[number]["id"];

export const FROZEN_FAMILY = { id: "frozen", name: "Frozen fruit" } as const;

export const REGIONS = [
  "Middle East",
  "Asia",
  "European Union",
  "United Kingdom",
] as const;
