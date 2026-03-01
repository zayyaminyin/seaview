export interface OceanRegion {
  id: string;
  name: string;
  description: string;
  coordinates: { lat: number; lng: number };
  area: string;
  avgDepth: string;
  maxDepth: string;
  speciesCount: number;
  endangeredCount: number;
  color: string;
}

export const oceanRegions: OceanRegion[] = [
  {
    id: "pacific",
    name: "Pacific Ocean",
    description:
      "The world's largest and deepest ocean, spanning from the Arctic to the Antarctic. Contains the Mariana Trench and hosts immense marine biodiversity.",
    coordinates: { lat: 0, lng: -160 },
    area: "161.76 million km²",
    avgDepth: "4,080 m",
    maxDepth: "10,803 m",
    speciesCount: 22850,
    endangeredCount: 412,
    color: "#0ea5e9",
  },
  {
    id: "atlantic",
    name: "Atlantic Ocean",
    description:
      "The second-largest ocean, connecting the Americas with Europe and Africa. Critical for global climate regulation and transatlantic ecosystems.",
    coordinates: { lat: 0, lng: -30 },
    area: "85.13 million km²",
    avgDepth: "3,646 m",
    maxDepth: "8,486 m",
    speciesCount: 12420,
    endangeredCount: 287,
    color: "#0284c7",
  },
  {
    id: "indian",
    name: "Indian Ocean",
    description:
      "The third-largest ocean, bordered by Africa, Asia, and Australia. Contains unique monsoon-driven ecosystems and the Java Trench.",
    coordinates: { lat: -10, lng: 70 },
    area: "70.56 million km²",
    avgDepth: "3,741 m",
    maxDepth: "7,906 m",
    speciesCount: 11850,
    endangeredCount: 256,
    color: "#0369a1",
  },
  {
    id: "arctic",
    name: "Arctic Ocean",
    description:
      "The smallest and shallowest ocean, largely covered by sea ice. Home to polar bears, walruses, and unique cold-adapted species facing rapid climate change.",
    coordinates: { lat: 80, lng: 0 },
    area: "15.56 million km²",
    avgDepth: "1,205 m",
    maxDepth: "5,567 m",
    speciesCount: 3850,
    endangeredCount: 89,
    color: "#7dd3fc",
  },
  {
    id: "southern",
    name: "Southern Ocean",
    description:
      "Encircles Antarctica with the Antarctic Circumpolar Current. Critical for global ocean circulation and krill-based ecosystems.",
    coordinates: { lat: -65, lng: 0 },
    area: "21.96 million km²",
    avgDepth: "3,270 m",
    maxDepth: "7,075 m",
    speciesCount: 5420,
    endangeredCount: 134,
    color: "#38bdf8",
  },
  {
    id: "mediterranean",
    name: "Mediterranean Sea",
    description:
      "A semi-enclosed sea connecting to the Atlantic. High endemism with over 17,000 marine species, but facing significant pressure from pollution and overfishing.",
    coordinates: { lat: 35, lng: 15 },
    area: "2.5 million km²",
    avgDepth: "1,500 m",
    maxDepth: "5,267 m",
    speciesCount: 17200,
    endangeredCount: 198,
    color: "#0d9488",
  },
  {
    id: "caribbean",
    name: "Caribbean Sea",
    description:
      "Tropical sea with extensive coral reefs and mangrove ecosystems. Contains the Mesoamerican Barrier Reef and Cayman Trench.",
    coordinates: { lat: 15, lng: -75 },
    area: "2.75 million km²",
    avgDepth: "2,575 m",
    maxDepth: "7,686 m",
    speciesCount: 12400,
    endangeredCount: 167,
    color: "#14b8a6",
  },
  {
    id: "coral-triangle",
    name: "Coral Triangle",
    description:
      "Global epicenter of marine biodiversity with 76% of world's coral species and over 3,000 fish species. Spans Indonesia, Philippines, Malaysia, Papua New Guinea, Solomon Islands, and Timor-Leste.",
    coordinates: { lat: -2, lng: 125 },
    area: "6 million km²",
    avgDepth: "2,200 m",
    maxDepth: "7,440 m",
    speciesCount: 28500,
    endangeredCount: 423,
    color: "#059669",
  },
  {
    id: "red-sea",
    name: "Red Sea",
    description:
      "Narrow sea between Africa and Arabia with high salinity and unique coral reef ecosystems. One of the world's warmest seas.",
    coordinates: { lat: 22, lng: 38 },
    area: "438,000 km²",
    avgDepth: "490 m",
    maxDepth: "3,040 m",
    speciesCount: 1280,
    endangeredCount: 45,
    color: "#dc2626",
  },
  {
    id: "gulf-mexico",
    name: "Gulf of Mexico",
    description:
      "Large gulf bordered by the US, Mexico, and Cuba. Rich in oil reserves and marine life including sperm whales, sea turtles, and diverse fish populations.",
    coordinates: { lat: 24, lng: -92 },
    area: "1.55 million km²",
    avgDepth: "1,615 m",
    maxDepth: "4,384 m",
    speciesCount: 8450,
    endangeredCount: 112,
    color: "#0891b2",
  },
];
