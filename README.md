# Seaview — Ocean Discovery Platform

A compact, data-dense web platform for exploring marine biodiversity, tracking conservation status, and monitoring ocean health. Built with a scientific visual dictionary aesthetic — every page fits in a single viewport with no scrolling required.

![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8) ![Recharts](https://img.shields.io/badge/Recharts-2-8884d8) ![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900)

## Features

- **Biodiversity Catalog** — 32 curated marine species with IUCN conservation status, population trends, estimated populations, and inline sparkline charts
- **Interactive 3D Specimen Viewer** — Every species has a Sketchfab-embedded 3D model you can rotate, zoom, and pan, with a body anatomy reference panel
- **Species Analytics** — Multi-chart dashboard per species: population trend, risk profile radar, threat impact bars, 5-year averages, and population comparison donut
- **Ocean Health Dashboard** — NOAA temperature anomalies, conservation status breakdowns, year-over-year delta indicators, and semi-circular status gauges
- **Global Biodiversity Map** — Leaflet map with Esri ocean basemap showing all species and ocean regions, colored by conservation status
- **Real Data Sources** — OBIS occurrence data, GBIF taxonomy, NOAA temperature anomalies, IUCN Red List classifications, and Wikimedia Commons images

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS 4 + custom CSS panel system |
| Charts | Recharts (area, bar, pie, radar) + SVG sparklines |
| Maps | Leaflet + react-leaflet with Esri ocean tiles |
| 3D Models | Sketchfab embeds (32 models) |
| Icons | Lucide React |
| Images | Wikimedia Commons (unoptimized, direct fetch) |

## Getting Started

```bash
# Install dependencies
npm install --ignore-scripts

# Start development server
npm run dev
# or, if your path has spaces/special characters:
node node_modules/next/dist/bin/next dev

# Build for production
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Landing — KPI strip, species table, global map, conservation gauge
│   ├── layout.tsx                # Root layout with Navbar
│   ├── globals.css               # Global styles, panel system, custom utilities
│   ├── biodiversity/
│   │   ├── page.tsx              # Filterable species catalog with search, status filters
│   │   └── [slug]/page.tsx       # Species detail — 3D viewer, facts, analytics, distribution map
│   ├── dashboard/page.tsx        # Ocean health dashboard with real NOAA data
│   ├── explore/page.tsx          # Full-screen interactive map explorer
│   └── api/
│       ├── ocean/temperature/    # NOAA temperature anomaly data
│       └── species/[slug]/
│           ├── info/             # GBIF taxonomy proxy
│           └── occurrences/      # OBIS occurrence data proxy
│
├── components/
│   ├── species/
│   │   ├── Model3DViewer.tsx     # Sketchfab 3D embed + anatomy panel
│   │   ├── SpeciesVisuals.tsx    # Multi-chart analytics dashboard
│   │   ├── PopulationChart.tsx   # Recharts area chart
│   │   ├── OccurrenceMap.tsx     # OBIS occurrence map
│   │   ├── ConservationBadge.tsx # IUCN status badge
│   │   └── SpeciesCard.tsx       # Species grid card
│   ├── dashboard/
│   │   ├── HomeMap.tsx           # Landing page map (species + regions)
│   │   ├── OceanRegionsMap.tsx   # Region marker map
│   │   ├── TrendLineChart.tsx    # Dashboard line charts
│   │   └── StatusDonutChart.tsx  # Conservation status donut
│   ├── maps/
│   │   ├── LeafletMap.tsx        # Dynamic import wrapper (SSR-safe)
│   │   └── LeafletMapInner.tsx   # Core Leaflet component
│   └── ui/
│       ├── Sparkline.tsx         # Inline SVG sparkline
│       ├── StatusGauge.tsx       # Semi-circular percentage gauge
│       ├── ThreatMeter.tsx       # Conservation status spectrum indicator
│       ├── TaxonomyBadge.tsx     # Taxonomic hierarchy breadcrumb
│       ├── ExternalLinks.tsx     # Wikipedia/IUCN/GBIF/OBIS link badges
│       └── ComingSoon.tsx        # Placeholder for future pages
│
├── data/
│   ├── species.ts                # 32 species with full data, Sketchfab IDs, anatomy
│   ├── oceanRegions.ts           # 10 ocean regions with coordinates
│   └── statistics.ts             # Real NOAA ocean health data (2000–2025)
│
└── lib/
    └── utils.ts                  # Utility functions (cn, formatNumber, etc.)
```

## Species Coverage

32 marine species across 6 taxonomic groups and all 7 IUCN conservation categories:

| Group | Species |
|---|---|
| Mammals | Blue Whale, Humpback Whale, Vaquita, North Atlantic Right Whale, Caribbean Monk Seal, Sea Otter, Hawaiian Monk Seal, Dugong, West Indian Manatee |
| Sharks & Rays | Great White Shark, Whale Shark, Hammerhead Shark, Manta Ray |
| Fish | Bluefin Tuna, Clownfish, Seahorse, Lionfish, Leafy Seadragon, Coelacanth, European Sturgeon |
| Amphibians | Axolotl |
| Reptiles | Green Sea Turtle, Hawksbill Turtle, Leatherback Turtle |
| Invertebrates | Giant Pacific Octopus, Blue-Ringed Octopus, Nautilus |
| Corals | Staghorn Coral, Brain Coral, Elkhorn Coral |
| Plants | Giant Kelp, Posidonia oceanica |

## Data Sources

- [IUCN Red List](https://www.iucnredlist.org/) — Conservation status classifications
- [OBIS](https://obis.org/) — Ocean Biodiversity Information System occurrence data
- [GBIF](https://www.gbif.org/) — Global Biodiversity Information Facility taxonomy
- [NOAA](https://www.noaa.gov/) — Global ocean temperature anomaly data
- [Wikimedia Commons](https://commons.wikimedia.org/) — Species photographs
- [Sketchfab](https://sketchfab.com/) — 3D specimen models (Creative Commons licensed)

## License

MIT
