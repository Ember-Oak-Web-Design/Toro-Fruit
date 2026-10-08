import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import { FAMILY_IDS } from "./data/families.ts";

const products = defineCollection({
  loader: file("src/content/products.json"),
  schema: z.object({
    name: z.string(),
    family: z.enum(FAMILY_IDS),
    /** Key of the cut-out in `src/assets/fruit/`, without the extension. */
    image: z.string(),
    /** Months the product is available, 1 (January) to 12 (December). */
    months: z.array(z.number().int().min(1).max(12)).min(1),
    description: z.string(),
    /** Position in the list, following the client's product calendar. */
    order: z.number().int(),
  }),
});

const frozen = defineCollection({
  loader: file("src/content/frozen.json"),
  schema: z.object({
    name: z.string(),
    pack: z.string(),
    order: z.number().int(),
  }),
});

/** Long-form copy the client supplies. A `draft` entry stays off the site. */
const story = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/story" }),
  schema: z.object({
    draft: z.boolean().default(true),
    heading: z.string(),
  }),
});

export const collections = { products, frozen, story };
