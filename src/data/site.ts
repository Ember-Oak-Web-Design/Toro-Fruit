import type { ImageMetadata } from "astro";
import apac from "@/assets/logo/apac.png";
import fpef from "@/assets/logo/fpef.png";
import globalgap from "@/assets/logo/globalgap.jpg";
import sizaSedex from "@/assets/logo/siza-sedex.jpg";

type Logo = {
  name: string;
  logo: ImageMetadata;
  alt: string;
  detail: string;
  /** Logo width in rem. */
  width: number;
};

/** Industry affiliations. Add an entry here to show another logo. */
export const AFFILIATIONS: Logo[] = [
  {
    name: "APAC",
    logo: apac,
    alt: "APAC, Agricultural Produce Agents Council",
    detail: "Industry affiliation.",
    width: 8.5,
  },
  {
    name: "FPEF South Africa",
    logo: fpef,
    alt: "FPEF South Africa, Fresh Produce Exporters' Forum",
    detail: "Industry affiliation.",
    width: 10,
  },
];

export const CERTIFICATIONS: Logo[] = [
  {
    name: "GlobalG.A.P.",
    logo: globalgap,
    alt: "GlobalG.A.P.",
    detail: "All our produce comes from GlobalG.A.P.-certified growers.",
    width: 6,
  },
  {
    name: "SIZA & SEDEX",
    logo: sizaSedex,
    alt: "SIZA and SEDEX",
    detail:
      "Held by most of our growers, who also follow national ethical trading standards.",
    width: 18,
  },
];

export const MARKETS = [
  { name: "Middle East", detail: "GCC and the wider region" },
  { name: "Asia", detail: "China & Southeast Asia" },
  { name: "European Union", detail: "Importers & retailers" },
  { name: "United Kingdom", detail: "Importers & retailers" },
] as const;
