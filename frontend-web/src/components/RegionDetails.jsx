import {
  X,
  MapPin,
  ShieldAlert,
  Activity,
  CloudRain,
  ArrowUpRight,
  Clock3,
} from "lucide-react";

function RegionDetails({ region, onClose }) {
  if (!region) return null;

  const isHigh = region.riskLevel === "High";
  const isMedium = region.riskLevel === "Medium";

  const riskColor = isHigh
    ? "red"
    : isMedium
      ? "orange"
      : "emerald";

  const riskText = isHigh
    ? "text-red-600"
    : isMedium
      ? "text-orange-600"
      : "text-emerald-600";

  const riskBg = isHigh
    ? "bg-red-50"
    : isMedium
      ? "bg-orange-50"
      : "bg-emerald-50";

  const riskBar = isHigh
    ? "bg-red-500"
    : isMedium
      ? "bg-orange-500"
      : "bg-emerald-500";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Side panel */}
      <aside
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={`${region.name} region details`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 px-6 py-5 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${riskBg} text-xl`}
              >
                {region.flag}
              </div>

              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[1.5px] text-blue-600">
                  REGION DETAILS
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-slate-800">
                  {region.name}
                </h2>

                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin size={13} />
                  {region.country}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close region details"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={19} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-6">

          {/* Risk summary */}
          <div className={`rounded-2xl ${riskBg} p-5`}>
            <div className="flex items-start justify-between gap-4">

              <div>
                <div className="flex items-center gap-2">
                  <ShieldAlert size={18} className={riskText} />

                  <span
                    className={`text-xs font-extrabold uppercase tracking-wide ${riskText}`}
                  >
                    {region.riskLevel} RISK
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Current flood-risk assessment for this monitored region.
                </p>
              </div>

              <div className="text-right">
                <p className={`text-3xl font-black ${riskText}`}>
                  {region.riskScore}
                </p>

                <p className="text-[10px] font-semibold text-slate-400">
                  /100 risk score
                </p>
              </div>
            </div>

            {/* Risk progress */}
            <div className="mt-5">
              <div className="mb-2 flex justify-between text-[10px] font-bold text-slate-400">
                <span>Risk intensity</span>
                <span>{region.riskScore}%</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/80">
                <div
                  className={`h-full rounded-full ${riskBar} transition-all duration-700`}
                  style={{
                    width: `${Math.min(
                      Number(region.riskScore) || 0,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Key information */}
          <div className="mt-6">
            <h3 className="text-sm font-extrabold text-slate-800">
              Current conditions
            </h3>

            <div className="mt-3 grid grid-cols-2 gap-3">

              {/* Hazard */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <CloudRain size={16} />
                </div>

                <p className="mt-3 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Hazard
                </p>

                <p className="mt-1 text-sm font-bold text-slate-700">
                  {region.hazard}
                </p>
              </div>

              {/* Trend */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <ArrowUpRight size={16} />
                </div>

                <p className="mt-3 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Trend
                </p>

                <p className="mt-1 text-sm font-bold text-slate-700">
                  {region.status}
                </p>
              </div>

            </div>
          </div>

          {/* Monitoring status */}
          <div className="mt-6 rounded-xl border border-slate-100 p-4">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Activity size={17} />
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-700">
                    Monitoring status
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-400">
                    AfriShield monitoring network
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>

                <span className="text-[10px] font-bold text-emerald-700">
                  Active
                </span>
              </div>

            </div>

          </div>

          {/* Last updated */}
          <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-400">
            <Clock3 size={13} />
            Last assessment from monitoring network
          </div>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-slate-100 bg-white px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-700/20 active:scale-[0.98]"
          >
            Close Region Details
          </button>
        </div>
      </aside>
    </>
  );
}

export default RegionDetails;