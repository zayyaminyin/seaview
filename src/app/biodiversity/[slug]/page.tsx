import { notFound } from "next/navigation";
import Link from "next/link";
import {
  species,
  getSpeciesBySlug,
  conservationStatusInfo,
  type SpeciesType,
} from "@/data/species";
import { ConservationBadge } from "@/components/species/ConservationBadge";
import { SpeciesVisuals } from "@/components/species/SpeciesVisuals";
import { OccurrenceMap } from "@/components/species/OccurrenceMap";
import { ExternalLinks } from "@/components/ui/ExternalLinks";
import { ThreatMeter } from "@/components/ui/ThreatMeter";
import { Sparkline } from "@/components/ui/Sparkline";
import { TaxonomyBadge } from "@/components/ui/TaxonomyBadge";
import { Model3DViewer } from "@/components/species/Model3DViewer";
import { ChevronRight, MapPin, TrendingUp, TrendingDown, Minus } from "lucide-react";

const typeLabels: Record<SpeciesType, string> = {
  mammal: "MAMMAL",
  fish: "FISH",
  invertebrate: "INVERTEBRATE",
  plant: "PLANT",
  coral: "CORAL",
  reptile: "REPTILE",
  bird: "BIRD",
};

const trendConfig = {
  increasing: { Icon: TrendingUp, label: "↑ Increasing", color: "text-[#1565a0]" },
  decreasing: { Icon: TrendingDown, label: "↓ Decreasing", color: "text-[#c62828]" },
  stable: { Icon: Minus, label: "— Stable", color: "text-[#607d8b]" },
  unknown: { Icon: Minus, label: "? Unknown", color: "text-[#666]" },
};

const taxonomyMap: Record<string, { kingdom: string; phylum: string; order?: string }> = {
  mammal: { kingdom: "Animalia", phylum: "Chordata", order: "Mammalia" },
  fish: { kingdom: "Animalia", phylum: "Chordata", order: "Actinopterygii" },
  reptile: { kingdom: "Animalia", phylum: "Chordata", order: "Reptilia" },
  bird: { kingdom: "Animalia", phylum: "Chordata", order: "Aves" },
  invertebrate: { kingdom: "Animalia", phylum: "Mollusca" },
  coral: { kingdom: "Animalia", phylum: "Cnidaria" },
  plant: { kingdom: "Plantae", phylum: "Tracheophyta" },
};

export async function generateStaticParams() {
  return species.map((s) => ({ slug: s.slug }));
}

