import {
  Activity,
  BrainCircuit,
  CloudRain,
  Droplets,
  RefreshCw,
  ShieldAlert,
  TrendingUp,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:8000/api/regions";

function Analytics() {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchRegions = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch analytics data");
      }

      const data = await response.json();

      setRegions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  const getRulesScore = (region) => {
    const score = region.risk_score_breakdown?.risk_score;

    if (typeof score !== "number") return 0;

    return score <= 1 ? score * 100 : score;
  };

  const getMLScore = (region) => {
    const score = region.ml_risk_score;

    if (typeof score !== "number") return 0;

    return score <= 1 ? score * 100 : score;
  };

  const getRiskClass = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case "high":
        return {
          text: "text-red-600",
          bg: "bg-red-500",
          soft: "bg-red-50",
        };

      case "medium":
        return {
          text: "text-orange-600",
          bg: "bg-orange-500",
          soft: "bg-orange-50",
        };

      default:
        return {
          text: "text-emerald-600",
          bg: "bg-emerald-500",
          soft: "bg-emerald-50",
        };
    }
  };

  const formatPopulation = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }

    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }

    return value.toLocaleString();
  };

  const analytics = useMemo(() => {
    if (!regions.length) {
      return {
        averageRisk: 0,
        averageRainfall: 0,
        averageRiverLevel: 0,
        totalPopulation: 0,
        highestRisk: null,
        rankedRegions: [],
        rulesAverage: 0,
        mlAverage: 0,
        highRainfallRegion: null,
        highestRiverRegion: null,
      };
    }

    const rankedRegions = [...regions]
      .map((region) => ({
        ...region,
        rulesScore: getRulesScore(region),
        mlScore: getMLScore(region),
      }))
      .sort((a, b) => b.rulesScore - a.rulesScore);

    const totalPopulation = regions.reduce(
      (total, region) => total + (region.population_estimate || 0),
      0
    );

    const averageRisk =
      rankedRegions.reduce(
        (total, region) => total + region.rulesScore,
        0
      ) / rankedRegions.length;

    const averageRainfall =
      regions.reduce(
        (total, region) => total + (region.rainfall_mm_24h || 0),
        0
      ) / regions.length;

    const averageRiverLevel =
      regions.reduce(
        (total, region) => total + (region.river_level_m || 0),
        0
      ) / regions.length;

    const rulesAverage =
      rankedRegions.reduce(
        (total, region) => total + region.rulesScore,
        0
      ) / rankedRegions.length;

    const mlAverage =
      rankedRegions.reduce(
        (total, region) => total + region.mlScore,
        0
      ) / rankedRegions.length;

    const highRainfallRegion = [...regions].sort(
      (a, b) =>
        (b.rainfall_mm_24h || 0) - (a.rainfall_mm_24h || 0)
    )[0];

    const highestRiverRegion = [...regions].sort(
      (a, b) =>
        (b.river_level_m || 0) - (a.river_level_m || 0)
    )[0];

    return {
      averageRisk: Math.round(averageRisk),
      averageRainfall: Math.round(averageRainfall),
      averageRiverLevel: averageRiverLevel.toFixed(1),
      totalPopulation,
      highestRisk: rankedRegions[0],
      rankedRegions,
      rulesAverage: Math.round(rulesAverage),
      mlAverage: Math.round(mlAverage),
      highRainfallRegion,
      highestRiverRegion,
    };
  }, [regions]);

  return (
    <main className="min-h-screen bg-slate-50 p-5 sm:p-6 lg:p-8">
      {/* Header */}
      <section className="mb-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />

              <p className="text-[11px] font-extrabold uppercase tracking-[1.8px] text-blue-600">
                FLOOD INTELLIGENCE
              </p>
            </div>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Regional Analytics
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Analyze flood risk, environmental indicators, and model
              predictions across the AfriShield monitoring network.
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
            Refresh analytics
          </button>
        </div>
      </section>

      {/* Error */}
      {error && (
        <section className="rounded-2xl border border-red-100 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
            <ShieldAlert size={21} />
          </div>

          <h2 className="mt-4 text-sm font-extrabold text-slate-800">
            Analytics data unavailable
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Make sure the FastAPI backend is running on localhost:8000.
          </p>

          <button
            type="button"
            onClick={fetchRegions}
            className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
          >
            Try again
          </button>
        </section>
      )}

      {/* Loading */}
      {loading && !error && (
        <section className="flex min-h-[500px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

            <p className="text-sm font-semibold text-slate-500">
              Analyzing regional data...
            </p>
          </div>
        </section>
      )}

      {/* Analytics */}
      {!loading && !error && regions.length > 0 && (
        <>
          {/* Key metrics */}
          <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Activity size={19} />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Network
                </span>
              </div>

              <p className="mt-5 text-3xl font-extrabold text-slate-900">
                {analytics.averageRisk}
                <span className="ml-1 text-sm font-semibold text-slate-400">
                  /100
                </span>
              </p>

              <p className="mt-1 text-xs font-semibold text-slate-500">
                Average regional risk
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <CloudRain size={19} />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Environment
                </span>
              </div>

              <p className="mt-5 text-3xl font-extrabold text-slate-900">
                {analytics.averageRainfall}
                <span className="ml-1 text-sm font-semibold text-slate-400">
                  mm
                </span>
              </p>

              <p className="mt-1 text-xs font-semibold text-slate-500">
                Average 24-hour rainfall
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                  <Droplets size={19} />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Hydrology
                </span>
              </div>

              <p className="mt-5 text-3xl font-extrabold text-slate-900">
                {analytics.averageRiverLevel}
                <span className="ml-1 text-sm font-semibold text-slate-400">
                  m
                </span>
              </p>

              <p className="mt-1 text-xs font-semibold text-slate-500">
                Average river level
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Users size={19} />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Coverage
                </span>
              </div>

              <p className="mt-5 text-3xl font-extrabold text-slate-900">
                {formatPopulation(analytics.totalPopulation)}
              </p>

              <p className="mt-1 text-xs font-semibold text-slate-500">
                Estimated population covered
              </p>
            </article>
          </section>

          {/* Decision insight */}
          {analytics.highestRisk && (
            <section className="mb-7 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 text-white shadow-sm">
              <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <TrendingUp size={22} />
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[1.5px] text-blue-100">
                      PRIORITY INSIGHT
                    </p>

                    <h2 className="mt-1 text-xl font-extrabold">
                      {analytics.highestRisk.location_name}
                    </h2>

                    <p className="mt-2 max-w-2xl text-xs leading-5 text-blue-100">
                      This region currently has the highest rules-based
                      flood risk score in the monitored network and should
                      receive priority attention for early-warning
                      assessment.
                    </p>
                  </div>
                </div>

                <div className="shrink-0 rounded-xl bg-white/10 px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-blue-100">
                    Risk score
                  </p>

                  <p className="mt-1 text-3xl font-extrabold">
                    {Math.round(analytics.highestRisk.rulesScore)}
                    <span className="ml-1 text-sm text-blue-100">
                      /100
                    </span>
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Main analytics grid */}
          <section className="grid gap-6 xl:grid-cols-2">
            {/* Regional ranking */}
            <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-5">
                <p className="text-[10px] font-extrabold uppercase tracking-[1.5px] text-blue-600">
                  REGIONAL COMPARISON
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-800">
                  Risk Ranking
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Regions ranked by rules-based flood risk score.
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {analytics.rankedRegions.map((region, index) => {
                  const risk = getRiskClass(region.risk_level);

                  return (
                    <div
                      key={`${region.location_name}-${index}`}
                      className="px-5 py-4 transition hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-extrabold text-slate-500">
                          {index + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="truncate text-sm font-bold text-slate-700">
                                {region.location_name}
                              </p>

                              <p className="mt-0.5 text-[10px] text-slate-400">
                                {region.country}
                              </p>
                            </div>

                            <div className="text-right">
                              <p className={`text-sm font-extrabold ${risk.text}`}>
                                {Math.round(region.rulesScore)}
                              </p>

                              <p className="text-[9px] font-semibold text-slate-400">
                                /100
                              </p>
                            </div>
                          </div>

                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full ${risk.bg}`}
                              style={{
                                width: `${Math.min(
                                  region.rulesScore,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            {/* Environmental indicators */}
            <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-5">
                <p className="text-[10px] font-extrabold uppercase tracking-[1.5px] text-blue-600">
                  ENVIRONMENTAL SIGNALS
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-800">
                  Flood Indicators
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Key physical indicators influencing regional risk.
                </p>
              </div>

              <div className="space-y-6 p-5">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-700">
                        Rainfall intensity
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        Highest 24-hour rainfall
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-extrabold text-slate-800">
                        {analytics.highRainfallRegion?.rainfall_mm_24h || 0}
                        <span className="ml-1 text-xs font-semibold text-slate-400">
                          mm
                        </span>
                      </p>

                      <p className="text-[10px] text-slate-400">
                        {analytics.highRainfallRegion?.location_name}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{
                        width: `${Math.min(
                          ((analytics.highRainfallRegion?.rainfall_mm_24h ||
                            0) /
                            100) *
                            100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-700">
                        River level
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        Highest recorded monitored level
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-extrabold text-slate-800">
                        {analytics.highestRiverRegion?.river_level_m || 0}
                        <span className="ml-1 text-xs font-semibold text-slate-400">
                          m
                        </span>
                      </p>

                      <p className="text-[10px] text-slate-400">
                        {analytics.highestRiverRegion?.location_name}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-cyan-500"
                      style={{
                        width: `${Math.min(
                          ((analytics.highestRiverRegion?.river_level_m ||
                            0) /
                            4) *
                            100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <CloudRain
                      size={17}
                      className="mt-0.5 text-blue-600"
                    />

                    <div>
                      <p className="text-xs font-bold text-slate-700">
                        Highest rainfall signal
                      </p>

                      <p className="mt-1 text-[10px] leading-5 text-slate-500">
                        {analytics.highRainfallRegion?.location_name} is
                        currently reporting the highest 24-hour rainfall
                        among monitored regions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* AI model comparison */}
            <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
              <div className="border-b border-slate-100 px-5 py-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[1.5px] text-blue-600">
                      AI DECISION SUPPORT
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-slate-800">
                      Risk Model Comparison
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                      Compare the rules-based risk engine with the machine
                      learning model.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-[10px] font-bold text-blue-600">
                    <BrainCircuit size={15} />
                    Dual-model assessment
                  </div>
                </div>
              </div>

              <div className="grid gap-5 p-5 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-700">
                        Rules-based model
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        Average network score
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-slate-800">
                        {analytics.rulesAverage}
                      </p>

                      <p className="text-[10px] text-slate-400">
                        /100
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{
                        width: `${analytics.rulesAverage}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-700">
                        Machine learning model
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        Average network prediction
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-slate-800">
                        {analytics.mlAverage}
                      </p>

                      <p className="text-[10px] text-slate-400">
                        /100
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{
                        width: `${analytics.mlAverage}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4">
                <div className="flex items-start gap-3">
                  <BrainCircuit
                    size={16}
                    className="mt-0.5 text-blue-600"
                  />

                  <p className="text-[11px] leading-5 text-slate-500">
                    AfriShield combines a rules-based risk assessment with
                    a machine-learning second opinion to provide additional
                    decision support when evaluating flood conditions.
                  </p>
                </div>
              </div>
            </article>
          </section>
        </>
      )}
    </main>
  );
}

export default Analytics;