export type ConservationStatus = "LC" | "NT" | "VU" | "EN" | "CR" | "EW" | "EX";
export type SpeciesType = "mammal" | "fish" | "invertebrate" | "plant" | "coral" | "reptile";
export type PopulationTrend = "increasing" | "stable" | "decreasing" | "unknown";

export interface SpeciesImage {
  url: string;
  alt: string;
  credit: string;
}

export interface Species {
  slug: string;
  commonName: string;
  scientificName: string;
  scientificTaxonId: string;
  type: SpeciesType;
  conservationStatus: ConservationStatus;
  populationTrend: PopulationTrend;
  description: string;
  habitat: string;
  diet: string;
  lifespan: string;
  weight: string;
  length: string;
  threats: string[];
  funFacts: string[];
  images: SpeciesImage[];
  populationData: { year: number; estimate: number }[];
  oceanRegions: string[];
  coordinates: { lat: number; lng: number };
  wikipediaSlug: string;
  iucnUrl: string;
  gbifUrl: string;
  obisUrl: string;
  estimatedPopulation: string;
  sketchfabId?: string;
  anatomy?: { label: string; description: string }[];
}

export const conservationStatusInfo: Record<
  ConservationStatus,
  { label: string; color: string; bgColor: string; description: string }
> = {
  LC: {
    label: "Least Concern",
    color: "#15803d",
    bgColor: "#dcfce7",
    description: "Does not qualify for a more at risk category. Widespread and abundant.",
  },
  NT: {
    label: "Near Threatened",
    color: "#65a30d",
    bgColor: "#ecfccb",
    description: "Close to qualifying for or likely to qualify for a threatened category.",
  },
  VU: {
    label: "Vulnerable",
    color: "#ca8a04",
    bgColor: "#fef9c3",
    description: "Facing a high risk of extinction in the wild.",
  },
  EN: {
    label: "Endangered",
    color: "#ea580c",
    bgColor: "#ffedd5",
    description: "Facing a very high risk of extinction in the wild.",
  },
  CR: {
    label: "Critically Endangered",
    color: "#dc2626",
    bgColor: "#fee2e2",
    description: "Facing an extremely high risk of extinction in the wild.",
  },
  EW: {
    label: "Extinct in the Wild",
    color: "#7c3aed",
    bgColor: "#ede9fe",
    description: "Known only to survive in captivity or as a naturalized population outside its range.",
  },
  EX: {
    label: "Extinct",
    color: "#374151",
    bgColor: "#f3f4f6",
    description: "No known individuals remaining.",
  },
};