export default async function SpeciesDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const speciesData = getSpeciesBySlug(slug);

  if (!speciesData) {
    notFound();
  }

  const statusInfo = conservationStatusInfo[speciesData.conservationStatus];
  const trendCfg = trendConfig[speciesData.populationTrend];
  const TrendIcon = trendCfg.Icon;

  const relatedSpecies = species
    .filter((s) => s.type === speciesData.type && s.slug !== speciesData.slug)
    .slice(0, 4);

  const mainImage = speciesData.images[0];
  const { lat, lng } = speciesData.coordinates;
  const latStr = lat >= 0 ? `${lat.toFixed(1)}°N` : `${Math.abs(lat).toFixed(1)}°S`;
  const lngStr = lng >= 0 ? `${lng.toFixed(1)}°E` : `${Math.abs(lng).toFixed(1)}°W`;

  return (
    <div
      className="grid gap-1 p-1 bg-[#f4f5f7]"
      style={{
        height: "calc(100vh - 40px)",
        overflow: "hidden",
        gridTemplateRows: "32px 1fr 1fr",
        gridTemplateColumns: "2fr 1fr 1fr 1fr",
      }}
    >
      {/* TOP BAR */}
      <div
        className="col-span-4 flex items-center justify-between px-2 bg-white border border-[#ddd] rounded"
        style={{ minHeight: 32 }}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <Link
            href="/biodiversity"
            className="text-[10px] text-[#666] hover:text-[#1565a0] whitespace-nowrap"
          >
            ← Species
          </Link>
          <ChevronRight className="w-3 h-3 text-[#999] flex-shrink-0" />
          <span className="font-bold text-[14px] text-black truncate">
            {speciesData.commonName}
          </span>
          <span className="text-[11px] italic text-[#666] truncate hidden sm:inline">
            {speciesData.scientificName}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <ConservationBadge status={speciesData.conservationStatus} size="sm" />
          <span className={`pill ${trendCfg.color}`}>{trendCfg.label}</span>
          <span className="pill bg-[#f0f0f0] text-[#555]">
            {typeLabels[speciesData.type]}
          </span>
          <ExternalLinks
            wikipediaSlug={speciesData.wikipediaSlug}
            iucnUrl={speciesData.iucnUrl}
            gbifUrl={speciesData.gbifUrl}
            obisUrl={speciesData.obisUrl}
            compact
          />
        </div>
      </div>

      {/* ROW 1: 3D Model / Photo | Key Facts | Conservation | Notes */}
      {/* Panel 1: 3D Specimen Viewer */}
      <div className="panel overflow-hidden" style={{ gridColumn: "span 1" }}>
        <Model3DViewer
          sketchfabId={speciesData.sketchfabId}
          fallbackImageUrl={mainImage?.url}
          fallbackImageAlt={mainImage?.alt}
          fallbackImageCredit={mainImage?.credit}
          speciesName={speciesData.commonName}
          anatomy={speciesData.anatomy}
        />
      </div>

      {/* Panel 2: Key Facts */}
      <div className="panel" style={{ gridColumn: "span 1" }}>
        <div className="panel-header">KEY FACTS</div>
        <div className="panel-body">
          <div className="kv-row">
            <span className="kv-label">Type</span>
            <span className="kv-value">{typeLabels[speciesData.type]}</span>
          </div>
          <div className="kv-row">
            <span className="kv-label">Habitat</span>
            <span className="kv-value line-clamp-1">{speciesData.habitat}</span>
          </div>
          <div className="kv-row">
            <span className="kv-label">Diet</span>
            <span className="kv-value line-clamp-1">{speciesData.diet}</span>
          </div>
          <div className="kv-row">
            <span className="kv-label">Lifespan</span>
            <span className="kv-value">{speciesData.lifespan}</span>
          </div>
          <div className="kv-row">
            <span className="kv-label">Weight</span>
            <span className="kv-value">{speciesData.weight}</span>
          </div>
          <div className="kv-row">
            <span className="kv-label">Length</span>
            <span className="kv-value">{speciesData.length}</span>
          </div>
          <p className="text-[9px] font-bold uppercase text-[#777] mt-2 mb-1">Description</p>
          <p className="text-[11px] text-[#333] leading-tight line-clamp-4">
            {speciesData.description}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[8px] font-bold uppercase text-[#888]">25yr Trend</span>
            <Sparkline
              data={speciesData.populationData.map((d) => d.estimate)}
              width={100}
              height={20}
              strokeColor={speciesData.populationTrend === "decreasing" ? "#c62828" : speciesData.populationTrend === "increasing" ? "#1565a0" : "#607d8b"}
              fillColor={speciesData.populationTrend === "decreasing" ? "#c62828" : speciesData.populationTrend === "increasing" ? "#1565a0" : "#607d8b"}
            />
          </div>
        </div>
      </div>

      {/* Panel 3: Conservation Status */}
      <div className="panel" style={{ gridColumn: "span 1" }}>
        <div className="panel-header">⚠ CONSERVATION STATUS</div>
        <div className="panel-body">
          <ConservationBadge status={speciesData.conservationStatus} size="md" className="mb-2" />
          <p className="text-[11px] text-[#555] leading-tight line-clamp-2 mb-2">
            {statusInfo.description}
          </p>
          <hr className="border-t border-[#e0e0e0] my-2" />
          <ThreatMeter status={speciesData.conservationStatus} threats={speciesData.threats} className="mb-2" />
          <p className="text-[9px] font-bold uppercase text-[#777] mb-1">Threats</p>
          <div className="flex flex-wrap gap-1">
            {speciesData.threats.map((threat) => (
              <span key={threat} className="tag tag-danger">
                {threat}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendIcon className={`w-3.5 h-3.5 ${trendCfg.color}`} strokeWidth={2} />
            <span className={`text-[10px] font-medium ${trendCfg.color}`}>
              {trendCfg.label}
            </span>
          </div>
        </div>
      </div>

      {/* Panel 4: Notes & Facts */}
      <div className="panel" style={{ gridColumn: "span 1" }}>
        <div className="panel-header">NOTES</div>
        <div className="panel-body">
          <TaxonomyBadge
            kingdom={taxonomyMap[speciesData.type]?.kingdom}
            phylum={taxonomyMap[speciesData.type]?.phylum}
            order={taxonomyMap[speciesData.type]?.order}
            genus={speciesData.scientificName.split(" ")[0]}
            species={speciesData.scientificName}
            className="mb-2"
          />
          <ol className="space-y-1 list-decimal list-inside text-[10px] text-[#333] leading-tight">
            {speciesData.funFacts.map((fact, i) => (
              <li key={i}>{fact}</li>
            ))}
          </ol>
        </div>
      </div>

      {/* ROW 2: Multi-Visual Dashboard | Distribution | Related */}
      {/* Panel 5: Species Analytics (replaces single pop chart) */}
      <div className="panel overflow-hidden" style={{ gridColumn: "span 2" }}>
        <div className="panel-header">📊 ANALYTICS</div>
        <div className="panel-body-flush flex-1 min-h-0">
          <SpeciesVisuals species={speciesData} relatedSpecies={relatedSpecies} />
        </div>
      </div>

      {/* Panel 6: Distribution (OBIS Map) */}
      <div className="panel flex flex-col min-h-0" style={{ gridColumn: "span 1" }}>
        <div className="panel-header">🗺 DISTRIBUTION (OBIS)</div>
        <div className="panel-body-flush flex-1 min-h-0 flex flex-col">
          <OccurrenceMap
            slug={speciesData.slug}
            center={speciesData.coordinates}
            commonName={speciesData.commonName}
            className="flex-1 min-h-[180px] w-full"
          />
          <div className="flex flex-wrap gap-1 px-2 py-1.5 border-t border-[#e0e0e0] bg-[#fafafa]">
            {speciesData.oceanRegions.map((region) => (
              <span key={region} className="pill text-[9px] bg-[#e8e8e8] text-[#555]">
                {region}
              </span>
            ))}
            <span className="text-[9px] font-mono text-[#666] ml-auto">
              {latStr} {lngStr}
            </span>
          </div>
        </div>
      </div>

      {/* Panel 7: Related Species — vertical list */}
      <div className="panel flex flex-col min-h-0" style={{ gridColumn: "span 1" }}>
        <div className="panel-header">RELATED SPECIES</div>
        <div className="panel-body overflow-y-auto flex flex-col gap-1.5 p-1.5">
          {relatedSpecies.map((s) => (
            <Link
              key={s.slug}
              href={`/biodiversity/${s.slug}`}
            >
              <div className="flex items-center gap-2 border border-[#e0e0e0] rounded p-1.5 bg-white hover:border-[#1565a0] hover:bg-[#f8fbff] transition-colors">
                <div className="relative w-10 h-10 flex-shrink-0 overflow-hidden rounded">
                  <img
                    src={s.images[0]?.url ?? ""}
                    alt={s.commonName}
                    className="w-10 h-10 object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-black truncate">
                    {s.commonName}
                  </p>
                  <p className="text-[8px] italic text-[#999] truncate">
                    {s.scientificName}
                  </p>
                </div>
                <ConservationBadge
                  status={s.conservationStatus}
                  size="sm"
                  showLabel={false}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
