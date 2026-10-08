/** Site name. Appended to every page title and used as `og:site_name`. */
export const SITE_NAME = "Toro Fruit";
/** Fallback meta description for pages that don't set their own. */
export const SITE_DESCRIPTION =
  "Toro Fruit is a South African exporter of fresh and frozen fruit, supplying importers, wholesalers and retailers in the Middle East, Asia, the EU and the UK from GlobalG.A.P.-certified growers.";
/** Canonical origin. Resolves canonical URLs, social images, and the sitemap. */
export const SITE_URL = "https://torofruit.com";
/** BCP 47 locale tag used to format dates and numbers. */
export const SITE_LOCALE = "en-ZA";
/** Public contact address shown on the site. */
export const CONTACT_EMAIL = "info@torofruit.com";
/** Routes excluded from search and the sitemap. Surrounding slashes are ignored. */
export const NOINDEX_ROUTES: string[] = ["/404", "/privacy-policy"];