// Seeded random for deterministic but varied population curves per species
function seededRandom(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// Generate realistic population data with noise, oscillation, and occasional dips/recoveries
function generatePopulationData(
  base: number,
  trend: PopulationTrend,
  seed: number
): { year: number; estimate: number }[] {
  if (base === 0) {
    return Array.from({ length: 25 }, (_, i) => ({ year: 2000 + i, estimate: 0 }));
  }

  const rng = seededRandom(seed);
  const points: { year: number; estimate: number }[] = [];
  const numYears = 25;

  for (let i = 0; i < numYears; i++) {
    const year = 2000 + i;
    const t = i / (numYears - 1); // 0 to 1 over 2000-2024

    // 1. Base trend (overall direction preserved)
    let trendMult = 1;
    if (trend === "increasing") trendMult = 1 + t * 0.35;
    else if (trend === "decreasing") trendMult = 1 - t * 0.45;
    else if (trend === "stable") trendMult = 1;
    else trendMult = 0.98 + (i % 5) * 0.005;

    // 2. Natural oscillation (multi-year sine wave, ~7-year cycle)
    const cycleYears = 6 + (seed % 3);
    const oscillation = Math.sin((2 * Math.PI * i) / cycleYears) * (0.06 + (seed % 5) / 100);

    // 3. Random noise (±5-15% year-to-year variation)
    const noiseScale = 0.05 + (rng() * 0.1);
    const noise = (rng() * 2 - 1) * noiseScale;

    // 4. Occasional dips (increasing) or recoveries (decreasing)
    let eventEffect = 0;
    if (trend === "increasing" && (seed + i * 7) % 11 === 0) eventEffect = -0.08 - rng() * 0.07;
    if (trend === "decreasing" && (seed + i * 13) % 17 === 0) eventEffect = 0.06 + rng() * 0.06;

    let mult = trendMult + oscillation + noise + eventEffect;
    mult = Math.max(0.15, Math.min(1.5, mult));

    const estimate = Math.max(Math.round(base * mult), 1);
    points.push({ year, estimate });
  }

  return points;
}

export const species: Species[] = [
  {
    slug: "blue-whale",
    commonName: "Blue Whale",
    scientificName: "Balaenoptera musculus",
    scientificTaxonId: "2440735",
    type: "mammal",
    conservationStatus: "EN",
    populationTrend: "increasing",
    description:
      "The blue whale is the largest animal ever known to have existed on Earth, reaching lengths of up to 100 feet and weights of 200 tons. These magnificent marine mammals are baleen whales, filtering tiny krill through their massive plates. Their low-frequency calls can travel hundreds of miles underwater, making them the loudest animals on the planet.",
    habitat:
      "Blue whales inhabit all of the world's oceans except the Arctic, migrating between cold feeding grounds in polar waters and warmer breeding grounds in tropical and subtropical waters.",
    diet: "Primarily krill (tiny shrimp-like crustaceans), consuming up to 4 tons per day during feeding season.",
    lifespan: "80–90 years",
    weight: "Up to 200 tons (181,000 kg)",
    length: "80–100 feet (24–30 m)",
    threats: ["Ship strikes", "Entanglement in fishing gear", "Ocean noise pollution", "Climate change affecting krill populations"],
    funFacts: [
      "A blue whale's heart is the size of a small car and weighs about 400 pounds.",
      "Their tongue alone can weigh as much as an elephant.",
      "Blue whale calves gain 200 pounds per day during their first year.",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Anim1754_-_Flickr_-_NOAA_Photo_Library.jpg/640px-Anim1754_-_Flickr_-_NOAA_Photo_Library.jpg",
        alt: "Blue whale swimming in deep ocean",
        credit: "NOAA Photo Library / Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(5000, "increasing", 5001),
    oceanRegions: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Southern Ocean"],
    coordinates: { lat: -35.5, lng: -72.5 },
    wikipediaSlug: "Blue_whale",
    iucnUrl: "https://www.iucnredlist.org/species/2477/A2abd",
    gbifUrl: "https://www.gbif.org/species/2440735",
    obisUrl: "https://obis.org/taxon/137090",
    estimatedPopulation: "10,000–25,000",
    sketchfabId: "d24d19021c724c3a9134eebcb76b0e0f",
    anatomy: [
      { label: "Baleen Plates", description: "300-400 fringed plates that filter krill from seawater" },
      { label: "Blowhole", description: "Paired nostrils on top of the head for breathing at the surface" },
      { label: "Dorsal Fin", description: "Small, triangular fin located on the lower third of the back" },
      { label: "Fluke", description: "Horizontally-oriented tail fin used for propulsion, unique markings per individual" },
      { label: "Pectoral Fins", description: "Short, paddle-shaped flippers for steering and stabilization" },
      { label: "Ventral Pleats", description: "55–88 expandable throat grooves that allow enormous gulps of water" },
    ],
  },
  {
    slug: "humpback-whale",
    commonName: "Humpback Whale",
    scientificName: "Megaptera novaeangliae",
    scientificTaxonId: "2440694",
    type: "mammal",
    conservationStatus: "LC",
    populationTrend: "increasing",
    description:
      "Humpback whales are known for their spectacular breaching behavior, complex songs, and extraordinarily long migrations. These acrobatic giants travel up to 5,000 miles between feeding and breeding grounds. Male humpbacks are famous for their haunting, ever-evolving songs that can last up to 20 minutes.",
    habitat:
      "Found in all major oceans, humpbacks migrate from polar feeding grounds to tropical breeding waters. They frequent coastal areas and are commonly seen in Hawaii, Alaska, and the Caribbean.",
    diet: "Krill, small fish, and plankton; they use bubble-net feeding to corral prey.",
    lifespan: "45–50 years",
    weight: "25–40 tons (23,000–36,000 kg)",
    length: "39–52 feet (12–16 m)",
    threats: ["Entanglement in fishing gear", "Ship strikes", "Climate change", "Underwater noise"],
    funFacts: [
      "Humpback whale songs are among the most complex in the animal kingdom and evolve each season.",
      "They have the longest migration of any mammal—some travel 5,000 miles twice yearly.",
      "Their flippers can be up to 16 feet long, the longest of any whale.",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Humpback_Whale_underwater_shot.jpg/640px-Humpback_Whale_underwater_shot.jpg",
        alt: "Humpback whale breaching",
        credit: "Whit Welles / Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(80000, "increasing", 80001),
    oceanRegions: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Southern Ocean", "Caribbean Sea"],
    coordinates: { lat: 21.3, lng: -157.8 },
    wikipediaSlug: "Humpback_whale",
    iucnUrl: "https://www.iucnredlist.org/species/13006/A2abd",
    gbifUrl: "https://www.gbif.org/species/2440694",
    obisUrl: "https://obis.org/taxon/137092",
    estimatedPopulation: "80,000–90,000",
    sketchfabId: "a1c998d4ef3f4c3ab149a9e7f55081bf",
    anatomy: [
      { label: "Tubercles", description: "Knob-like hair follicles on head and lower jaw, unique among whales" },
      { label: "Pectoral Fins", description: "Longest of any cetacean — up to 5m; used for maneuverability" },
      { label: "Ventral Grooves", description: "14–22 expandable throat pleats for lunge-feeding" },
      { label: "Fluke", description: "Broad tail with unique black-and-white patterns used for ID" },
    ],
  },
  {
    slug: "vaquita",
    commonName: "Vaquita",
    scientificName: "Phocoena sinus",
    scientificTaxonId: "2440756",
    type: "mammal",
    conservationStatus: "CR",
    populationTrend: "decreasing",
    description:
      "The vaquita is the world's most endangered marine mammal, with fewer than 10 individuals remaining. This small porpoise is found only in the northern Gulf of California, Mexico. Shy and elusive, vaquitas are rarely seen and have the smallest geographic range of any marine mammal.",
    habitat:
      "Exclusively in the shallow, murky waters of the northern Gulf of California (Sea of Cortez), Mexico, typically in waters 11–50 meters deep.",
    diet: "Small fish, squid, and crustaceans; they feed near the seafloor.",
    lifespan: "Up to 21 years",
    weight: "65–120 lbs (30–55 kg)",
    length: "4–5 feet (1.2–1.5 m)",
    threats: ["Bycatch in gillnets (primary threat)", "Illegal totoaba fishing", "Habitat degradation", "Inbreeding due to small population"],
    funFacts: [
      "Vaquita means 'little cow' in Spanish.",
      "They have distinctive dark rings around their eyes and dark lip patches.",
      "They are the smallest of all cetaceans (whales, dolphins, porpoises).",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Vaquita_size.svg/640px-Vaquita_size.svg.png",
        alt: "Vaquita porpoise",
        credit: "Paula Olson, NOAA / Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(600, "decreasing", 601),
    oceanRegions: ["Pacific Ocean"],
    coordinates: { lat: 31.0, lng: -114.5 },
    wikipediaSlug: "Vaquita",
    iucnUrl: "https://www.iucnredlist.org/species/17028/A2abd",
    gbifUrl: "https://www.gbif.org/species/2440756",
    obisUrl: "https://obis.org/taxon/343897",
    estimatedPopulation: "<10",
    sketchfabId: "64f8a8a394fe4433a4cbd20c652313e8",
    anatomy: [
      { label: "Dark Eye Rings", description: "Distinctive dark patches around the eyes" },
      { label: "Dorsal Fin", description: "Proportionally tall, triangular dorsal fin" },
      { label: "Rostrum", description: "Short, rounded snout typical of porpoises" },
    ],
  },
  {
    slug: "north-atlantic-right-whale",
    commonName: "North Atlantic Right Whale",
    scientificName: "Eubalaena glacialis",
    scientificTaxonId: "2440718",
    type: "mammal",
    conservationStatus: "CR",
    populationTrend: "decreasing",
    description:
      "The North Atlantic right whale is one of the most endangered large whale species, with approximately 350 individuals remaining. Named because they were the 'right' whale to hunt—slow-moving, rich in blubber, and floating when dead. These gentle giants are known for their distinctive V-shaped blow and callosities on their heads.",
    habitat:
      "Migrates along the eastern coast of North America from calving grounds off Florida and Georgia to feeding grounds in the Gulf of Maine and Canadian Maritimes.",
    diet: "Copepods and other zooplankton, filtered through their baleen plates.",
    lifespan: "Up to 70 years",
    weight: "Up to 70 tons (64,000 kg)",
    length: "45–55 feet (14–17 m)",
    threats: ["Ship strikes", "Entanglement in fishing gear", "Climate change", "Ocean noise", "Reduced prey availability"],
    funFacts: [
      "Right whales have unique patterns of callosities (rough patches of skin) used to identify individuals.",
      "They are one of the slowest swimming whales, making them vulnerable to ship collisions.",
      "Females give birth to a single calf every 3–5 years.",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/GRNMS_-_Right_Whales_%2831361234602%29.jpg/640px-GRNMS_-_Right_Whales_%2831361234602%29.jpg",
        alt: "North Atlantic right whale",
        credit: "NOAA / Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(400, "decreasing", 401),
    oceanRegions: ["Atlantic Ocean"],
    coordinates: { lat: 31.5, lng: -80.5 },
    wikipediaSlug: "North_Atlantic_right_whale",
    iucnUrl: "",
    gbifUrl: "https://www.gbif.org/species/2440718",
    obisUrl: "https://obis.org/taxon/159023",
    estimatedPopulation: "~350",
    sketchfabId: "3858008a8bf94ff599228e998fc9d397",
    anatomy: [
      { label: "Callosities", description: "Rough skin patches colonized by whale lice, unique per individual" },
      { label: "Baleen", description: "Up to 2.8m long dark baleen plates for filtering zooplankton" },
      { label: "Broad Fluke", description: "Wide, smooth-edged tail fluke with a deep notch" },
      { label: "No Dorsal Fin", description: "One of few whale species completely lacking a dorsal fin" },
    ],
  },
  {
    slug: "caribbean-monk-seal",
    commonName: "Caribbean Monk Seal",
    scientificName: "Neomonachus tropicalis",
    scientificTaxonId: "0",
    type: "mammal",
    conservationStatus: "EX",
    populationTrend: "decreasing",
    description:
      "The Caribbean monk seal was the only seal species native to the Caribbean Sea and Gulf of Mexico. Declared extinct in 2008, the last confirmed sighting was in 1952 at Serranilla Bank. These seals were hunted extensively for their oil and fur, and overfishing of their prey contributed to their decline.",
    habitat:
      "Formerly inhabited warm waters of the Caribbean Sea, Gulf of Mexico, and the Bahamas. Preferred sandy beaches, mangrove swamps, and coral reefs for resting and pupping.",
    diet: "Fish, octopuses, and crustaceans; they foraged in reef and shallow coastal waters.",
    lifespan: "Approximately 20 years (estimated)",
    weight: "375–600 lbs (170–270 kg)",
    length: "7–8 feet (2.1–2.4 m)",
    threats: ["Overhunting (historical)", "Overfishing of prey", "Human disturbance", "Habitat loss"],
    funFacts: [
      "The Caribbean monk seal was the first New World mammal to be discovered by Columbus in 1494.",
      "They were the only seal species to live in warm tropical waters.",
      "No photographs of a live Caribbean monk seal are known to exist.",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Cms-newyorkzoologicalsociety1910.jpg/640px-Cms-newyorkzoologicalsociety1910.jpg",
        alt: "Caribbean monk seal (historical)",
        credit: "New York Zoological Society / Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(0, "decreasing", 1),
    oceanRegions: ["Caribbean Sea", "Atlantic Ocean"],
    coordinates: { lat: 22.0, lng: -75.0 },
    wikipediaSlug: "Caribbean_monk_seal",
    iucnUrl: "",
    gbifUrl: "",
    obisUrl: "https://obis.org/taxon/1663105",
    estimatedPopulation: "Extinct",
    sketchfabId: "6ee05d216be4489698d1ba07f70c4b5a",
    anatomy: [
      { label: "Robust Body", description: "Barrel-shaped body with thick blubber layer" },
      { label: "Fore Flippers", description: "Short, clawed front flippers for hauling out on beaches" },
      { label: "Vibrissae", description: "Prominent whiskers for detecting prey in murky water" },
    ],
  },
  {
    slug: "sea-otter",
    commonName: "Sea Otter",
    scientificName: "Enhydra lutris",
    scientificTaxonId: "2433669",
    type: "mammal",
    conservationStatus: "EN",
    populationTrend: "stable",
    description:
      "Sea otters are the smallest marine mammals and the only otters that live exclusively in the ocean. They are keystone species, playing a critical role in maintaining kelp forest ecosystems by preying on sea urchins. Famous for using rocks as tools to crack open shellfish, they have the densest fur of any animal.",
    habitat:
      "Coastal waters of the North Pacific—from northern Japan through Alaska to California. Prefer kelp forests, rocky shores, and protected bays.",
    diet: "Sea urchins, crabs, clams, mussels, and other invertebrates; they use rocks to crack open shells.",
    lifespan: "15–20 years",
    weight: "31–99 lbs (14–45 kg)",
    length: "4–5 feet (1.2–1.5 m)",
    threats: ["Oil spills", "Predation by orcas", "Entanglement in fishing gear", "Disease", "Habitat loss"],
    funFacts: [
      "Sea otters have up to 1 million hairs per square inch—the densest fur of any mammal.",
      "They hold hands while sleeping to avoid drifting apart.",
      "They are one of the few mammals that use tools.",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Sea_Otter_%28Enhydra_lutris%29_%2825169790524%29_crop.jpg/640px-Sea_Otter_%28Enhydra_lutris%29_%2825169790524%29_crop.jpg",
        alt: "Sea otter floating with pup",
        credit: "Mike Baird / Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(3000, "stable", 3001),
    oceanRegions: ["Pacific Ocean"],
    coordinates: { lat: 36.6, lng: -121.9 },
    wikipediaSlug: "Sea_otter",
    iucnUrl: "https://www.iucnredlist.org/species/7750/A2abd",
    gbifUrl: "https://www.gbif.org/species/2433669",
    obisUrl: "https://obis.org/taxon/242598",
    estimatedPopulation: "~106,000",
    sketchfabId: "2582ec41adfe4e60bd1f80c9193fadd8",
    anatomy: [
      { label: "Dense Fur", description: "Up to 1 million hairs per sq inch — densest fur in the animal kingdom" },
      { label: "Webbed Hind Feet", description: "Large, flipper-like rear paws for powerful swimming" },
      { label: "Retractable Claws", description: "Front paws with retractable claws for gripping prey and tools" },
      { label: "Loose Skin Pouch", description: "Underarm skin fold used to store food and tools while floating" },
    ],
  },
  {
    slug: "hawaiian-monk-seal",
    commonName: "Hawaiian Monk Seal",
    scientificName: "Neomonachus schauinslandi",
    scientificTaxonId: "2440682",
    type: "mammal",
    conservationStatus: "EN",
    populationTrend: "increasing",
    description:
      "The Hawaiian monk seal is one of only two monk seal species remaining (the Mediterranean monk seal is the other) and is endemic to the Hawaiian Islands. These seals spend much of their time at sea but haul out on beaches to rest, molt, and give birth. Conservation efforts have helped stabilize their population.",
    habitat:
      "Exclusively in the Hawaiian archipelago, primarily in the Northwestern Hawaiian Islands. Prefer sandy beaches, coral atolls, and shallow reef waters.",
    diet: "Fish, eels, octopuses, and crustaceans; they forage in reef and benthic environments.",
    lifespan: "25–30 years",
    weight: "375–600 lbs (170–270 kg)",
    length: "7–7.5 feet (2.1–2.3 m)",
    threats: ["Limited prey availability", "Shark predation", "Entanglement in marine debris", "Human disturbance", "Disease"],
    funFacts: [
      "Hawaiian monk seals can hold their breath for up to 20 minutes when diving.",
      "They are one of the most endangered marine mammals in the US.",
      "Pups are born with a black coat that turns silvery-gray as they mature.",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Monachus_schauinslandi.jpg/640px-Monachus_schauinslandi.jpg",
        alt: "Hawaiian monk seal on beach",
        credit: "NOAA / Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(1400, "increasing", 1401),
    oceanRegions: ["Pacific Ocean"],
    coordinates: { lat: 25.7, lng: -171.7 },
    wikipediaSlug: "Hawaiian_monk_seal",
    iucnUrl: "",
    gbifUrl: "https://www.gbif.org/species/2440682",
    obisUrl: "https://obis.org/taxon/1663107",
    estimatedPopulation: "~1,400",
    sketchfabId: "6ee05d216be4489698d1ba07f70c4b5a",
    anatomy: [
      { label: "Streamlined Body", description: "Torpedo-shaped for efficient swimming through coral reefs" },
      { label: "Gray Pelage", description: "Silver-gray dorsal surface fading to cream on belly" },
      { label: "Vibrissae", description: "Long, sensitive whiskers for locating prey on the seafloor" },
    ],
  },
  {
    slug: "dugong",
    commonName: "Dugong",
    scientificName: "Dugong dugon",
    scientificTaxonId: "2433468",
    type: "mammal",
    conservationStatus: "VU",
    populationTrend: "decreasing",
    description:
      "The dugong is one of four living species of the order Sirenia and the only strictly marine herbivorous mammal. Often called 'sea cows,' dugongs graze on seagrass meadows and are culturally significant to Indigenous peoples across their range. Their closest relative is the manatee.",
    habitat:
      "Warm coastal waters of the Indian and western Pacific Oceans, from East Africa to Australia. Prefer shallow, protected bays and seagrass meadows.",
    diet: "Exclusively seagrass; they graze on roots and leaves, leaving characteristic feeding trails.",
    lifespan: "Up to 70 years",
    weight: "500–1,100 lbs (230–500 kg)",
    length: "8–10 feet (2.4–3 m)",
    threats: ["Habitat loss (seagrass destruction)", "Bycatch in fishing gear", "Boat strikes", "Hunting", "Pollution"],
    funFacts: [
      "Dugongs are thought to have inspired mermaid legends in many cultures.",
      "They can stay underwater for up to 6 minutes before surfacing to breathe.",
      "A single dugong can consume up to 88 pounds of seagrass daily.",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Dugong.JPG/640px-Dugong.JPG",
        alt: "Dugong in seagrass meadow",
        credit: "Julien Willem / Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(85000, "decreasing", 85001),
    oceanRegions: ["Indian Ocean", "Pacific Ocean", "Coral Triangle"],
    coordinates: { lat: -12.5, lng: 130.8 },
    wikipediaSlug: "Dugong",
    iucnUrl: "https://www.iucnredlist.org/species/6909/A2abd",
    gbifUrl: "https://www.gbif.org/species/2433468",
    obisUrl: "https://obis.org/taxon/220227",
    estimatedPopulation: "~100,000",
    sketchfabId: "68b37add0407416ab9ee3b314116486d",
    anatomy: [
      { label: "Fluked Tail", description: "Whale-like tail fluke distinguishing it from manatees' paddle tails" },
      { label: "Downturned Snout", description: "Specialized mouth oriented downward for seagrass grazing" },
      { label: "Tusks", description: "Males have erupted incisor tusks; present but unerupted in females" },
      { label: "Thick Skin", description: "Smooth, thick skin with sparse hair covering" },
    ],
  },
  {
    slug: "west-indian-manatee",
    commonName: "West Indian Manatee",
    scientificName: "Trichechus manatus",
    scientificTaxonId: "2441016",
    type: "mammal",
    conservationStatus: "VU",
    populationTrend: "increasing",
    description:
      "The West Indian manatee is a large, slow-moving aquatic mammal found in warm coastal waters, rivers, and springs. Despite their size, they are gentle herbivores that spend most of their time eating, resting, and traveling. Florida manatees are a subspecies and have recovered significantly due to conservation efforts.",
    habitat:
      "Coastal waters, rivers, and springs of the southeastern US, Caribbean, and Central and South America. Prefer warm waters above 68°F (20°C).",
    diet: "Aquatic vegetation including seagrasses, freshwater plants, and algae; they consume 10–15% of body weight daily.",
    lifespan: "50–60 years",
    weight: "800–1,200 lbs (360–545 kg)",
    length: "9–13 feet (2.7–4 m)",
    threats: ["Boat strikes", "Habitat loss", "Cold stress", "Red tide", "Entanglement in fishing gear"],
    funFacts: [
      "Manatees are closely related to elephants—they share common ancestors.",
      "They have a low metabolic rate and cannot tolerate cold water.",
      "Manatees replace their molars throughout their lives as they wear down from grazing.",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Manatee_with_calf.PD_-_colour_corrected.jpg/640px-Manatee_with_calf.PD_-_colour_corrected.jpg",
        alt: "West Indian manatee in clear water",
        credit: "USGS / Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(13000, "increasing", 13001),
    oceanRegions: ["Atlantic Ocean", "Caribbean Sea", "Gulf of Mexico"],
    coordinates: { lat: 27.5, lng: -82.6 },
    wikipediaSlug: "West_Indian_manatee",
    iucnUrl: "",
    gbifUrl: "https://www.gbif.org/species/2441016",
    obisUrl: "https://obis.org/taxon/159509",
    estimatedPopulation: "~13,000",
    sketchfabId: "74f68df160ef4a0b858b11141943f36c",
    anatomy: [
      { label: "Paddle Tail", description: "Round, spatula-shaped tail for gentle propulsion" },
      { label: "Prehensile Lips", description: "Split upper lip that manipulates vegetation into the mouth" },
      { label: "Marching Molars", description: "Continuously replaced teeth that move forward through the jaw" },
      { label: "Flippers", description: "Flexible front flippers with 3-4 fingernails, used for walking on bottom" },
    ],
  },
  {
    slug: "great-white-shark",
    commonName: "Great White Shark",
    scientificName: "Carcharodon carcharias",
    scientificTaxonId: "2415890",
    type: "fish",
    conservationStatus: "VU",
    populationTrend: "decreasing",
    description:
      "The great white shark is one of the ocean's most iconic apex predators. With up to 300 serrated teeth and an extraordinary sense of smell, these sharks play a crucial role in maintaining marine ecosystem balance. Despite their fearsome reputation, they are responsible for very few unprovoked attacks on humans.",
    habitat:
      "Found in coastal and offshore waters of all major oceans, typically in temperate waters. They undertake long migrations and are known to dive to depths of 1,200 meters.",
    diet: "Marine mammals (seals, sea lions), fish, and carrion; they use ambush tactics from below.",
    lifespan: "70+ years",
    weight: "1,500–2,400 lbs (680–1,100 kg)",
    length: "15–20 feet (4.6–6 m)",
    threats: ["Overfishing", "Bycatch", "Shark finning", "Habitat degradation", "Negative public perception"],
    funFacts: [
      "Great white sharks can detect a single drop of blood in 25 gallons of water.",
      "They have existed for over 11 million years, evolving before the dinosaurs went extinct.",
      "Their teeth are replaced throughout their lifetime—they may go through 20,000 teeth.",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/640px-White_shark.jpg",
        alt: "Great white shark in deep blue water",
        credit: "Terry Goss / Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(3500, "decreasing", 3501),
    oceanRegions: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Southern Ocean", "Mediterranean Sea"],
    coordinates: { lat: -34.6, lng: 18.4 },
    wikipediaSlug: "Great_white_shark",
    iucnUrl: "https://www.iucnredlist.org/species/3855/A2abd",
    gbifUrl: "https://www.gbif.org/species/2415890",
    obisUrl: "https://obis.org/taxon/105838",
    estimatedPopulation: "~3,500",
    sketchfabId: "f8657c5ffa714f5dae532de6393761ba",
    anatomy: [
      { label: "Serrated Teeth", description: "Up to 300 triangular, serrated teeth in multiple rows" },
      { label: "Ampullae of Lorenzini", description: "Electroreceptor organs in snout detecting prey's electrical fields" },
      { label: "Lateral Line", description: "Sensory canal detecting water pressure changes and vibrations" },
      { label: "Caudal Fin", description: "Crescent-shaped tail generating powerful burst speed up to 35mph" },
      { label: "Gill Slits", description: "Five pairs of gill slits for extracting oxygen from water" },
    ],
  },
  {
    slug: "whale-shark",
    commonName: "Whale Shark",
    scientificName: "Rhincodon typus",
    scientificTaxonId: "2417847",
    type: "fish",
    conservationStatus: "EN",
    populationTrend: "decreasing",
    description:
      "The whale shark is the largest fish in the ocean, reaching lengths of 40 feet or more. Despite their enormous size, these gentle giants are filter feeders, swimming with their mouths open to capture plankton, small fish, and krill. Their distinctive spotted pattern is unique to each individual, like a fingerprint.",
    habitat:
      "Tropical and warm temperate seas worldwide. Often found in coastal areas and near the surface. Known aggregation sites include the Philippines, Mexico, and Western Australia.",
    diet: "Plankton, small fish, squid, and krill; they filter feed by swimming with mouths open.",
    lifespan: "70–100 years",
    weight: "Up to 47,000 lbs (21,000 kg)",
    length: "18–40 feet (5.5–12 m)",
    threats: ["Bycatch", "Ship strikes", "Unregulated tourism", "Habitat degradation", "Climate change"],
    funFacts: [
      "Whale sharks have about 3,000 tiny teeth, but they don't use them for feeding.",
      "Their skin can be up to 4 inches thick.",
      "They can process over 1,500 gallons of water per hour when filter feeding.",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Similan_Dive_Center_-_great_whale_shark.jpg/640px-Similan_Dive_Center_-_great_whale_shark.jpg",
        alt: "Whale shark with distinctive spots",
        credit: "Zac Wolf / Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(120000, "decreasing", 120001),
    oceanRegions: ["Pacific Ocean", "Indian Ocean", "Atlantic Ocean", "Coral Triangle", "Caribbean Sea"],
    coordinates: { lat: 9.5, lng: 123.9 },
    wikipediaSlug: "Whale_shark",
    iucnUrl: "https://www.iucnredlist.org/species/19488/A2abd",
    gbifUrl: "https://www.gbif.org/species/2417847",
    obisUrl: "https://obis.org/taxon/105847",
    estimatedPopulation: "Unknown",
    sketchfabId: "b494e39b1df94015a9d2ce3b33336f80",
    anatomy: [
      { label: "Filter Pads", description: "Spongy tissue in gill arches that filters plankton from water" },
      { label: "Checkerboard Pattern", description: "Unique spot pattern used for individual identification" },
      { label: "Wide Mouth", description: "Up to 1.5m wide terminal mouth for suction filter-feeding" },
      { label: "Dermal Denticles", description: "Tooth-like scales covering skin, reducing drag" },
    ],
  },
  {
    slug: "hammerhead-shark",
    commonName: "Scalloped Hammerhead Shark",
    scientificName: "Sphyrna lewini",
    scientificTaxonId: "2420588",
    type: "fish",
    conservationStatus: "CR",
    populationTrend: "decreasing",
    description:
      "The scalloped hammerhead shark is distinguished by its unique hammer-shaped head (cephalofoil), which provides enhanced sensory capabilities and 360-degree vision. These sharks form large schools during the day and are highly migratory. Their distinctive head shape helps them detect prey buried in the sand.",
    habitat:
      "Tropical and warm temperate waters worldwide. Found in coastal areas, continental shelves, and around islands. Schools of hundreds have been observed at seamounts.",
    diet: "Fish, squid, octopuses, and crustaceans; they use their heads to pin stingrays to the seafloor.",
    lifespan: "30–35 years",
    weight: "Up to 335 lbs (152 kg)",
    length: "8–14 feet (2.4–4.3 m)",
    threats: ["Overfishing", "Shark finning", "Bycatch", "Habitat loss", "Low reproductive rate"],
    funFacts: [
      "The hammerhead's wide head gives it better binocular vision than other sharks.",
      "They have specialized electroreceptors (ampullae of Lorenzini) spread across their head.",
      "Scalloped hammerheads form schools of up to 100 individuals during the day.",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Scalloped_Hammerhead_Shark_Sphyrna_Lewini_%28226845659%29.jpeg/640px-Scalloped_Hammerhead_Shark_Sphyrna_Lewini_%28226845659%29.jpeg",
        alt: "Hammerhead shark in blue water",
        credit: "Barry Peters / Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(200000, "decreasing", 200001),
    oceanRegions: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Coral Triangle"],
    coordinates: { lat: -0.6, lng: 130.5 },
    wikipediaSlug: "Scalloped_hammerhead",
    iucnUrl: "https://www.iucnredlist.org/species/39385/A2abd",
    gbifUrl: "https://www.gbif.org/species/2420588",
    obisUrl: "https://obis.org/taxon/105816",
    estimatedPopulation: "Unknown (declining)",
    sketchfabId: "0fb23847d170498c9db48f4d052a3986",
    anatomy: [
      { label: "Cephalofoil", description: "Laterally expanded head providing 360° binocular vision" },
      { label: "Ampullae of Lorenzini", description: "Enhanced electroreceptor spread across the wide head" },
      { label: "Serrated Teeth", description: "Small, triangular teeth ideal for crushing crustaceans" },
      { label: "Tall Dorsal Fin", description: "Prominent first dorsal fin, highly valued and endangered by finning" },
    ],
  },
  {
    slug: "bluefin-tuna",
    commonName: "Atlantic Bluefin Tuna",
    scientificName: "Thunnus thynnus",
    scientificTaxonId: "2287045",
    type: "fish",
    conservationStatus: "EN",
    populationTrend: "increasing",
    description:
      "The Atlantic bluefin tuna is one of the largest and fastest fish in the ocean, capable of speeds up to 43 mph. These warm-blooded predators undertake epic transatlantic migrations. Highly prized for sushi and sashimi, they have been severely overfished, though recent management has shown signs of recovery.",
    habitat:
      "Temperate and tropical waters of the Atlantic Ocean and Mediterranean Sea. They migrate between spawning grounds in the Gulf of Mexico and Mediterranean and feeding grounds in the North Atlantic.",
    diet: "Fish (mackerel, herring), squid, and crustaceans; they are apex predators.",
    lifespan: "35–50 years",
    weight: "Up to 1,500 lbs (680 kg)",
    length: "6–10 feet (1.8–3 m)",
    threats: ["Overfishing", "Illegal fishing", "Bycatch", "Habitat degradation", "Climate change"],
    funFacts: [
      "Bluefin tuna can maintain body temperature above surrounding water—unusual for fish.",
      "A single bluefin tuna sold for $3.1 million at Tokyo's fish market in 2019.",
      "They can cross the Atlantic Ocean in under 60 days.",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Bluefin-big.jpg/640px-Bluefin-big.jpg",
        alt: "Atlantic bluefin tuna",
        credit: "NOAA / Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(1500000, "increasing", 1500001),
    oceanRegions: ["Atlantic Ocean", "Mediterranean Sea"],
    coordinates: { lat: 36.1, lng: -5.4 },
    wikipediaSlug: "Atlantic_bluefin_tuna",
    iucnUrl: "https://www.iucnredlist.org/species/21860/A2abd",
    gbifUrl: "https://www.gbif.org/species/2287045",
    obisUrl: "https://obis.org/taxon/127029",
    estimatedPopulation: "Unknown (rebuilding)",
    sketchfabId: "c5fad940863f47f784d792ca95e16b42",
    anatomy: [
      { label: "Retractable Fins", description: "Dorsal and pectoral fins fold into grooves for streamlining" },
      { label: "Countershading", description: "Dark blue dorsal / silver ventral coloring for open-ocean camouflage" },
      { label: "Endothermic System", description: "Rete mirabile heat-exchange system maintaining body temp above water" },
      { label: "Finlets", description: "Series of small yellow finlets between second dorsal and caudal fins" },
    ],
  },
  {
    slug: "clownfish",
    commonName: "Clownfish",
    scientificName: "Amphiprion ocellaris",
    scientificTaxonId: "2382297",
    type: "fish",
    conservationStatus: "LC",
    populationTrend: "stable",
    description:
      "Clownfish, immortalized by Finding Nemo, are small, brightly colored fish that form symbiotic relationships with sea anemones. They are immune to the anemone's stinging tentacles due to a protective mucus coating. Clownfish live in hierarchical groups dominated by a breeding female.",
    habitat:
      "Coral reefs of the Indian and Pacific Oceans, particularly the Coral Triangle. Found in shallow, warm waters in association with specific sea anemone species.",
    diet: "Zooplankton, small crustaceans, and algae; they also eat leftovers from the anemone's meals.",
    lifespan: "6–10 years",
    weight: "0.2–0.3 oz (5–8 g)",
    length: "2–5 inches (5–13 cm)",
    threats: ["Coral reef degradation", "Collection for aquarium trade", "Ocean acidification", "Climate change"],
    funFacts: [
      "All clownfish are born male; the dominant one becomes female when the breeding female dies.",
      "They never venture more than a few meters from their host anemone.",
      "Clownfish and anemones have a mutualistic relationship—both benefit from the partnership.",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Clown_fish_in_the_Andaman_Coral_Reef.jpg/640px-Clown_fish_in_the_Andaman_Coral_Reef.jpg",
        alt: "Clownfish among sea anemone",
        credit: "Nhobgood / Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(10000000, "stable", 10000001),
    oceanRegions: ["Pacific Ocean", "Indian Ocean", "Coral Triangle"],
    coordinates: { lat: -8.5, lng: 115.2 },
    wikipediaSlug: "Amphiprion_ocellaris",
    iucnUrl: "",
    gbifUrl: "https://www.gbif.org/species/2382297",
    obisUrl: "https://obis.org/taxon/278400",
    estimatedPopulation: "Abundant",
    sketchfabId: "67d920d3bf4341d6ba6b6358abd91041",
    anatomy: [
      { label: "Mucus Coating", description: "Specialized mucus layer providing immunity to anemone stings" },
      { label: "White Bars", description: "Three vertical white bars bordered in black on orange body" },
      { label: "Rounded Caudal Fin", description: "Fan-shaped tail for agile movement within anemone tentacles" },
    ],
  },
  {
    slug: "seahorse",
    commonName: "Seahorse",
    scientificName: "Hippocampus spp.",
    scientificTaxonId: "2404313",
    type: "fish",
    conservationStatus: "VU",
    populationTrend: "decreasing",
    description:
      "Seahorses are among the most distinctive fish in the ocean, with horse-like heads, prehensile tails, and bony plates instead of scales. They are one of the few species where males become pregnant—females deposit eggs into the male's brood pouch. Over 40 species exist, many threatened by habitat loss and the traditional medicine trade.",
    habitat:
      "Shallow tropical and temperate waters worldwide. Found in seagrass beds, mangroves, coral reefs, and estuaries. They anchor themselves with their tails to seagrass or coral.",
    diet: "Tiny crustaceans and plankton; they suck prey through their tubular snouts.",
    lifespan: "1–5 years depending on species",
    weight: "0.5–1 oz (14–28 g)",
    length: "0.6–14 inches (1.5–35 cm)",
    threats: ["Habitat destruction", "Bycatch", "Traditional medicine trade", "Aquarium trade", "Pollution"],
    funFacts: [
      "Male seahorses carry and give birth to up to 2,000 babies.",
      "They can move their eyes independently, like chameleons.",
      "Seahorses are poor swimmers—they prefer to anchor and wait for prey.",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Hippocampus_hippocampus_%28on_Ascophyllum_nodosum%29.jpg/640px-Hippocampus_hippocampus_%28on_Ascophyllum_nodosum%29.jpg",
        alt: "Seahorse in seagrass",
        credit: "Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(50000000, "decreasing", 50000001),
    oceanRegions: ["Pacific Ocean", "Indian Ocean", "Atlantic Ocean", "Coral Triangle", "Caribbean Sea", "Mediterranean Sea"],
    coordinates: { lat: -2.5, lng: 118.0 },
    wikipediaSlug: "Seahorse",
    iucnUrl: "",
    gbifUrl: "https://www.gbif.org/species/2404313",
    obisUrl: "https://obis.org/taxon/127380",
    estimatedPopulation: "Unknown",
    sketchfabId: "992469bea89d4adcab1410fb79235e99",
    anatomy: [
      { label: "Prehensile Tail", description: "Curled tail for anchoring to seagrass and coral" },
      { label: "Brood Pouch", description: "Male incubation pouch where fertilized eggs develop to birth" },
      { label: "Bony Plates", description: "Exoskeleton of fused bony plates instead of scales" },
      { label: "Tubular Snout", description: "Long snout for suction-feeding on tiny crustaceans" },
    ],
  },
  {
    slug: "lionfish",
    commonName: "Lionfish",
    scientificName: "Pterois volitans",
    scientificTaxonId: "2334458",
    type: "fish",
    conservationStatus: "LC",
    populationTrend: "increasing",
    description:
      "The lionfish is a strikingly beautiful but invasive species in the Atlantic and Caribbean. Native to the Indo-Pacific, they were introduced through the aquarium trade and have spread rapidly. Their venomous spines deter predators while they voraciously consume native fish. In their native range, they are important reef inhabitants.",
    habitat:
      "Native to coral reefs of the Indo-Pacific. Invasive in the Atlantic, Caribbean, and Gulf of Mexico. Found in coral reefs, rocky crevices, and artificial structures from 1–300 feet deep.",
    diet: "Small fish, shrimp, and crabs; they use their fins to corner prey before striking.",
    lifespan: "10–15 years",
    weight: "1–2 lbs (0.5–1 kg)",
    length: "12–15 inches (30–38 cm)",
    threats: ["Invasive in non-native range (threat to ecosystems)", "Overcollection in native range", "Reef degradation"],
    funFacts: [
      "Lionfish have 18 venomous spines that can deliver a painful sting.",
      "They can expand their stomachs to consume prey up to half their body size.",
      "In the Caribbean, organized culling programs help control invasive populations.",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Pterois_volitans_Manado-e_edit.jpg/640px-Pterois_volitans_Manado-e_edit.jpg",
        alt: "Lionfish with flowing fins",
        credit: "Jens Petersen / Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(5000000, "increasing", 5000001),
    oceanRegions: ["Pacific Ocean", "Indian Ocean", "Coral Triangle", "Caribbean Sea", "Atlantic Ocean"],
    coordinates: { lat: 18.2, lng: -64.9 },
    wikipediaSlug: "Red_lionfish",
    iucnUrl: "",
    gbifUrl: "https://www.gbif.org/species/2334458",
    obisUrl: "https://obis.org/taxon/159559",
    estimatedPopulation: "Invasive / Abundant",
    sketchfabId: "c349ae816e484dbca6b83735d6c3cec2",
    anatomy: [
      { label: "Venomous Spines", description: "18 needle-like dorsal, anal, and pelvic spines delivering painful venom" },
      { label: "Pectoral Fins", description: "Fan-like pectoral fins used to herd prey into corners" },
      { label: "Zebra Stripes", description: "Red-and-white warning coloration signaling toxicity" },
    ],
  },
  {
    slug: "manta-ray",
    commonName: "Giant Manta Ray",
    scientificName: "Mobula birostris",
    scientificTaxonId: "2422217",
    type: "fish",
    conservationStatus: "VU",
    populationTrend: "decreasing",
    description:
      "The giant manta ray is the largest ray in the world, with wingspans reaching 23 feet. These graceful filter feeders are highly intelligent, with the largest brain-to-body ratio of any fish. They perform acrobatic leaps and form cleaning stations where smaller fish remove parasites. Each manta has a unique belly pattern for identification.",
    habitat:
      "Tropical and subtropical waters worldwide. Found in coastal areas, around islands, and at cleaning stations. They undertake long migrations following plankton blooms.",
    diet: "Zooplankton, small fish, and krill; they filter feed by swimming with mouths open.",
    lifespan: "40+ years",
    weight: "Up to 5,300 lbs (2,400 kg)",
    length: "Wingspan up to 23 feet (7 m)",
    threats: ["Targeted fishing (gill plates for traditional medicine)", "Bycatch", "Ship strikes", "Climate change", "Tourism pressure"],
    funFacts: [
      "Manta rays have the largest brain of any fish and demonstrate curiosity and play behavior.",
      "They are one of the few fish that can recognize themselves in a mirror.",
      "Each manta has a unique pattern of spots on its belly—like a fingerprint.",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Manta_birostris-Thailand4.jpg/640px-Manta_birostris-Thailand4.jpg",
        alt: "Giant manta ray gliding through water",
        credit: "Jon Hanson / Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(16000, "decreasing", 16001),
    oceanRegions: ["Pacific Ocean", "Indian Ocean", "Atlantic Ocean", "Coral Triangle"],
    coordinates: { lat: -8.4, lng: 115.1 },
    wikipediaSlug: "Giant_manta_ray",
    iucnUrl: "https://www.iucnredlist.org/species/198921/A2abd",
    gbifUrl: "https://www.gbif.org/species/2422217",
    obisUrl: "https://obis.org/taxon/1026118",
    estimatedPopulation: "Unknown (declining)",
    sketchfabId: "38fa168e96944e518fe15e702ad79ee0",
    anatomy: [
      { label: "Cephalic Fins", description: "Horn-like lobes directing plankton-rich water into the mouth" },
      { label: "Gill Rakers", description: "Comb-like structures filtering zooplankton from water" },
      { label: "Disc Wingspan", description: "Pectoral fins fused to head forming a disc up to 7m wide" },
      { label: "Spot Pattern", description: "Unique ventral spot markings used for individual identification" },
    ],
  },
  {
    slug: "leafy-seadragon",
    commonName: "Leafy Seadragon",
    scientificName: "Phycodurus eques",
    scientificTaxonId: "2359532",
    type: "fish",
    conservationStatus: "NT",
    populationTrend: "decreasing",
    description:
      "The leafy seadragon is one of the most spectacular examples of camouflage in the animal kingdom. Native to southern Australia, these fish resemble floating seaweed with leaf-like appendages covering their bodies. They are the marine emblem of South Australia and are related to seahorses and pipefish.",
    habitat:
      "Temperate waters off southern Australia. Found in rocky reefs, seagrass beds, and kelp forests at depths of 5–50 meters. Prefer areas with strong current.",
    diet: "Tiny crustaceans (mysids) and other small zooplankton; they suck prey through their snouts.",
    lifespan: "5–10 years",
    weight: "0.5 oz (14 g)",
    length: "13–14 inches (33–35 cm)",
    threats: ["Habitat degradation", "Collection for aquarium trade", "Pollution", "Climate change"],
    funFacts: [
      "Leafy seadragons are the official marine emblem of South Australia.",
      "Males carry the eggs—females deposit them on the male's tail.",
      "Their leaf-like appendages are for camouflage, not movement.",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Leafy_Seadragon_on_Kangaroo_Island.jpg/640px-Leafy_Seadragon_on_Kangaroo_Island.jpg",
        alt: "Leafy seadragon camouflaged in seaweed",
        credit: "Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(15000, "decreasing", 15001),
    oceanRegions: ["Pacific Ocean", "Southern Ocean"],
    coordinates: { lat: -35.0, lng: 138.5 },
    wikipediaSlug: "Leafy_seadragon",
    iucnUrl: "",
    gbifUrl: "https://www.gbif.org/species/2359532",
    obisUrl: "https://obis.org/taxon/282248",
    estimatedPopulation: "Unknown",
    sketchfabId: "43cabc76b78a4a36a0f8aab6bffe2b5f",
    anatomy: [
      { label: "Leaf-like Appendages", description: "Ornate dermal projections providing kelp-bed camouflage" },
      { label: "Tubular Snout", description: "Fused jaw forming a pipette-like mouth for suction feeding" },
      { label: "Transparent Fins", description: "Nearly invisible dorsal and pectoral fins for subtle propulsion" },
    ],
  },
  {
    slug: "coelacanth",
    commonName: "Coelacanth",
    scientificName: "Latimeria chalumnae",
    scientificTaxonId: "2404024",
    type: "fish",
    conservationStatus: "CR",
    populationTrend: "decreasing",
    description:
      "The coelacanth is a 'living fossil'—thought to have been extinct for 65 million years until discovered alive in 1938 off South Africa. These ancient fish have lobed fins that resemble limbs and are more closely related to lungfish and tetrapods than to modern ray-finned fish. Fewer than 500 individuals are estimated to exist.",
    habitat:
      "Deep volcanic slopes and caves off the coast of South Africa, Mozambique, Madagascar, and the Comoros Islands. Found at depths of 150–700 meters, typically in cold, oxygen-rich waters.",
    diet: "Squid, cuttlefish, eels, and small fish; they use a unique rostral organ to detect prey.",
    lifespan: "60–100 years",
    weight: "110–198 lbs (50–90 kg)",
    length: "5–6.5 feet (1.5–2 m)",
    threats: ["Bycatch in deep-water fishing", "Habitat degradation", "Small population size", "Scientific collection (historical)"],
    funFacts: [
      "Coelacanths were thought extinct for 65 million years until 1938.",
      "They give birth to live young—pups can be 1 foot long at birth.",
      "Their oily flesh is inedible and causes severe diarrhea if consumed.",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Coelacanth_off_Pumula_on_the_KwaZulu-Natal_South_Coast%2C_South_Africa%2C_on_22_November_2019.png/640px-Coelacanth_off_Pumula_on_the_KwaZulu-Natal_South_Coast%2C_South_Africa%2C_on_22_November_2019.png",
        alt: "Coelacanth in deep water",
        credit: "Alberto Fernandez Fernandez / Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(500, "decreasing", 501),
    oceanRegions: ["Indian Ocean"],
    coordinates: { lat: -12.3, lng: 43.3 },
    wikipediaSlug: "Coelacanth",
    iucnUrl: "https://www.iucnredlist.org/species/5765/A2abd",
    gbifUrl: "https://www.gbif.org/species/2404024",
    obisUrl: "https://obis.org/taxon/217438",
    estimatedPopulation: "<500",
    sketchfabId: "162ba6f0282c453789c77a4fa2f84e6e",
    anatomy: [
      { label: "Lobed Fins", description: "Fleshy, limb-like fins that move in alternating pattern like tetrapod legs" },
      { label: "Rostral Organ", description: "Electrosensory organ in snout for detecting prey" },
      { label: "Intracranial Joint", description: "Unique hinge in skull allowing upper jaw to lift during feeding" },
      { label: "Hollow Spine", description: "Oil-filled notochord instead of true vertebral column (hence 'hollow spine')" },
    ],
  },
  {
    slug: "european-sturgeon",
    commonName: "European Sturgeon",
    scientificName: "Acipenser sturio",
    scientificTaxonId: "2403088",
    type: "fish",
    conservationStatus: "EW",
    populationTrend: "decreasing",
    description:
      "The European sturgeon was once widespread in rivers and coastal waters from the Black Sea to the North Sea. Overfishing for caviar and meat, combined with dam construction and pollution, drove it to extinction in the wild. Captive breeding programs maintain the species, with reintroduction efforts underway in several European rivers.",
    habitat:
      "Historically: estuaries and rivers of Western Europe (Garonne, Elbe) and the Black Sea. Now exists only in captivity. Anadromous—spawns in rivers, feeds in marine waters.",
    diet: "Bottom-dwelling invertebrates, small fish, and crustaceans; they use barbels to detect prey in sediment.",
    lifespan: "Up to 100 years",
    weight: "Up to 400 lbs (180 kg)",
    length: "6–10 feet (1.8–3 m)",
    threats: ["Overfishing (historical)", "Dam construction", "Pollution", "Habitat loss", "Poaching for caviar"],
    funFacts: [
      "European sturgeon can live over 100 years.",
      "They have existed for over 150 million years—since the dinosaurs.",
      "Reintroduction programs are attempting to restore wild populations in France and Germany.",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Acipenser_sturio_1879.jpg/640px-Acipenser_sturio_1879.jpg",
        alt: "European sturgeon",
        credit: "Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(0, "decreasing", 1),
    oceanRegions: ["Atlantic Ocean", "Mediterranean Sea", "Black Sea"],
    coordinates: { lat: 45.6, lng: -1.0 },
    wikipediaSlug: "European_sturgeon",
    iucnUrl: "",
    gbifUrl: "https://www.gbif.org/species/2403088",
    obisUrl: "https://obis.org/taxon/126279",
    estimatedPopulation: "<750",
    sketchfabId: "ffeabdae926d4cf798cd82da55ebd222",
    anatomy: [
      { label: "Bony Scutes", description: "Five rows of armored bony plates along the body" },
      { label: "Barbels", description: "Four sensory whiskers on the underside of the snout" },
      { label: "Protrusible Mouth", description: "Toothless, vacuum-like mouth that extends downward to suck up prey" },
      { label: "Heterocercal Tail", description: "Shark-like asymmetric tail with larger upper lobe" },
    ],
  },
  {
    slug: "axolotl",
    commonName: "Axolotl",
    scientificName: "Ambystoma mexicanum",
    scientificTaxonId: "0",
    type: "fish",
    conservationStatus: "CR",
    populationTrend: "decreasing",
    description:
      "The axolotl is a critically endangered aquatic salamander native to Mexico. Unlike most amphibians, axolotls remain aquatic their entire lives, retaining juvenile features like external gills. They have remarkable regenerative abilities—able to regrow limbs, organs, and even parts of their brain. Wild populations exist only in the canals of Xochimilco.",
    habitat:
      "Exclusively in the canal system of Xochimilco and Lake Chalco in Mexico City. Prefer cool, oxygen-rich, vegetated waters. Most axolotls today exist in captivity.",
    diet: "Worms, insects, small fish, and crustaceans; they are opportunistic carnivores.",
    lifespan: "10–15 years",
    weight: "2–8 oz (56–226 g)",
    length: "6–18 inches (15–45 cm)",
    threats: ["Habitat destruction", "Water pollution", "Invasive species (tilapia, carp)", "Urbanization", "Collection for pet trade"],
    funFacts: [
      "Axolotls can regrow entire limbs, their tail, and even parts of their heart and brain.",
      "They never undergo metamorphosis—staying in their larval form throughout life.",
      "Named after Xolotl, the Aztec god of fire and lightning.",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Axolotl_ganz.jpg/640px-Axolotl_ganz.jpg",
        alt: "Axolotl with external gills",
        credit: "th1098 / Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(1200, "decreasing", 1201),
    oceanRegions: ["Pacific Ocean"],
    coordinates: { lat: 19.3, lng: -99.1 },
    wikipediaSlug: "Axolotl",
    iucnUrl: "",
    gbifUrl: "",
    obisUrl: "",
    estimatedPopulation: "50–1,000 (wild)",
    sketchfabId: "5c979f517c734e739a15a7c34386bba3",
    anatomy: [
      { label: "External Gills", description: "Three pairs of feathery external gills for aquatic respiration" },
      { label: "Neotenic Form", description: "Retains larval features throughout life, never metamorphoses" },
      { label: "Regenerative Limbs", description: "Can fully regenerate limbs, heart tissue, spinal cord, and brain" },
      { label: "Caudal Fin", description: "Long, fin-edged tail used for swimming" },
    ],
  },
  {
    slug: "green-sea-turtle",
    commonName: "Green Sea Turtle",
    scientificName: "Chelonia mydas",
    scientificTaxonId: "2441767",
    type: "reptile",
    conservationStatus: "EN",
    populationTrend: "decreasing",
    description:
      "The green sea turtle is one of the largest hard-shelled sea turtles and the only herbivorous species as adults. Named for the green color of their fat (from their seaweed diet), they undertake long migrations between feeding grounds and nesting beaches. These ancient mariners have navigated oceans for over 100 million years.",
    habitat:
      "Tropical and subtropical waters worldwide. Nest on sandy beaches; feed in seagrass beds, coral reefs, and coastal waters. Found in over 80 countries.",
    diet: "Juveniles: jellyfish, sponges. Adults: primarily seagrass and algae.",
    lifespan: "70+ years",
    weight: "300–440 lbs (136–200 kg)",
    length: "3–4 feet (0.9–1.2 m)",
    threats: ["Bycatch in fishing gear", "Habitat loss", "Climate change (nesting beach temperature)", "Plastic pollution", "Hunting and egg collection"],
    funFacts: [
      "Green sea turtles can hold their breath for up to 5 hours when resting.",
      "They return to the same beach where they hatched to nest.",
      "Temperature of the nest determines the sex of hatchlings—warmer = more females.",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Green_sea_turtle_%28Chelonia_mydas%29_Moorea.jpg/640px-Green_sea_turtle_%28Chelonia_mydas%29_Moorea.jpg",
        alt: "Green sea turtle swimming",
        credit: "Brocken Inaglory / Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(85000, "decreasing", 85001),
    oceanRegions: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Caribbean Sea", "Mediterranean Sea"],
    coordinates: { lat: 19.7, lng: -155.1 },
    wikipediaSlug: "Green_sea_turtle",
    iucnUrl: "https://www.iucnredlist.org/species/4615/A2bd",
    gbifUrl: "https://www.gbif.org/species/2441767",
    obisUrl: "https://obis.org/taxon/137206",
    estimatedPopulation: "~85,000 nesting females",
    sketchfabId: "c92be549c8194136914883309a13a6b5",
    anatomy: [
      { label: "Serrated Beak", description: "Finely serrated jaw edges for tearing seagrass and algae" },
      { label: "Carapace", description: "Heart-shaped shell with 5 central and 4 lateral scutes" },
      { label: "Flippers", description: "Single-clawed front flippers for powerful swimming strokes" },
      { label: "Salt Glands", description: "Lacrimal glands excreting excess salt, appearing as 'tears'" },
    ],
  },
  {
    slug: "hawksbill-turtle",
    commonName: "Hawksbill Turtle",
    scientificName: "Eretmochelys imbricata",
    scientificTaxonId: "2441780",
    type: "reptile",
    conservationStatus: "CR",
    populationTrend: "decreasing",
    description:
      "The hawksbill turtle is named for its narrow, pointed beak, which it uses to extract prey from coral reef crevices. Their beautiful, tortoiseshell-patterned shells have made them targets for the illegal wildlife trade. Hawksbills play a vital role in coral reef health by feeding on sponges that would otherwise overgrow corals.",
    habitat:
      "Tropical coral reefs, rocky areas, and shallow coastal waters of the Atlantic, Pacific, and Indian Oceans. Nest on tropical beaches.",
    diet: "Sponges (primary), sea anemones, jellyfish, and tunicates; their diet supports coral reef diversity.",
    lifespan: "50+ years",
    weight: "100–150 lbs (45–68 kg)",
    length: "2–3 feet (0.6–0.9 m)",
    threats: ["Illegal shell trade", "Bycatch", "Egg collection", "Habitat loss", "Climate change"],
    funFacts: [
      "Hawksbill shells were historically used for tortoiseshell jewelry and ornaments.",
      "They are the primary consumers of sponges on coral reefs.",
      "Their narrow beak allows them to reach into coral crevices for food.",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Eretmochelys-imbricata-K%C3%A9lonia-2.JPG/640px-Eretmochelys-imbricata-K%C3%A9lonia-2.JPG",
        alt: "Hawksbill turtle on coral reef",
        credit: "Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(25000, "decreasing", 25001),
    oceanRegions: ["Pacific Ocean", "Indian Ocean", "Atlantic Ocean", "Caribbean Sea", "Coral Triangle"],
    coordinates: { lat: -8.5, lng: 115.2 },
    wikipediaSlug: "Hawksbill_sea_turtle",
    iucnUrl: "https://www.iucnredlist.org/species/8005/A2bd",
    gbifUrl: "https://www.gbif.org/species/2441780",
    obisUrl: "https://obis.org/taxon/137207",
    estimatedPopulation: "~8,000 nesting females",
    sketchfabId: "b7294b6b1ad64cc6b624f1185be8523e",
    anatomy: [
      { label: "Hawk-like Beak", description: "Narrow, pointed beak for extracting sponges from reef crevices" },
      { label: "Overlapping Scutes", description: "Beautiful tortoiseshell-patterned overlapping carapace plates" },
      { label: "Clawed Flippers", description: "Two claws on each flipper for gripping coral substrate" },
    ],
  },
  {
    slug: "leatherback-turtle",
    commonName: "Leatherback Turtle",
    scientificName: "Dermochelys coriacea",
    scientificTaxonId: "2441759",
    type: "reptile",
    conservationStatus: "VU",
    populationTrend: "decreasing",
    description:
      "The leatherback is the largest of all sea turtles and the only one without a hard shell—instead, it has a flexible, leathery carapace. These incredible migrators travel farther than any other reptile, crossing entire ocean basins. They can dive to depths of 4,200 feet, deeper than most marine mammals.",
    habitat:
      "Found in all tropical and temperate oceans. Nest on tropical beaches; forage in cold, productive waters. Undertake the longest migrations of any sea turtle.",
    diet: "Almost exclusively jellyfish; they consume hundreds daily. Sometimes eat other soft-bodied invertebrates.",
    lifespan: "45+ years",
    weight: "550–2,000 lbs (250–900 kg)",
    length: "4–6 feet (1.2–1.8 m)",
    threats: ["Bycatch", "Plastic pollution (mistaken for jellyfish)", "Egg collection", "Climate change", "Habitat loss"],
    funFacts: [
      "Leatherbacks can dive deeper than 4,200 feet—deeper than most whales.",
      "They have the widest global distribution of any reptile.",
      "Their throat has backward-pointing spines to prevent jellyfish from escaping.",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Leatherback_sea_turtle_Tinglar%2C_USVI_%285839996547%29.jpg/640px-Leatherback_sea_turtle_Tinglar%2C_USVI_%285839996547%29.jpg",
        alt: "Leatherback turtle in open ocean",
        credit: "U.S. Fish and Wildlife Service / Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(34000, "decreasing", 34001),
    oceanRegions: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Southern Ocean", "Caribbean Sea"],
    coordinates: { lat: 10.0, lng: -83.5 },
    wikipediaSlug: "Leatherback_sea_turtle",
    iucnUrl: "https://www.iucnredlist.org/species/6494/A2bd",
    gbifUrl: "https://www.gbif.org/species/2441759",
    obisUrl: "https://obis.org/taxon/137209",
    estimatedPopulation: "~34,000 nesting females",
    sketchfabId: "4974c93644a24da280fde68cba74a12d",
    anatomy: [
      { label: "Leathery Carapace", description: "Unique flexible shell of connective tissue instead of hard scutes" },
      { label: "Longitudinal Ridges", description: "Seven raised keels running along the carapace for hydrodynamics" },
      { label: "Papillae", description: "Backward-pointing esophageal spines preventing jellyfish escape" },
      { label: "Counter-current Heat", description: "Unique blood vessel arrangement retaining body heat in cold waters" },
    ],
  },
  {
    slug: "giant-pacific-octopus",
    commonName: "Giant Pacific Octopus",
    scientificName: "Enteroctopus dofleini",
    scientificTaxonId: "2290867",
    type: "invertebrate",
    conservationStatus: "LC",
    populationTrend: "stable",
    description:
      "The giant Pacific octopus is the largest octopus species, known for its intelligence, problem-solving abilities, and remarkable camouflage. These solitary predators can change color and texture in an instant to blend with their surroundings. They have three hearts and blue blood, and each of their 2,000 suckers can taste and touch.",
    habitat:
      "Cold, rocky waters of the North Pacific from California to Alaska and across to Japan. Found in intertidal zones to depths of 2,000 feet. Prefer rocky dens and crevices.",
    diet: "Crabs, clams, fish, and other octopuses; they use their beak and venom to subdue prey.",
    lifespan: "3–5 years",
    weight: "22–110 lbs (10–50 kg)",
    length: "9–16 feet arm span (2.7–4.9 m)",
    threats: ["Overfishing", "Habitat degradation", "Pollution", "Climate change"],
    funFacts: [
      "Giant Pacific octopuses have three hearts and blue, copper-based blood.",
      "They can squeeze through any opening larger than their beak.",
      "Females die shortly after guarding their eggs—they don't eat during the months-long vigil.",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Enteroctopus_dolfeini.jpg/640px-Enteroctopus_dolfeini.jpg",
        alt: "Giant Pacific octopus",
        credit: "Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(1000000, "stable", 1000001),
    oceanRegions: ["Pacific Ocean"],
    coordinates: { lat: 47.6, lng: -122.3 },
    wikipediaSlug: "Giant_Pacific_octopus",
    iucnUrl: "",
    gbifUrl: "https://www.gbif.org/species/2290867",
    obisUrl: "https://obis.org/taxon/342305",
    estimatedPopulation: "Abundant",
    sketchfabId: "b2812d87d9a94a389fba0c65653f5caa",
    anatomy: [
      { label: "Eight Arms", description: "Flexible arms with ~2,240 suckers each, capable of taste and grip" },
      { label: "Chromatophores", description: "Pigment cells enabling rapid color/texture changes for camouflage" },
      { label: "Beak", description: "Parrot-like chitinous beak — the only hard structure in the body" },
      { label: "Siphon", description: "Muscular funnel for jet propulsion and ink expulsion" },
      { label: "Three Hearts", description: "Two branchial hearts for gills plus one systemic heart" },
    ],
  },
  {
    slug: "blue-ringed-octopus",
    commonName: "Blue-Ringed Octopus",
    scientificName: "Hapalochlaena spp.",
    scientificTaxonId: "2379598",
    type: "invertebrate",
    conservationStatus: "LC",
    populationTrend: "stable",
    description:
      "The blue-ringed octopus is one of the ocean's most venomous creatures. Small and unassuming when at rest, it flashes brilliant blue rings when threatened. Its venom contains tetrodotoxin, powerful enough to kill 26 adults within minutes. Despite their danger, they are shy and only bite when provoked.",
    habitat:
      "Tidal pools and coral reefs of the Pacific and Indian Oceans, from Japan to Australia. Found in shallow waters, often hiding in shells or crevices.",
    diet: "Small crabs, shrimp, and other crustaceans; they pierce prey with their beak and inject venom.",
    lifespan: "1–2 years",
    weight: "1–2 oz (28–56 g)",
    length: "4–6 inches (10–15 cm) arm span",
    threats: ["Habitat degradation", "Collection for aquarium trade", "Reef destruction"],
    funFacts: [
      "Blue-ringed octopus venom can paralyze and kill humans—there is no antivenom.",
      "They carry enough venom to kill 26 adult humans.",
      "Their blue rings only appear when they feel threatened.",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Hapalochlaena_lunulata2.JPG/640px-Hapalochlaena_lunulata2.JPG",
        alt: "Blue-ringed octopus displaying warning colors",
        credit: "Jens Petersen / Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(500000, "stable", 500001),
    oceanRegions: ["Pacific Ocean", "Indian Ocean", "Coral Triangle"],
    coordinates: { lat: -33.9, lng: 151.3 },
    wikipediaSlug: "Blue-ringed_octopus",
    iucnUrl: "",
    gbifUrl: "https://www.gbif.org/species/2379598",
    obisUrl: "https://obis.org/taxon/342333",
    estimatedPopulation: "Unknown",
    sketchfabId: "89252462f02e4d688b3fd792b88b90d9",
    anatomy: [
      { label: "Iridescent Rings", description: "50-60 bright blue rings that flash as a warning display" },
      { label: "Salivary Glands", description: "Produce tetrodotoxin — venom 1,000x more potent than cyanide" },
      { label: "Beak", description: "Small but sharp beak capable of penetrating gloves" },
    ],
  },
  {
    slug: "nautilus",
    commonName: "Chambered Nautilus",
    scientificName: "Nautilus pompilius",
    scientificTaxonId: "2291166",
    type: "invertebrate",
    conservationStatus: "NT",
    populationTrend: "decreasing",
    description:
      "The chambered nautilus is a living fossil, virtually unchanged for 500 million years. These cephalopods have a spiral shell divided into gas-filled chambers that provide buoyancy. They emerge from the depths at night to feed and are the only cephalopods with an external shell. Their beautiful shells have made them targets for the shell trade.",
    habitat:
      "Deep reef slopes of the Indo-Pacific, from 300–2,000 feet. Migrate vertically—deeper by day, shallower at night to feed. Found from Australia to the Philippines.",
    diet: "Carrion, molted crustaceans, and small prey; they are scavengers and opportunistic feeders.",
    lifespan: "15–20 years",
    weight: "2–3 lbs (0.9–1.4 kg)",
    length: "8–10 inches shell diameter (20–25 cm)",
    threats: ["Overharvesting for shells", "Ocean acidification", "Deep-sea fishing bycatch", "Habitat degradation"],
    funFacts: [
      "Nautiluses have existed for over 500 million years—before the dinosaurs.",
      "They add a new chamber to their shell each year as they grow.",
      "Their shell is a natural example of the logarithmic spiral (golden ratio).",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Nautilus_belauensis_from_Palau.jpg/640px-Nautilus_belauensis_from_Palau.jpg",
        alt: "Chambered nautilus with spiral shell",
        credit: "Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(1000000, "decreasing", 1000002),
    oceanRegions: ["Pacific Ocean", "Indian Ocean", "Coral Triangle"],
    coordinates: { lat: -5.2, lng: 119.4 },
    wikipediaSlug: "Chambered_nautilus",
    iucnUrl: "https://www.iucnredlist.org/species/42568/A2abd",
    gbifUrl: "https://www.gbif.org/species/2291166",
    obisUrl: "https://obis.org/taxon/216384",
    estimatedPopulation: "Unknown (declining)",
    sketchfabId: "ad379c7c5ca345ac801bd249d864c94f",
    anatomy: [
      { label: "Chambered Shell", description: "Spiral shell with up to 30 gas-filled chambers for buoyancy" },
      { label: "Tentacles", description: "Up to 90 simple, adhesive tentacles without suckers" },
      { label: "Pinhole Eyes", description: "Primitive eyes without lenses, functioning like a pinhole camera" },
      { label: "Siphuncle", description: "Tube connecting chambers, regulating gas and fluid for depth control" },
    ],
  },
  {
    slug: "staghorn-coral",
    commonName: "Staghorn Coral",
    scientificName: "Acropora cervicornis",
    scientificTaxonId: "5069870",
    type: "coral",
    conservationStatus: "CR",
    populationTrend: "decreasing",
    description:
      "Staghorn coral is a branching coral that forms dense thickets in shallow reef environments. It grows rapidly and provides critical habitat for countless reef species. Caribbean populations have declined by over 80% since the 1980s due to disease, bleaching, and hurricanes. It is a primary reef-building species.",
    habitat:
      "Shallow reef environments (1–30 meters) in the Caribbean, Florida Keys, and Bahamas. Prefer clear, well-circulated waters with strong light. Forms the structural framework of many reefs.",
    diet: "Photosynthetic zooxanthellae (symbiotic algae) provide most nutrition; also captures plankton.",
    lifespan: "Colonies can live centuries",
    weight: "N/A (colonial organism)",
    length: "Branches 1–4 inches diameter, colonies up to 6 feet",
    threats: ["Coral bleaching", "Disease (white band)", "Ocean acidification", "Hurricanes", "Overfishing of herbivores"],
    funFacts: [
      "Staghorn coral can grow up to 8 inches per year—one of the fastest-growing corals.",
      "It reproduces both sexually and through fragmentation (broken pieces can grow into new colonies).",
      "Caribbean staghorn populations have declined over 80% since 1980.",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Hertshoon.jpg/640px-Hertshoon.jpg",
        alt: "Staghorn coral branches",
        credit: "NOAA / Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(3000000, "decreasing", 3000001),
    oceanRegions: ["Caribbean Sea", "Atlantic Ocean"],
    coordinates: { lat: 24.6, lng: -81.4 },
    wikipediaSlug: "Staghorn_coral",
    iucnUrl: "",
    gbifUrl: "https://www.gbif.org/species/5069870",
    obisUrl: "https://obis.org/taxon/206989",
    estimatedPopulation: "Declining",
    sketchfabId: "3b2227217de7468ea1ae67440505ce49",
    anatomy: [
      { label: "Branching Structure", description: "Antler-like calcium carbonate branches growing up to 20cm/year" },
      { label: "Polyps", description: "Tiny colonial animals with stinging tentacles emerging at night to feed" },
      { label: "Zooxanthellae", description: "Symbiotic algae within tissue providing 90% of energy via photosynthesis" },
    ],
  },
  {
    slug: "brain-coral",
    commonName: "Brain Coral",
    scientificName: "Diploria strigosa",
    scientificTaxonId: "5189757",
    type: "coral",
    conservationStatus: "NT",
    populationTrend: "decreasing",
    description:
      "Brain coral gets its name from its distinctive grooved surface that resembles a human brain. These massive, slow-growing corals can live for hundreds of years and form the foundation of many Caribbean reefs. Their spherical shape helps them withstand strong waves, and their grooves provide habitat for small reef creatures.",
    habitat:
      "Shallow to moderate depth reefs (1–50 meters) in the Caribbean, Florida, and Bahamas. Prefer reef slopes and lagoons with moderate water flow.",
    diet: "Symbiotic zooxanthellae provide most nutrition; also captures plankton with tentacles at night.",
    lifespan: "900+ years for large colonies",
    weight: "N/A (colonial organism)",
    length: "Colonies up to 6 feet in diameter",
    threats: ["Coral bleaching", "Ocean acidification", "Disease", "Physical damage from anchors and divers"],
    funFacts: [
      "Brain corals can live over 900 years—among the longest-lived animals on Earth.",
      "Their grooves create a maze-like pattern that gives them their name.",
      "They grow only about 0.3–1 inch per year.",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Favites_abdita.jpg/640px-Favites_abdita.jpg",
        alt: "Brain coral with grooved surface",
        credit: "Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(5000000, "decreasing", 5000002),
    oceanRegions: ["Caribbean Sea", "Atlantic Ocean"],
    coordinates: { lat: 18.4, lng: -64.9 },
    wikipediaSlug: "Brain_coral",
    iucnUrl: "",
    gbifUrl: "https://www.gbif.org/species/5189757",
    obisUrl: "https://obis.org/taxon/289827",
    estimatedPopulation: "Declining",
    sketchfabId: "109f3290b9304b8fa9802ccd73656b34",
    anatomy: [
      { label: "Meandroid Pattern", description: "Labyrinthine grooves resembling brain convolutions" },
      { label: "Corallites", description: "Shared walls between polyps creating the maze-like surface" },
      { label: "Mucus Layer", description: "Protective mucus coating that traps sediment and repels pathogens" },
    ],
  },
  {
    slug: "elkhorn-coral",
    commonName: "Elkhorn Coral",
    scientificName: "Acropora palmata",
    scientificTaxonId: "5069871",
    type: "coral",
    conservationStatus: "CR",
    populationTrend: "decreasing",
    description:
      "Elkhorn coral is a major reef-building species in the Caribbean, with thick branches that resemble elk antlers. It grows in shallow, wave-exposed areas and provides critical habitat and shoreline protection. Like staghorn coral, it has suffered catastrophic declines from disease and bleaching—Caribbean populations have dropped over 90%.",
    habitat:
      "Shallow, wave-exposed reef crests (1–5 meters) in the Caribbean and Florida Keys. Requires strong wave action and high light. Forms the reef framework in many areas.",
    diet: "Zooxanthellae provide most nutrition; captures plankton. Requires clear, sunlit waters.",
    lifespan: "Colonies can live centuries",
    weight: "N/A (colonial organism)",
    length: "Branches 2–6 inches thick, colonies up to 12 feet across",
    threats: ["White band disease", "Coral bleaching", "Ocean acidification", "Hurricanes", "Overfishing"],
    funFacts: [
      "Elkhorn coral was once the dominant reef builder in the Caribbean.",
      "Its thick branches can reduce wave energy by 97%, protecting coastlines.",
      "Caribbean populations have declined over 90% since 1980.",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Elkhorn_coral.jpg/640px-Elkhorn_coral.jpg",
        alt: "Elkhorn coral reef",
        credit: "Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(2000000, "decreasing", 2000001),
    oceanRegions: ["Caribbean Sea", "Atlantic Ocean"],
    coordinates: { lat: 18.2, lng: -65.5 },
    wikipediaSlug: "Elkhorn_coral",
    iucnUrl: "",
    gbifUrl: "https://www.gbif.org/species/5069871",
    obisUrl: "https://obis.org/taxon/288227",
    estimatedPopulation: "Critically reduced",
    sketchfabId: "b980e641e2464bd3a4d031c89709a3fd",
    anatomy: [
      { label: "Flattened Branches", description: "Broad, palmate branches resembling elk antlers" },
      { label: "Axial Corallites", description: "Polyps at branch tips driving rapid upward growth" },
      { label: "Fragmentation", description: "Branches break and reattach to propagate new colonies" },
    ],
  },
  {
    slug: "giant-kelp",
    commonName: "Giant Kelp",
    scientificName: "Macrocystis pyrifera",
    scientificTaxonId: "2595795",
    type: "plant",
    conservationStatus: "LC",
    populationTrend: "decreasing",
    description:
      "Giant kelp is the largest marine alga and one of the fastest-growing organisms on Earth, growing up to 2 feet per day. These underwater forests provide habitat for thousands of species and are among the most productive ecosystems on the planet. Kelp forests support commercial fisheries and sequester significant amounts of carbon.",
    habitat:
      "Cold, nutrient-rich waters of the Pacific coast from Alaska to Baja California, and in Chile, South Africa, and Australia. Attaches to rocky substrate at depths of 2–30 meters. Requires clear water and strong currents.",
    diet: "Photosynthetic; absorbs nutrients from water through blades and stem.",
    lifespan: "7 years for individual plants",
    weight: "N/A",
    length: "Up to 175 feet (53 m) from holdfast to tip",
    threats: ["Ocean warming", "Sea urchin overgrazing", "Pollution", "Coastal development", "Invasive species"],
    funFacts: [
      "Giant kelp can grow up to 2 feet per day—among the fastest-growing organisms.",
      "Kelp forests support over 800 species of marine life.",
      "They can grow from the seafloor to the surface, creating a dense underwater canopy.",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Giantkelp2_300.jpg/640px-Giantkelp2_300.jpg",
        alt: "Giant kelp forest underwater",
        credit: "NOAA / Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(10000000, "decreasing", 10000002),
    oceanRegions: ["Pacific Ocean", "Southern Ocean"],
    coordinates: { lat: 34.4, lng: -119.7 },
    wikipediaSlug: "Macrocystis_pyrifera",
    iucnUrl: "",
    gbifUrl: "https://www.gbif.org/species/2595795",
    obisUrl: "https://obis.org/taxon/232231",
    estimatedPopulation: "Abundant but declining",
    sketchfabId: "c9b5ef07047a4b7a90a4ffd6930ec22c",
    anatomy: [
      { label: "Holdfast", description: "Root-like anchor attaching to rocky substrate (no nutrient absorption)" },
      { label: "Pneumatocysts", description: "Gas-filled bladders at blade bases providing buoyancy toward sunlight" },
      { label: "Stipe", description: "Flexible stem-like structure connecting holdfast to canopy" },
      { label: "Blades", description: "Leaf-like photosynthetic surfaces along the stipe" },
    ],
  },
  {
    slug: "posidonia-oceanica",
    commonName: "Posidonia Oceanica",
    scientificName: "Posidonia oceanica",
    scientificTaxonId: "5329170",
    type: "plant",
    conservationStatus: "VU",
    populationTrend: "decreasing",
    description:
      "Posidonia oceanica, or Neptune grass, is a seagrass endemic to the Mediterranean Sea. It forms extensive underwater meadows that are among the oldest living organisms on Earth—some clones are over 100,000 years old. These meadows produce oxygen, sequester carbon, and provide nursery habitat for countless marine species.",
    habitat:
      "Exclusively in the Mediterranean Sea. Forms meadows in shallow, clear waters from the surface to 40 meters depth. Prefers sandy or muddy substrates with good light penetration.",
    diet: "Photosynthetic; absorbs nutrients from sediment and water through roots and leaves.",
    lifespan: "Individual shoots: years. Clonal colonies: up to 100,000+ years",
    weight: "N/A",
    length: "Leaves 20–50 cm; rhizomes extend for kilometers",
    threats: ["Coastal development", "Anchoring", "Pollution", "Climate change", "Invasive species (Caulerpa)"],
    funFacts: [
      "Some Posidonia meadows are over 100,000 years old—among the oldest living organisms.",
      "Mediterranean seagrass meadows produce up to 20 liters of oxygen per square meter daily.",
      "The 'balls' that wash up on Mediterranean beaches are made of Posidonia fibers.",
    ],
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Posidonia_oceanica_%28L%29.jpg/640px-Posidonia_oceanica_%28L%29.jpg",
        alt: "Posidonia oceanica seagrass meadow",
        credit: "Wikimedia Commons",
      },
    ],
    populationData: generatePopulationData(5000000, "decreasing", 5000003),
    oceanRegions: ["Mediterranean Sea"],
    coordinates: { lat: 36.9, lng: 14.5 },
    wikipediaSlug: "Posidonia_oceanica",
    iucnUrl: "",
    gbifUrl: "https://www.gbif.org/species/5329170",
    obisUrl: "https://obis.org/taxon/145794",
    estimatedPopulation: "Declining",
    sketchfabId: "a6974b091f00458fa798ef2b7d632237",
    anatomy: [
      { label: "Rhizome Network", description: "Horizontal underground stems forming dense meadow mats" },
      { label: "Leaf Blades", description: "Ribbon-like leaves up to 1m long growing in clusters" },
      { label: "Matte", description: "Centuries-old interlocking root mat that stabilizes sediment" },
      { label: "Flowers & Fruits", description: "Produces small olive-like fruits called 'sea olives' in autumn" },
    ],
  },
];

export function getSpeciesBySlug(slug: string): Species | undefined {
  return species.find((s) => s.slug === slug);
}
