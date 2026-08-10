import {
  Navigation,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers3,
} from "lucide-react";

const regions = [
  {
    id: 1,
    name: "Garissa",
    country: "Kenya",
    risk: "High",
    position: "left-[31%] top-[58%]",
  },
  {
    id: 2,
    name: "Addis Ababa",
    country: "Ethiopia",
    risk: "High",
    position: "left-[48%] top-[50%]",
  },
  {
    id: 3,
    name: "Lagos",
    country: "Nigeria",
    risk: "Medium",
    position: "left-[23%] top-[56%]",
  },
  {
    id: 4,
    name: "Cairo",
    country: "Egypt",
    risk: "Low",
    position: "left-[47%] top-[28%]",
  },
];

const riskStyles = {
  High: {
    marker: "bg-red-500 ring-red-100",
    badge: "bg-red-50 text-red-600",
  },
  Medium: {
    marker: "bg-orange-500 ring-orange-100",
    badge: "bg-orange-50 text-orange-600",
  },
  Low: {
    marker: "bg-emerald-500 ring-emerald-100",
    badge: "bg-emerald-50 text-emerald-600",
  },
};

function RiskMap() {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
            <Navigation size={18} />
          </div>

          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[1.4px] text-teal-600">
              REGIONAL INTELLIGENCE
            </p>

            <h3 className="mt-0.5 text-xl font-bold text-slate-800">
              Africa Flood Risk Map
            </h3>
          </div>

        </div>

        {/* Map controls */}
        <div className="flex items-center gap-2">

          <button
            type="button"
            title="Layers"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600 hover:shadow-sm"
          >
            <Layers3 size={16} />
          </button>

          <button
            type="button"
            title="Zoom in"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600 hover:shadow-sm"
          >
            <ZoomIn size={16} />
          </button>

          <button
            type="button"
            title="Zoom out"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600 hover:shadow-sm"
          >
            <ZoomOut size={16} />
          </button>

          <button
            type="button"
            title="Fullscreen"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600 hover:shadow-sm"
          >
            <Maximize2 size={16} />
          </button>

        </div>
      </div>

      {/* Map */}
      <div className="relative h-[400px] overflow-hidden bg-slate-50 sm:h-[420px]">

        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Decorative Africa silhouette */}
        <div className="absolute left-1/2 top-1/2 h-[330px] w-[280px] -translate-x-1/2 -translate-y-1/2">

          {/* Main Africa shape */}
          <div className="absolute inset-0 rotate-[8deg] rounded-[45%_55%_48%_52%_/_25%_25%_75%_75%] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]" />

          {/* Regional areas */}
          <div className="absolute left-[28%] top-[20%] h-[95px] w-[105px] rotate-[20deg] rounded-[55%_45%_45%_55%] bg-teal-50" />

          <div className="absolute left-[20%] top-[38%] h-[140px] w-[150px] rotate-[10deg] rounded-[45%_55%_55%_45%] bg-teal-50" />

          <div className="absolute left-[34%] top-[61%] h-[130px] w-[115px] rotate-[18deg] rounded-[45%_55%_50%_50%] bg-teal-50" />

          <div className="absolute left-[18%] top-[77%] h-[65px] w-[55px] rotate-[25deg] rounded-full bg-teal-50" />

          {/* Internal geographic lines */}
          <div className="absolute left-[45%] top-[30%] h-[210px] w-px rotate-[18deg] bg-teal-100" />

          <div className="absolute left-[27%] top-[48%] h-px w-[190px] rotate-[5deg] bg-teal-100" />

          <div className="absolute left-[35%] top-[65%] h-px w-[140px] rotate-[20deg] bg-teal-100" />

        </div>

        {/* Network label */}
        <div className="absolute left-5 top-5 rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">

          <div className="flex items-center gap-2">

            <Navigation size={15} className="text-teal-600" />

            <div>
              <p className="text-xs font-bold text-slate-700">
                Africa Monitoring Network
              </p>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Live regional flood intelligence
              </p>
            </div>

          </div>

        </div>

        {/* Region markers */}
        {regions.map((region) => {
          const styles = riskStyles[region.risk];

          return (
            <button
              type="button"
              key={region.id}
              className={`group absolute ${region.position} z-20`}
              title={`${region.name}, ${region.country} — ${region.risk} risk`}
            >

              {/* Marker */}
              <span
                className={`relative flex h-5 w-5 items-center justify-center rounded-full ${styles.marker} ring-8 transition-all duration-200 group-hover:scale-125 group-hover:shadow-lg`}
              >
                <span className="h-2 w-2 rounded-full bg-white" />
              </span>

              {/* Popup */}
              <span className="pointer-events-none absolute bottom-8 left-1/2 hidden w-44 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-3 text-left shadow-xl group-hover:block">

                <span className="block text-xs font-bold text-slate-800">
                  {region.name}
                </span>

                <span className="mt-0.5 block text-[10px] text-slate-400">
                  {region.country}
                </span>

                <span
                  className={`mt-2 inline-block rounded-full px-2 py-1 text-[9px] font-bold ${styles.badge}`}
                >
                  {region.risk} flood risk
                </span>

              </span>

            </button>
          );
        })}

        {/* Zoom controls */}
        <div className="absolute bottom-5 left-5 flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">

          <button
            type="button"
            title="Zoom in"
            className="flex h-9 w-9 items-center justify-center border-b border-slate-100 text-slate-500 transition hover:bg-slate-50 hover:text-teal-600"
          >
            <ZoomIn size={15} />
          </button>

          <button
            type="button"
            title="Zoom out"
            className="flex h-9 w-9 items-center justify-center text-slate-500 transition hover:bg-slate-50 hover:text-teal-600"
          >
            <ZoomOut size={15} />
          </button>

        </div>

        {/* Legend */}
        <div className="absolute bottom-5 right-5 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-md backdrop-blur">

          <p className="mb-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            Flood risk
          </p>

          <div className="space-y-2">

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span className="text-[10px] font-semibold text-slate-600">
                High
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-orange-500" />
              <span className="text-[10px] font-semibold text-slate-600">
                Medium
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-semibold text-slate-600">
                Low
              </span>
            </div>

          </div>

        </div>

        {/* Monitoring status */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-slate-200 bg-white/95 px-4 py-2 shadow-sm backdrop-blur">

          <div className="flex items-center gap-2">

            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

            <span className="text-[10px] font-semibold text-slate-600">
              Monitoring 4 countries
            </span>

          </div>

        </div>

      </div>
    </section>
  );
}

export default RiskMap;