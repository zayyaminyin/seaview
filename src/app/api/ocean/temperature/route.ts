import { NextResponse } from "next/server";

/**
 * NOAA global ocean temperature anomaly data (degrees C above 20th century average).
 * Source: NOAA National Centers for Environmental Information
 */
const OCEAN_TEMP_ANOMALY: Record<number, number> = {
  2000: 0.04,
  2001: 0.03,
  2002: 0.08,
  2003: 0.11,
  2004: 0.08,
  2005: 0.1,
  2006: 0.07,
  2007: 0.07,
  2008: 0.02,
  2009: 0.1,
  2010: 0.13,
  2011: 0.06,
  2012: 0.09,
  2013: 0.11,
  2014: 0.16,
  2015: 0.22,
  2016: 0.22,
  2017: 0.17,
  2018: 0.14,
  2019: 0.19,
  2020: 0.22,
  2021: 0.17,
  2022: 0.19,
  2023: 0.31,
  2024: 0.43,
  2025: 0.38,
};

export async function GET() {
  try {
    const data = Object.entries(OCEAN_TEMP_ANOMALY)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([year, anomaly]) => ({
        year: Number(year),
        anomaly,
      }));

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
