import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Globe2,
  RefreshCw,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import StatCard from "./StatCard";

const API_URL = "http://localhost:8000/api/regions";

function RiskOverview() {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRegions = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch regional data");
      }

      const data = await response.json();

      setRegions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching risk overview:", error);
      setRegions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  // Calculate dashboard statistics from real backend data
  const highRisk = regions.filter(
    (region) => region.risk_level?.toLowerCase() === "high"
  ).length;

  const mediumRisk = regions.filter(
    (region) => region.risk_level?.toLowerCase() === "medium"
  ).length;

  const lowRisk = regions.filter(
    (region) => region.risk_level?.toLowerCase() === "low"
  ).length;

  const countriesMonitored = new Set(
    regions
      .map((region) => region.country)
      .filter(Boolean)
  ).size;

  return (
    <section>
      {/* Section heading */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[1.8px] text-blue-600">
            CURRENT SITUATION
          </p>

          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-800">
            Risk Overview
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Monitoring flood disaster risk across the AfriShield network.
          </p>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>

          {loading ? "Updating..." : "Live monitoring"}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="High Risk"
          value={loading ? "—" : highRisk}
          description="Regions requiring attention"
          icon={AlertTriangle}
          variant="high"
          trend="Live"
          trendDirection="up"
        />

        <StatCard
          title="Medium Risk"
          value={loading ? "—" : mediumRisk}
          description="Regions under monitoring"
          icon={ShieldAlert}
          variant="medium"
          trend="Live"
          trendDirection="up"
        />

        <StatCard
          title="Low Risk"
          value={loading ? "—" : lowRisk}
          description="Regions currently stable"
          icon={ShieldCheck}
          variant="low"
          trend="Live"
          trendDirection="stable"
        />

        <StatCard
          title="Countries Monitored"
          value={loading ? "—" : countriesMonitored}
          description="Across the African network"
          icon={Globe2}
          variant="default"
          trend="Active"
          trendDirection="stable"
        />
      </div>
    </section>
  );
}

export default RiskOverview;