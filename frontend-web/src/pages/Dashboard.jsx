import RiskOverview from "../components/RiskOverview";
import RiskMap from "../components/RiskMap";
import RiskDistribution from "../components/RiskDistribution";
import RecentAlerts from "../components/RecentAlerts";
import RegionTable from "../components/RegionTable";

function Dashboard() {
  return (
    <main className="px-6 py- lg:px-8">

      {/* Dashboard Header */}
      <section className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

        {/* Title */}
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500" />

            <p className="text-[11px] font-extrabold uppercase tracking-[1.8px] text-blue-600">
              FLOOD INTELLIGENCE
            </p>
          </div>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
            Flood Risk Overview
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Real-time regional flood intelligence and early-warning
            monitoring across Africa.
          </p>
        </div>

        {/* System status */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />

            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
          </span>

          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
              System status
            </p>

            <p className="text-xs font-bold text-slate-700">
              Monitoring active
            </p>
          </div>

        </div>

      </section>

      {/* Risk Overview */}
      <RiskOverview />

      {/* Map + Risk Distribution */}
      <section className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(350px,0.9fr)]">

        {/* Flood Risk Map */}
        <RiskMap />

        {/* Risk Distribution */}
        <RiskDistribution />

      </section>

      {/* Recent Flood Alerts */}
      <section className="mt-7">
        <RecentAlerts />
      </section>

      {/* Regional Monitoring */}
      <section className="mt-7">
        <RegionTable />
      </section>

    </main>
  );
}

export default Dashboard;