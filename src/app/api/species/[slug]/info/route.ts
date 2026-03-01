import { NextResponse } from "next/server";
import { getSpeciesBySlug } from "@/data/species";

const GBIF_MATCH_URL = "https://api.gbif.org/v1/species/match";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json(
        { error: "Species slug is required" },
        { status: 400 }
      );
    }

    const species = getSpeciesBySlug(slug);
    if (!species) {
      return NextResponse.json(
        { error: "Species not found" },
        { status: 404 }
      );
    }

    const scientificName = encodeURIComponent(species.scientificName);
    const url = `${GBIF_MATCH_URL}?name=${scientificName}`;

    const res = await fetch(url, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch species info from GBIF" },
        { status: 502 }
      );
    }

    const data = (await res.json()) as {
      usageKey?: number;
      kingdom?: string;
      phylum?: string;
      class?: string;
      order?: string;
      family?: string;
      genus?: string;
      species?: string;
      status?: string;
      iucnRedListCategory?: string;
    };

    return NextResponse.json({
      gbifKey: data.usageKey ?? null,
      kingdom: data.kingdom ?? null,
      phylum: data.phylum ?? null,
      class: data.class ?? null,
      order: data.order ?? null,
      family: data.family ?? null,
      genus: data.genus ?? null,
      species: data.species ?? null,
      status: data.status ?? null,
      iucnRedListCategory: data.iucnRedListCategory ?? null,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
