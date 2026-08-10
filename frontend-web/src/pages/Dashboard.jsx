import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import RiskOverview from "../components/RiskOverview";
import RiskMap from "../components/RiskMap";
import RecentAlerts from "../components/RecentAlerts";
import RegionTable from "../components/RegionTable";

function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Sidebar */}
      <Sidebar />

      {/* Main application */}
      <div className="ml-[225px] min-h-screen w-[calc(100%-225px)]">

        {/* Topbar */}
        <Topbar />

        {/* Dashboard content */}
        <main className="px-6 py-7 lg:px-8">

          {/* Welcome */}
          <section className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[1.8px] text-teal-600">
                AFRISHIELD COMMAND CENTER
              </p>

              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
                Good evening, Habiba
                <span className="ml-2">👋</span>
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Monitor emerging disaster risks and coordinate early warnings
                across Africa.
              </p>
            </div>

            {/* Monitoring status */}
            <div className="flex flex-col items-start lg:items-end">

              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Monitoring status
              </span>

              <div className="mt-1 flex items-center gap-2">

                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                </span>

                <span className="text-sm font-bold text-slate-700">
                  Systems operational
                </span>

              </div>

            </div>

          </section>

          {/* Risk Overview */}
          <RiskOverview />

          {/* Map + Alerts */}
          <section className="mt-7 grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(350px,0.9fr)]">

            {/* Flood Risk Map */}
            <RiskMap />

            {/* Recent Alerts */}
            <RecentAlerts />

          </section>

          {/* Regional Monitoring */}
          <section className="mt-7">
            <RegionTable />
          </section>

        </main>

      </div>

    </div>
  );
}

export default Dashboard;