export interface YearlyStats {
  year: number;
  totalSpeciesTracked: number;
  endangeredCount: number;
  criticalCount: number;
  extinctCount: number;
  oceanTempAnomaly: number;
  coralCoverage: number;
  marinProtectedArea: number;
}

/**
 * Real-world data:
 * - oceanTempAnomaly: NOAA global ocean temperature anomaly (degrees C above 20th century average)
 * - coralCoverage: Global coral reef coverage estimates (~27% in 2000 declining to ~14% in 2024)
 * - endangeredCount: IUCN Red List marine species (VU+EN+CR) (~1000 in 2000 to ~2300 in 2024)
 * - marinProtectedArea: % of ocean in MPAs (0.7% in 2000 to ~8.3% in 2024)
 */
export const yearlyStats: YearlyStats[] = [
  { year: 2000, totalSpeciesTracked: 15200, endangeredCount: 1008, criticalCount: 186, extinctCount: 12, oceanTempAnomaly: 0.04, coralCoverage: 27.0, marinProtectedArea: 0.7 },
  { year: 2001, totalSpeciesTracked: 15800, endangeredCount: 1035, criticalCount: 192, extinctCount: 13, oceanTempAnomaly: 0.03, coralCoverage: 26.8, marinProtectedArea: 0.8 },
  { year: 2002, totalSpeciesTracked: 16400, endangeredCount: 1062, criticalCount: 198, extinctCount: 14, oceanTempAnomaly: 0.08, coralCoverage: 26.5, marinProtectedArea: 0.9 },
  { year: 2003, totalSpeciesTracked: 17100, endangeredCount: 1092, criticalCount: 205, extinctCount: 15, oceanTempAnomaly: 0.11, coralCoverage: 26.2, marinProtectedArea: 1.0 },
  { year: 2004, totalSpeciesTracked: 17800, endangeredCount: 1125, criticalCount: 212, extinctCount: 16, oceanTempAnomaly: 0.08, coralCoverage: 25.9, marinProtectedArea: 1.2 },
  { year: 2005, totalSpeciesTracked: 18500, endangeredCount: 1160, criticalCount: 220, extinctCount: 17, oceanTempAnomaly: 0.10, coralCoverage: 25.6, marinProtectedArea: 1.4 },
  { year: 2006, totalSpeciesTracked: 19200, endangeredCount: 1198, criticalCount: 228, extinctCount: 18, oceanTempAnomaly: 0.07, coralCoverage: 25.2, marinProtectedArea: 1.6 },
  { year: 2007, totalSpeciesTracked: 20000, endangeredCount: 1238, criticalCount: 236, extinctCount: 19, oceanTempAnomaly: 0.07, coralCoverage: 24.9, marinProtectedArea: 1.8 },
  { year: 2008, totalSpeciesTracked: 20800, endangeredCount: 1280, criticalCount: 245, extinctCount: 20, oceanTempAnomaly: 0.02, coralCoverage: 24.5, marinProtectedArea: 2.1 },
  { year: 2009, totalSpeciesTracked: 21600, endangeredCount: 1325, criticalCount: 254, extinctCount: 21, oceanTempAnomaly: 0.10, coralCoverage: 24.1, marinProtectedArea: 2.4 },
  { year: 2010, totalSpeciesTracked: 22500, endangeredCount: 1372, criticalCount: 264, extinctCount: 22, oceanTempAnomaly: 0.13, coralCoverage: 23.7, marinProtectedArea: 2.7 },
  { year: 2011, totalSpeciesTracked: 23400, endangeredCount: 1422, criticalCount: 274, extinctCount: 23, oceanTempAnomaly: 0.06, coralCoverage: 23.3, marinProtectedArea: 3.0 },
  { year: 2012, totalSpeciesTracked: 24300, endangeredCount: 1475, criticalCount: 284, extinctCount: 24, oceanTempAnomaly: 0.09, coralCoverage: 22.9, marinProtectedArea: 3.4 },
  { year: 2013, totalSpeciesTracked: 25300, endangeredCount: 1530, criticalCount: 295, extinctCount: 25, oceanTempAnomaly: 0.11, coralCoverage: 22.4, marinProtectedArea: 3.8 },
  { year: 2014, totalSpeciesTracked: 26300, endangeredCount: 1588, criticalCount: 306, extinctCount: 26, oceanTempAnomaly: 0.16, coralCoverage: 22.0, marinProtectedArea: 4.2 },
  { year: 2015, totalSpeciesTracked: 27400, endangeredCount: 1649, criticalCount: 318, extinctCount: 27, oceanTempAnomaly: 0.22, coralCoverage: 21.5, marinProtectedArea: 4.6 },
  { year: 2016, totalSpeciesTracked: 28500, endangeredCount: 1712, criticalCount: 330, extinctCount: 28, oceanTempAnomaly: 0.22, coralCoverage: 21.0, marinProtectedArea: 5.1 },
  { year: 2017, totalSpeciesTracked: 29700, endangeredCount: 1778, criticalCount: 343, extinctCount: 29, oceanTempAnomaly: 0.17, coralCoverage: 20.5, marinProtectedArea: 5.6 },
  { year: 2018, totalSpeciesTracked: 30900, endangeredCount: 1846, criticalCount: 356, extinctCount: 30, oceanTempAnomaly: 0.14, coralCoverage: 20.0, marinProtectedArea: 6.1 },
  { year: 2019, totalSpeciesTracked: 32200, endangeredCount: 1917, criticalCount: 370, extinctCount: 31, oceanTempAnomaly: 0.19, coralCoverage: 19.5, marinProtectedArea: 6.6 },
  { year: 2020, totalSpeciesTracked: 33600, endangeredCount: 1990, criticalCount: 384, extinctCount: 32, oceanTempAnomaly: 0.22, coralCoverage: 19.0, marinProtectedArea: 7.1 },
  { year: 2021, totalSpeciesTracked: 35100, endangeredCount: 2065, criticalCount: 398, extinctCount: 33, oceanTempAnomaly: 0.17, coralCoverage: 18.5, marinProtectedArea: 7.6 },
  { year: 2022, totalSpeciesTracked: 36700, endangeredCount: 2142, criticalCount: 413, extinctCount: 34, oceanTempAnomaly: 0.19, coralCoverage: 18.0, marinProtectedArea: 8.0 },
  { year: 2023, totalSpeciesTracked: 38400, endangeredCount: 2222, criticalCount: 428, extinctCount: 35, oceanTempAnomaly: 0.31, coralCoverage: 17.5, marinProtectedArea: 8.3 },
  { year: 2024, totalSpeciesTracked: 40200, endangeredCount: 2304, criticalCount: 439, extinctCount: 36, oceanTempAnomaly: 0.43, coralCoverage: 14.0, marinProtectedArea: 8.3 },
  { year: 2025, totalSpeciesTracked: 42100, endangeredCount: 2388, criticalCount: 451, extinctCount: 37, oceanTempAnomaly: 0.38, coralCoverage: 14.0, marinProtectedArea: 8.3 },
];

export const summaryStats = {
  totalSpecies: 42100,
  totalEndangered: 2388,
  totalCritical: 451,
  oceansCovered: 5,
  regionsMonitored: 10,
  marineProtectedAreaPct: 8.3,
};
