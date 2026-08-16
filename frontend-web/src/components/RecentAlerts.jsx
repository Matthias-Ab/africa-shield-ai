import {
  AlertTriangle,
  ArrowRight,
  Bell,
  MapPin,
  Clock,
  ChevronRight,
} from "lucide-react";

import { useState } from "react";
import AlertDetails from "./AlertDetails";

const alerts = [
  {
    id: 1,
    location: "Garissa, Kenya",
    risk: "High",
    time: "8 min ago",
    alert_message_en:
      "Heavy rainfall may cause flooding in low-lying areas.",
    alert_message_local:
      "Mvua kubwa inaweza kusababisha mafuriko katika maeneo ya chini.",
    local_language: "Swahili",
  },
  {
    id: 2,
    location: "Addis Ababa, Ethiopia",
    risk: "High",
    time: "15 min ago",
    alert_message_en:
      "Rising water levels have been detected in vulnerable areas.",
    alert_message_local:
      "ارتفاع منسوب المياه قد يؤثر على المناطق المعرضة للفيضانات.",
    local_language: "Arabic",
  },
  {
    id: 3,
    location: "Lagos, Nigeria",
    risk: "Medium",
    time: "24 min ago",
    alert_message_en:
      "Moderate flood conditions are being monitored.",
    alert_message_local:
      "Ana lura da yanayin ambaliyar ruwa matsakaici.",
    local_language: "Somali",
  },
];

function RecentAlerts() {
  const [selectedAlert, setSelectedAlert] = useState(null);

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Bell size={19} />
            </div>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[1.6px] text-blue-600">
                EARLY WARNING
              </p>

              <h3 className="mt-1 text-xl font-bold text-slate-800">
                Recent Flood Alerts
              </h3>
            </div>

          </div>

          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-blue-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-800"
          >
            View all
            <ArrowRight size={15} />
          </button>

        </div>

        {/* Active notifications */}
        <div className="mx-6 mt-5 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-4">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
            <Bell size={18} />
          </div>

          <div>
            <p className="text-sm font-bold text-slate-700">
              {alerts.length} active notifications
            </p>

            <p className="mt-0.5 text-xs text-slate-400">
              Across the monitored network
            </p>
          </div>

        </div>

        {/* Alert list */}
        <div className="space-y-4 p-6">

          {alerts.map((alert) => {

            const isHigh = alert.risk === "High";
            const isArabic = alert.local_language === "Arabic";

            return (
              <article
                key={alert.id}
                onClick={() => setSelectedAlert(alert)}
                className="
                  group
                  cursor-pointer
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  p-5
                  transition-all
                  duration-200
                  hover:-translate-y-1
                  hover:border-blue-200
                  hover:bg-blue-50/30
                  hover:shadow-lg
                  hover:shadow-slate-200/50
                "
              >

                {/* Top section */}
                <div className="flex items-start justify-between gap-4">

                  <div className="flex min-w-0 items-center gap-3">

                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${
                        isHigh
                          ? "bg-red-50 text-red-600"
                          : "bg-orange-50 text-orange-600"
                      }`}
                    >
                      <AlertTriangle size={19} />
                    </div>

                    <div className="min-w-0">

                      <div className="flex items-center gap-1.5">

                        <MapPin
                          size={13}
                          className="shrink-0 text-slate-400"
                        />

                        <p className="truncate text-sm font-bold text-slate-700 transition-colors group-hover:text-blue-700">
                          {alert.location}
                        </p>

                      </div>

                      <p className="mt-1 text-xs font-medium text-slate-400">
                        Flood Risk Alert
                      </p>

                    </div>

                  </div>

                  {/* Risk badge */}
                  <span
                    className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase ${
                      isHigh
                        ? "bg-red-50 text-red-600"
                        : "bg-orange-50 text-orange-600"
                    }`}
                  >
                    {alert.risk}
                  </span>

                </div>

                {/* Language + time */}
                <div className="mt-5 flex items-center justify-between">

                  <span className="rounded-md bg-slate-100 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-500 transition-colors group-hover:bg-blue-50 group-hover:text-blue-700">
                    {alert.local_language}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock size={12} />
                    {alert.time}
                  </div>

                </div>

                {/* Local message preview */}
                <div className="mt-4 rounded-xl bg-slate-50 p-4 transition-colors group-hover:bg-white">

                  <div className="mb-2 flex items-center justify-between">

                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                      Local warning
                    </span>

                    <span className="text-[9px] font-bold text-blue-600">
                      View details
                    </span>

                  </div>

                  <p
                    dir={isArabic ? "rtl" : "ltr"}
                    lang={isArabic ? "ar" : undefined}
                    className={`line-clamp-2 text-sm font-medium leading-6 text-slate-600 ${
                      isArabic ? "text-right" : "text-left"
                    }`}
                  >
                    {alert.alert_message_local}
                  </p>

                </div>

                {/* Bottom action */}
                <div className="mt-4 flex items-center justify-between">

                  <span className="text-[10px] font-medium text-slate-400">
                    Click to investigate alert
                  </span>

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition-all duration-200 group-hover:bg-blue-600 group-hover:text-white">
                    <ChevronRight size={16} />
                  </div>

                </div>

              </article>
            );
          })}

        </div>

      </section>

      {/* Alert Details Panel */}
      <AlertDetails
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
      />
    </>
  );
}

export default RecentAlerts;