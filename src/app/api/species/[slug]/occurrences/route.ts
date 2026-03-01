import { NextResponse } from "next/server";
import { getSpeciesBySlug } from "@/data/species";

const OBIS_BASE = "https://api.obis.org/v3/occurrence";

export const revalidate = 3600;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json(
        { error: "Species slug is required", points: [] },
        { status: 400 }
      );
    }

    const species = getSpeciesBySlug(slug);
    if (!species) {
      return NextResponse.json(
        { error: "Species not found", points: [] },
        { status: 404 }
      );
    }

    const scientificName = encodeURIComponent(species.scientificName);
    const url = `${OBIS_BASE}?scientificname=${scientificName}&size=200&fields=decimalLatitude,decimalLongitude,eventDate,datasetName`;

    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ points: [] });
    }

    const data = (await res.json()) as {
      results?: Array<{
        decimalLatitude?: number;
        decimalLongitude?: number;
        eventDate?: string;
        datasetName?: string;
      }>;
    };

    const results = data.results ?? [];
    const points = results
      .filter(
        (r) =>
          typeof r.decimalLatitude === "number" &&
          typeof r.decimalLongitude === "number"
      )
      .map((r) => ({
        lat: r.decimalLatitude as number,
        lng: r.decimalLongitude as number,
        date: r.eventDate ?? null,
        dataset: r.datasetName ?? null,
      }));

    return NextResponse.json({ points });
  } catch {
    return NextResponse.json({ points: [] });
  }
}
