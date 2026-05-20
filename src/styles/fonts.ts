// src/theme/typography.ts
import {
  Archivo,
  Archivo_Black,
  Bebas_Neue,
  DM_Sans,
  DM_Serif_Display,
  Inter,
  Lora,
  Merriweather,
  Montserrat,
  Nunito_Sans,
  Open_Sans,
  Oswald,
  Playfair_Display,
  Poppins,
  Roboto,
  Roboto_Flex,
  Roboto_Slab,
  Source_Sans_3,
  Space_Grotesk,
  Work_Sans,
} from "next/font/google";

export type TypographyKey =
  | "spaceGrotesk_inter"
  | "poppins_sourceSans3"
  | "montserrat_roboto"
  | "oswald_nunitoSans"
  | "bebasNeue_workSans"
  | "dmSerifDisplay_dmSans"
  | "playfairDisplay_lora"
  | "merriweather_openSans"
  | "archivoBlack_archivo"
  | "robotoSlab_robotoFlex"
  | "microgramma_inter";

/**
 * Switch this ONE key to change your whole site's heading/body fonts.
 */
export const ACTIVE_TYPOGRAPHY: TypographyKey = "microgramma_inter";

export type Pack = {
  label: string;
  className: string; // apply this to a wrapper element
};

/**
 * Font "atoms" (each one sets either --font-heading or --font-body).
 * Pattern:
 *   const heading = Space_Grotesk({ ..., variable: "--font-heading" })
 *   const body    = Inter({ ..., variable: "--font-body" })
 *
 * Then a pair becomes:
 *   className: `${heading.variable} ${body.variable}`
 */

// Pair 1: Space Grotesk / Inter
const heading_spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});
const body_inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

// Pair 2: Poppins / Source Sans 3
const heading_poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});
const body_sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

// Pair 3: Montserrat / Roboto
const heading_montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});
const body_roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700"],
  variable: "--font-body",
});

// Pair 4: Oswald / Nunito Sans
const heading_oswald = Oswald({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});
const body_nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

// Pair 5: Bebas Neue / Work Sans
const heading_bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--font-heading",
});
const body_workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

// Pair 6: DM Serif Display / DM Sans
const heading_dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--font-heading",
});
const body_dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

// Pair 7: Playfair Display / Lora
const heading_playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});
const body_lora = Lora({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

// Pair 8: Merriweather / Open Sans
const heading_merriweather = Merriweather({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700", "900"],
  variable: "--font-heading",
});
const body_openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

// Pair 9: Archivo Black / Archivo
const heading_archivoBlack = Archivo_Black({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--font-heading",
});
const body_archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

// Pair 10: Roboto Slab / Roboto Flex
const heading_robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});
const body_robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

type Pair = {
  label: string;
  heading?: { variable: string };
  body: { variable: string };
};

const PAIRS: Record<TypographyKey, Pair> = {
  microgramma_inter: {
    label: "Microgramma D / Inter",
    body: body_inter,
  },
  spaceGrotesk_inter: {
    label: "Space Grotesk / Inter",
    heading: heading_spaceGrotesk,
    body: body_inter,
  },
  poppins_sourceSans3: {
    label: "Poppins / Source Sans 3",
    heading: heading_poppins,
    body: body_sourceSans3,
  },
  montserrat_roboto: {
    label: "Montserrat / Roboto",
    heading: heading_montserrat,
    body: body_roboto,
  },
  oswald_nunitoSans: {
    label: "Oswald / Nunito Sans",
    heading: heading_oswald,
    body: body_nunitoSans,
  },
  bebasNeue_workSans: {
    label: "Bebas Neue / Work Sans",
    heading: heading_bebasNeue,
    body: body_workSans,
  },
  dmSerifDisplay_dmSans: {
    label: "DM Serif Display / DM Sans",
    heading: heading_dmSerifDisplay,
    body: body_dmSans,
  },
  playfairDisplay_lora: {
    label: "Playfair Display / Lora",
    heading: heading_playfairDisplay,
    body: body_lora,
  },
  merriweather_openSans: {
    label: "Merriweather / Open Sans",
    heading: heading_merriweather,
    body: body_openSans,
  },
  archivoBlack_archivo: {
    label: "Archivo Black / Archivo",
    heading: heading_archivoBlack,
    body: body_archivo,
  },
  robotoSlab_robotoFlex: {
    label: "Roboto Slab / Roboto Flex",
    heading: heading_robotoSlab,
    body: body_robotoFlex,
  },
};

function pack(pair: Pair): Pack {
  return {
    label: pair.label,
    className: [pair.heading?.variable, pair.body.variable]
      .filter(Boolean)
      .join(" "),
  };
}

export const TYPOGRAPHY: Record<TypographyKey, Pack> = Object.fromEntries(
  (Object.keys(PAIRS) as TypographyKey[]).map((key) => [key, pack(PAIRS[key])])
) as Record<TypographyKey, Pack>;

export function getTypography(key: TypographyKey): Pack {
  return TYPOGRAPHY[key];
}

export function getActiveTypography(): Pack {
  return TYPOGRAPHY[ACTIVE_TYPOGRAPHY];
}

export function getActiveTypographyClassName(): string {
  return TYPOGRAPHY[ACTIVE_TYPOGRAPHY].className;
}
