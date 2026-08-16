import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import { useCallback, useEffect, useState } from "react";

const API_URL = "http://localhost:8000/api/regions";

const icons = {
  High: AlertTriangle,
  Medium: ShieldAlert,
  Low: ShieldCheck,
};

const styles = {
  High: {
    color: "bg-red-500",
    text: "text-red-600",
    ring: "stroke-red-500",
  },

  Medium: {
    color: "bg-orange-500",
    text: "text-orange-600",
    ring: "stroke-orange-500",
  },

  Low: {
    color: "bg-emerald-500",
    text: "text-emerald-600",
    ring: "stroke-emerald-500",
  },
};

function RiskDistribution() {
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
      console.error("Error fetching risk distribution:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  /*
    Count regions according to the backend risk_level.
  */
  const riskData = [
    {
      label: "High",
      value: regions.filter(
        (region) =>
          region.risk_level?.toLowerCase() === "high"
      ).length,
      ...styles.High,
    },

    {
      label: "Medium",
      value: regions.filter(
        (region) =>
          region.risk_level?.toLowerCase() === "medium"
      ).length,
      ...styles.Medium,
    },

    {
      label: "Low",
      value: regions.filter(
        (region) =>
          region.risk_level?.toLowerCase() === "low"
      ).length,
      ...styles.Low,
    },
  ];

  const total = regions.length;

  const circumference = 2 * Math.PI * 44;

  const highPercentage =
    total > 0 ? (riskData[0].value / total) * 100 : 0;

  const mediumPercentage =
    total > 0 ? (riskData[1].value / total) * 100 : 0;

  const lowPercentage =
    total > 0 ? (riskData[2].value / total) * 100 : 0;

  const highDash =
    (highPercentage / 100) * circumference;

  const mediumDash =
    (mediumPercentage / 100) * circumference;

  const lowDash =
    (lowPercentage / 100) * circumference;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[1.4px] text-blue-600">
            CURRENT SITUATION
          </p>

          <h3 className="mt-1 text-xl font-bold text-slate-800">
            Risk Distribution
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Current flood risk across monitored regions
          </p>
        </div>

        {/* Refresh */}
        <button
          type="button"
          onClick={fetchRegions}
          disabled={loading}
          title="Refresh risk distribution"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={15}
            className={loading ? "animate-spin" : ""}
          />
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex min-h-[250px] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />

            <p className="text-xs font-semibold text-slate-500">
              Loading risk distribution...
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex min-h-[250px] items-center justify-center">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-500">
              <AlertCircle size={19} />
            </div>

            <p className="mt-3 text-sm font-bold text-slate-700">
              Risk data unavailable
            </p>

            <button
              type="button"
              onClick={fetchRegions}
              className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Chart */}
      {!loading && !error && (
        <>
          <div className="flex items-center gap-6 px-5 py-6">
            {/* Donut */}
            <div className="relative h-36 w-36 shrink-0">
              <svg
                viewBox="0 0 120 120"
                className="h-full w-full -rotate-90"
              >
                {/* Background */}
                <circle
                  cx="60"
                  cy="60"
                  r="44"
                  fill="none"
                  strokeWidth="13"
                  className="stroke-slate-100"
                />

                {/* High */}
                {riskData[0].value > 0 && (
                  <circle
                    cx="60"
                    cy="60"
                    r="44"
                    fill="none"
                    strokeWidth="13"
                    strokeLinecap="round"
                    className="stroke-red-500"
                    strokeDasharray={`${highDash} ${circumference}`}
                    strokeDashoffset="0"
                  />
                )}

                {/* Medium */}
                {riskData[1].value > 0 && (
                  <circle
                    cx="60"
                    cy="60"
                    r="44"
                    fill="none"
                    strokeWidth="13"
                    strokeLinecap="round"
                    className="stroke-orange-500"
                    strokeDasharray={`${mediumDash} ${circumference}`}
                    strokeDashoffset={`-${highDash}`}
                  />
                )}

                {/* Low */}
                {riskData[2].value > 0 && (
                  <circle
                    cx="60"
                    cy="60"
                    r="44"
                    fill="none"
                    strokeWidth="13"
                    strokeLinecap="round"
                    className="stroke-emerald-500"
                    strokeDasharray={`${lowDash} ${circumference}`}
                    strokeDashoffset={`-${
                      highDash + mediumDash
                    }`}
                  />
                )}
              </svg>

              {/* Center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold tracking-tight text-slate-800">
                  {total}
                </span>

                <span className="text-[10px] font-semibold text-slate-400">
                  Regions
                </span>
              </div>
            </div>

            {/* Breakdown */}
            <div className="min-w-0 flex-1 space-y-4">
              {riskData.map((item) => {
                const Icon = icons[item.label];

                const percentage =
                  total > 0
                    ? Math.round(
                        (item.value / total) * 100
                      )
                    : 0;

                return (
                  <div
                    key={item.label}
                    className="group flex items-center justify-between rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.color} bg-opacity-10 ${item.text}`}
                      >
                        <Icon size={16} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-700">
                          {item.label}
                        </p>

                        <p className="text-[10px] text-slate-400">
                          {percentage}% of regions
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-lg font-extrabold ${item.text}`}
                    >
                      {item.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-400">
                Flood risk overview
              </span>

              <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                Monitoring active
              </span>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default RiskDistribution;