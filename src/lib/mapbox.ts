export const MAPBOX_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export const defaultMapStyle = "mapbox://styles/mapbox/dark-v11";

export const oceanStyles = {
  dark: "mapbox://styles/mapbox/dark-v11",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
  outdoors: "mapbox://styles/mapbox/outdoors-v12",
  light: "mapbox://styles/mapbox/light-v11",
} as const;

export const defaultCenter: [number, number] = [0, 20]; // lng, lat
export const defaultZoom = 2;

export const speciesMarkerColor = "#14b8a6"; // teal
export const regionFillColor = "#0d9488";
export const regionFillOpacity = 0.2;
