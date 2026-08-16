import {
  X,
  AlertTriangle,
  MapPin,
  Clock,
  Languages,
  ShieldAlert,
} from "lucide-react";

function AlertDetails({ alert, onClose }) {
  if (!alert) return null;

  const isHigh = alert.risk === "High";
  const isArabic = alert.local_language === "Arabic";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Alert panel */}
      <aside
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Flood alert details"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 px-6 py-5 backdrop-blur">
          <div className="flex items-start justify-between gap-4">

            <div className="flex items-center gap-3">

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  isHigh
                    ? "bg-red-50 text-red-600"
                    : "bg-orange-50 text-orange-600"
                }`}
              >
                <AlertTriangle size={22} />
              </div>

              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[1.5px] text-blue-600">
                  EARLY WARNING
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-slate-800">
                  Flood Alert
                </h2>
              </div>

            </div>

            <button
              onClick={onClose}
              aria-label="Close alert details"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={19} />
            </button>

          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-6">

          {/* Severity */}
          <div
            className={`rounded-2xl p-5 ${
              isHigh ? "bg-red-50" : "bg-orange-50"
            }`}
          >
            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-3">

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white ${
                    isHigh ? "text-red-600" : "text-orange-600"
                  }`}
                >
                  <ShieldAlert size={20} />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
                    Severity
                  </p>

                  <p
                    className={`mt-1 text-lg font-black ${
                      isHigh ? "text-red-600" : "text-orange-600"
                    }`}
                  >
                    {alert.risk} Risk
                  </p>
                </div>

              </div>

              <span
                className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase ${
                  isHigh
                    ? "bg-red-100 text-red-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {alert.risk}
              </span>

            </div>
          </div>

          {/* Location */}
          <div className="mt-6">

            <p className="text-[10px] font-extrabold uppercase tracking-[1.3px] text-slate-400">
              Affected location
            </p>

            <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                <MapPin size={18} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-700">
                  {alert.location}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Flood monitoring zone
                </p>
              </div>

            </div>

          </div>

          {/* Alert time */}
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <Clock size={14} />
            Alert received {alert.time}
          </div>

          {/* Local language */}
          <div className="mt-7">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2">

                <Languages size={16} className="text-blue-600" />

                <h3 className="text-sm font-extrabold text-slate-800">
                  Local Warning
                </h3>

              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-extrabold uppercase text-blue-700">
                {alert.local_language}
              </span>

            </div>

            <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50 p-5">

              <p
                dir={isArabic ? "rtl" : "ltr"}
                lang={isArabic ? "ar" : undefined}
                className={`text-base font-semibold leading-7 text-slate-700 ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                {alert.alert_message_local}
              </p>

            </div>

          </div>

          {/* English version */}
          <div className="mt-6">

            <div className="flex items-center gap-2">

              <Languages size={16} className="text-slate-400" />

              <h3 className="text-sm font-extrabold text-slate-800">
                English Translation
              </h3>

            </div>

            <div className="mt-3 rounded-2xl border border-slate-100 bg-white p-5">

              <p className="text-sm leading-6 text-slate-600">
                {alert.alert_message_en}
              </p>

            </div>

          </div>

          {/* System status */}
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">

            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>

            <div>
              <p className="text-xs font-bold text-emerald-700">
                Alert actively monitored
              </p>

              <p className="mt-0.5 text-[10px] text-emerald-600/70">
                AfriShield early warning network
              </p>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-slate-100 bg-white px-6 py-4">

          <button
            onClick={onClose}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-700/20 active:scale-[0.98]"
          >
            Close Alert
          </button>

        </div>
      </aside>
    </>
  );
}

export default AlertDetails;