import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Globe2,
} from "lucide-react";

import StatCard from "./StatCard";
import { dashboardStats } from "../data/mockData";

function RiskOverview() {
  return (
    <section className="mt-6">

      {/* Section heading */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[1.8px] text-teal-600">
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

          Live monitoring

        </div>

      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="High Risk"
          value={dashboardStats.highRisk}
          description="Regions requiring attention"
          icon={AlertTriangle}
          variant="high"
          trend="+2 today"
          trendDirection="up"
        />

        <StatCard
          title="Medium Risk"
          value={dashboardStats.mediumRisk}
          description="Regions under monitoring"
          icon={ShieldAlert}
          variant="medium"
          trend="+1 today"
          trendDirection="up"
        />

        <StatCard
          title="Low Risk"
          value={dashboardStats.lowRisk}
          description="Regions currently stable"
          icon={ShieldCheck}
          variant="low"
          trend="Stable"
          trendDirection="stable"
        />

        <StatCard
          title="Countries Monitored"
          value={dashboardStats.countriesMonitored}
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