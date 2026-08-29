import {
  Activity,
  AlertTriangle,
  Droplets,
  MapPinned,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import RegionTable from "../components/RegionTable";

const API_URL = "http://localhost:8000/api/regions";

function Regions() {
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
      console.error("Error fetching regional overview:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  const summary = useMemo(() => {
    const high = regions.filter(
      (region) => region.risk_level?.toLowerCase() === "high"
    ).length;

    const medium = regions.filter(
      (region) => region.risk_level?.toLowerCase() === "medium"
    ).length;

    const low = regions.filter(
      (region) => region.risk_level?.toLowerCase() === "low"
    ).length;

    const population = regions.reduce(
      (total, region) => total + (region.population_estimate || 0),
      0
    );

    const averageRisk =
      regions.length > 0
        ? regions.reduce(
            (total, region) =>
              total +
              (region.risk_score_breakdown?.risk_score || 0),
            0
          ) / regions.length
        : 0;

    return {
      high,
      medium,
      low,
      population,
      averageRisk: Math.round(averageRisk * 100),
    };
  }, [regions]);

  const formatPopulation = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }

    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }

    return value.toLocaleString();
  };

  return (
    <main className="min-h-screen bg-slate-50 p-5 sm:p-6 lg:p-8">
      {/* Page header */}
      <section className="mb-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />

              <p className="text-[11px] font-extrabold uppercase tracking-[1.8px] text-blue-600">
                REGIONAL INTELLIGENCE
              </p>
            </div>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Monitored Regions
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Monitor flood conditions, compare regional risk levels, and
              identify communities that may require early intervention.
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
            Refresh data
          </button>
        </div>
      </section>

      {/* Overview cards */}
      {!error && (
        <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <MapPinned size={19} />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Coverage
              </span>
            </div>

            <p className="mt-5 text-3xl font-extrabold text-slate-900">
              {loading ? "—" : regions.length}
            </p>

            <p className="mt-1 text-xs font-semibold text-slate-500">
              Monitored regions
            </p>
          </article>

          <article className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <AlertTriangle size={19} />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wide text-red-400">
                Immediate attention
              </span>
            </div>

            <p className="mt-5 text-3xl font-extrabold text-slate-900">
              {loading ? "—" : summary.high}
            </p>

            <p className="mt-1 text-xs font-semibold text-slate-500">
              High-risk regions
            </p>
          </article>

          <article className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Droplets size={19} />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wide text-orange-400">
                Watch closely
              </span>
            </div>

            <p className="mt-5 text-3xl font-extrabold text-slate-900">
              {loading ? "—" : summary.medium}
            </p>

            <p className="mt-1 text-xs font-semibold text-slate-500">
              Medium-risk regions
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Users size={19} />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Population
              </span>
            </div>

            <p className="mt-5 text-3xl font-extrabold text-slate-900">
              {loading ? "—" : formatPopulation(summary.population)}
            </p>

            <p className="mt-1 text-xs font-semibold text-slate-500">
              Estimated population covered
            </p>
          </article>
        </section>
      )}

      {/* Intelligence summary */}
      {!loading && !error && regions.length > 0 && (
        <section className="mb-7 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-white shadow-sm">
          <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <Activity size={20} />
              </div>

              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[1.5px] text-blue-600">
                  REGIONAL INTELLIGENCE
                </p>

                <h2 className="mt-1 text-lg font-extrabold text-slate-800">
                  Current network risk
                </h2>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                  The network is currently monitoring{" "}
                  <strong className="text-slate-700">
                    {regions.length} regions
                  </strong>
                  , with{" "}
                  <strong className="text-red-600">
                    {summary.high} high-risk
                  </strong>{" "}
                  and{" "}
                  <strong className="text-orange-600">
                    {summary.medium} medium-risk
                  </strong>{" "}
                  locations requiring closer attention.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
              <ShieldCheck className="text-blue-600" size={19} />

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Average risk score
                </p>

                <p className="mt-0.5 text-xl font-extrabold text-slate-800">
                  {summary.averageRisk}
                  <span className="ml-1 text-xs font-semibold text-slate-400">
                    /100
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Error state */}
      {error && (
        <section className="mb-7 rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertTriangle size={21} />
          </div>

          <h2 className="mt-4 text-sm font-extrabold text-slate-800">
            Regional data unavailable
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Make sure the FastAPI backend is running on localhost:8000.
          </p>

          <button
            type="button"
            onClick={fetchRegions}
            className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
          >
            Try again
          </button>
        </section>
      )}

      {/* Existing live regional table */}
      <RegionTable />
    </main>
  );
}

export default Regions;