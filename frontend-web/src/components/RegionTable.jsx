import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  MapPin,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import RegionDetails from "./RegionDetails";

const API_URL = "http://localhost:8000/api/regions";

function RegionTable() {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Selected region for the details panel
  const [selectedRegion, setSelectedRegion] = useState(null);

  const fetchRegions = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch regional data");
      }

      const data = await response.json();

      setRegions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching regions:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  // Convert backend risk score to 0–100
  const getRiskScore = (score) => {
    if (typeof score !== "number") return 0;

    if (score <= 1) {
      return Math.round(score * 100);
    }

    return Math.round(score);
  };

  const getRiskClass = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case "high":
        return "bg-red-50 text-red-600 border-red-100";

      case "medium":
        return "bg-orange-50 text-orange-600 border-orange-100";

      case "low":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";

      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const getRiskIconClass = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case "high":
        return "bg-red-50 text-red-600";

      case "medium":
        return "bg-orange-50 text-orange-600";

      case "low":
        return "bg-emerald-50 text-emerald-600";

      default:
        return "bg-slate-50 text-slate-500";
    }
  };

  const getStatusIcon = (status) => {
    if (status === "Rising") {
      return <ArrowUpRight size={15} />;
    }

    if (status === "Falling") {
      return <ArrowDownRight size={15} />;
    }

    return <Minus size={15} />;
  };

  const getStatusClass = (status) => {
    if (status === "Rising") {
      return "text-red-500 bg-red-50";
    }

    if (status === "Falling") {
      return "text-emerald-500 bg-emerald-50";
    }

    return "text-slate-500 bg-slate-50";
  };

  // Backend does not currently provide status
  const getStatus = () => {
    return "Monitoring";
  };

  const getRegionName = (locationName, country) => {
    if (!locationName) return "Unknown Region";

    if (country && locationName.endsWith(`, ${country}`)) {
      return locationName.replace(`, ${country}`, "");
    }

    return locationName.split(",")[0].trim();
  };

  const getHazard = (region) => {
    if (
      typeof region.rainfall_mm_24h === "number" &&
      region.rainfall_mm_24h >= 50
    ) {
      return "Heavy Rain";
    }

    if (
      typeof region.river_level_m === "number" &&
      region.river_level_m >= 3
    ) {
      return "Flood";
    }

    return "Flood";
  };

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[1.5px] text-teal-600">
              REGIONAL MONITORING
            </p>

            <div className="mt-1 flex items-center gap-3">
              <h3 className="text-xl font-bold text-slate-800">
                Monitored Regions
              </h3>

              {!loading && !error && (
                <span className="rounded-full bg-teal-50 px-3 py-1 text-[10px] font-bold text-teal-600">
                  {regions.length} regions
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-slate-400">
              Live flood risk information from the AfriShield network.
            </p>
          </div>

          {/* Refresh */}
          <button
            onClick={fetchRegions}
            disabled={loading}
            title="Refresh regional data"
            className="flex h-9 w-9 items-center justify-center self-end rounded-lg border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-teal-500" />

              <p className="text-sm font-semibold text-slate-500">
                Loading regional data...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex min-h-[300px] items-center justify-center px-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                <AlertTriangle size={20} />
              </div>

              <h4 className="mt-4 text-sm font-bold text-slate-700">
                Regional data unavailable
              </h4>

              <p className="mt-1 text-xs text-slate-400">
                Unable to load regional data.
              </p>

              <button
                onClick={fetchRegions}
                className="mt-4 rounded-lg bg-teal-600 px-5 py-2 text-xs font-bold text-white transition hover:bg-teal-700"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && regions.length === 0 && (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-sm font-semibold text-slate-400">
              No regions available.
            </p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && regions.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-6 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Region
                  </th>

                  <th className="px-5 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Hazard
                  </th>

                  <th className="px-5 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Risk Score
                  </th>

                  <th className="px-5 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Risk Level
                  </th>

                  <th className="px-5 py-4 text-left text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {regions.map((region, index) => {
                  const riskLevel = region.risk_level || "low";

                  /*
                   * Use the backend's rules-based risk score.
                   * Some responses may provide it directly as risk_score,
                   * while others may provide it inside risk_score_breakdown.
                   */
                  const backendRiskScore =
                    region.risk_score ??
                    region.risk_score_breakdown?.risk_score ??
                    null;

                  const riskScore = getRiskScore(backendRiskScore);

                  const status = getStatus(region);

                  return (
                    <tr
                      key={`${region.location_name}-${index}`}
                      onClick={() => setSelectedRegion(region)}
                      className="group cursor-pointer border-b border-slate-100 transition-all duration-200 last:border-0 hover:bg-teal-50/40"
                    >
                      {/* Region */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105 ${getRiskIconClass(
                              riskLevel
                            )}`}
                          >
                            <MapPin size={16} />
                          </div>

                          <div>
                            <p className="text-sm font-bold text-slate-700">
                              {getRegionName(
                                region.location_name,
                                region.country
                              )}
                            </p>

                            <p className="mt-0.5 text-[11px] text-slate-400">
                              {region.country}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Hazard */}
                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-slate-600">
                          {getHazard(region)}
                        </span>

                        <p className="mt-0.5 text-[10px] text-slate-400">
                          {region.rainfall_mm_24h ?? 0} mm rainfall
                        </p>
                      </td>

                      {/* Risk Score */}
                      <td className="px-5 py-4">
                        <div className="flex items-baseline gap-1">
                          <strong className="text-base font-extrabold text-slate-800">
                            {riskScore}
                          </strong>

                          <span className="text-[10px] font-medium text-slate-400">
                            /100
                          </span>
                        </div>

                        <div className="mt-2 h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              riskLevel.toLowerCase() === "high"
                                ? "bg-red-500"
                                : riskLevel.toLowerCase() === "medium"
                                ? "bg-orange-500"
                                : "bg-emerald-500"
                            }`}
                            style={{
                              width: `${Math.min(riskScore, 100)}%`,
                            }}
                          />
                        </div>
                      </td>

                      {/* Risk Level */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1.5 text-[10px] font-extrabold uppercase ${getRiskClass(
                            riskLevel
                          )}`}
                        >
                          {riskLevel}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <div
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-bold ${getStatusClass(
                            status
                          )}`}
                        >
                          {getStatusIcon(status)}
                          <span>{status}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Existing Region Details panel */}
      {selectedRegion && (
        <RegionDetails
          region={selectedRegion}
          onClose={() => setSelectedRegion(null)}
        />
      )}
    </>
  );
}

export default RegionTable;