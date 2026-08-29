import {
  Activity,
  AlertTriangle,
  Layers,
  MapPin,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import RiskMap from "../components/RiskMap";

const API_URL = "http://localhost:8000/api/regions";

function LiveFloodMap() {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
      console.error("Error loading flood map data:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  const statistics = useMemo(() => {
    const high = regions.filter(
      (region) => region.risk_level?.toLowerCase() === "high"
    ).length;

    const medium = regions.filter(
      (region) => region.risk_level?.toLowerCase() === "medium"
    ).length;

    const low = regions.filter(
      (region) => region.risk_level?.toLowerCase() === "low"
    ).length;

    return {
      total: regions.length,
      high,
      medium,
      low,
    };
  }, [regions]);

  const getRegionName = (locationName, country) => {
    if (!locationName) return "Unknown region";

    if (country && locationName.endsWith(`, ${country}`)) {
      return locationName.replace(`, ${country}`, "");
    }

    return locationName.split(",")[0].trim();
  };

  const getRiskScore = (region) => {
    const score =
      region.risk_score ??
      region.risk_score_breakdown?.risk_score ??
      0;

    if (typeof score !== "number") return 0;

    return score <= 1 ? Math.round(score * 100) : Math.round(score);
  };

  const getRiskStyles = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case "high":
        return {
          badge: "bg-red-50 text-red-600",
          dot: "bg-red-500",
          bar: "bg-red-500",
        };

      case "medium":
        return {
          badge: "bg-orange-50 text-orange-600",
          dot: "bg-orange-500",
          bar: "bg-orange-500",
        };

      case "low":
        return {
          badge: "bg-emerald-50 text-emerald-600",
          dot: "bg-emerald-500",
          bar: "bg-emerald-500",
        };

      default:
        return {
          badge: "bg-slate-100 text-slate-500",
          dot: "bg-slate-400",
          bar: "bg-slate-400",
        };
    }
  };

  return (
    <main className="min-h-full bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />

              <p className="text-[10px] font-extrabold uppercase tracking-[1.7px] text-blue-600">
                LIVE MONITORING
              </p>
            </div>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Live Flood Map
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Real-time flood risk monitoring across the AfriShield network.
              Explore regional conditions and identify areas requiring
              immediate attention.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchRegions}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50 lg:self-auto"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            Refresh map
          </button>
        </div>

        {/* Status Banner */}
        <div className="mt-7 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
              <Activity size={18} />
            </div>

            <div>
              <p className="text-sm font-extrabold text-slate-800">
                Live monitoring network
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Regional flood risk information is being monitored across the
                AfriShield network.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Monitoring active
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Layers size={18} />
              </div>

              <span className="text-[10px] font-bold uppercase text-blue-500">
                Network
              </span>
            </div>

            <p className="mt-4 text-2xl font-extrabold text-slate-900">
              {statistics.total}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Monitored regions
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <AlertTriangle size={18} />
              </div>

              <span className="text-[10px] font-bold uppercase text-red-500">
                Priority
              </span>
            </div>

            <p className="mt-4 text-2xl font-extrabold text-slate-900">
              {statistics.high}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              High-risk regions
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <TrendingUp size={18} />
              </div>

              <span className="text-[10px] font-bold uppercase text-orange-500">
                Watch
              </span>
            </div>

            <p className="mt-4 text-2xl font-extrabold text-slate-900">
              {statistics.medium}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Medium-risk regions
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck size={18} />
              </div>

              <span className="text-[10px] font-bold uppercase text-emerald-500">
                Stable
              </span>
            </div>

            <p className="mt-4 text-2xl font-extrabold text-slate-900">
              {statistics.low}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Low-risk regions
            </p>
          </div>
        </div>

        {/* Map */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <MapPin size={18} />
              </div>

              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[1.4px] text-blue-600">
                  REGIONAL INTELLIGENCE
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                  Africa Flood Risk Map
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Live geographic view of monitored flood conditions.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                High
              </span>

              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                Medium
              </span>

              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Low
              </span>
            </div>
          </div>

          <div className="min-h-[500px]">
            {loading ? (
              <div className="flex min-h-[500px] items-center justify-center">
                <RefreshCw
                  size={24}
                  className="animate-spin text-blue-500"
                />
              </div>
            ) : error ? (
              <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
                <AlertTriangle size={26} className="text-red-500" />

                <p className="mt-3 text-sm font-bold text-slate-700">
                  Map data unavailable
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Unable to retrieve the latest regional monitoring data.
                </p>

                <button
                  type="button"
                  onClick={fetchRegions}
                  className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
                >
                  Try again
                </button>
              </div>
            ) : (
              <RiskMap regions={regions} onRefresh={fetchRegions} />
            )}
          </div>
        </section>

        {/* Regional Monitoring List */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[1.4px] text-blue-600">
              MONITORED LOCATIONS
            </p>

            <h2 className="mt-1 text-xl font-extrabold text-slate-900">
              Regional Risk Status
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Current flood risk conditions across monitored regions.
            </p>
          </div>

          {!loading && !error && (
            <div className="divide-y divide-slate-100">
              {regions.map((region, index) => {
                const riskLevel = region.risk_level || "Unknown";
                const score = getRiskScore(region);
                const styles = getRiskStyles(riskLevel);

                return (
                  <div
                    key={`${region.location_name}-${index}`}
                    className="p-5 transition hover:bg-slate-50"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                          <MapPin size={17} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-extrabold text-slate-800">
                            {getRegionName(
                              region.location_name,
                              region.country
                            )}
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-400">
                            {region.country || "Unknown country"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-5">
                        <div className="hidden text-right sm:block">
                          <p className="text-[10px] font-semibold text-slate-400">
                            Risk score
                          </p>

                          <p className="mt-1 text-sm font-extrabold text-slate-800">
                            {score}/100
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1.5 text-[9px] font-extrabold uppercase ${styles.badge}`}
                        >
                          {riskLevel}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${styles.bar}`}
                        style={{
                          width: `${Math.min(score, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div className="flex items-center justify-between px-1 py-6 text-[10px] text-slate-400">
          <span>AfriShield Live Flood Monitoring</span>

          <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Live monitoring active
          </span>
        </div>
      </section>
    </main>
  );
}

export default LiveFloodMap;