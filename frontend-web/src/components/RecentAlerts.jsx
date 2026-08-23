import {
  AlertTriangle,
  ArrowRight,
  Bell,
  MapPin,
  Clock,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

import { useCallback, useEffect, useState } from "react";
import AlertDetails from "./AlertDetails";

const API_URL = "http://localhost:8000/api/regions";

function RecentAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch alerts");
      }

      const data = await response.json();

      /*
       * The backend provides regional data.
       * We treat HIGH and MEDIUM risk regions as active alerts.
       */
      const activeAlerts = (Array.isArray(data) ? data : [])
        .filter((region) => {
          const risk = region.risk_level?.toLowerCase();
          return risk === "high" || risk === "medium";
        })
        .sort((a, b) => {
          const priority = {
            high: 1,
            medium: 2,
            low: 3,
          };

          return (
            (priority[a.risk_level?.toLowerCase()] || 99) -
            (priority[b.risk_level?.toLowerCase()] || 99)
          );
        });

      setAlerts(activeAlerts);
    } catch (err) {
      console.error("Error fetching recent alerts:", err);
      setError(true);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const getRegionName = (locationName, country) => {
    if (!locationName) return "Unknown region";

    if (country && locationName.endsWith(`, ${country}`)) {
      return locationName.replace(`, ${country}`, "");
    }

    return locationName.split(",")[0].trim();
  };

  const getRiskScore = (region) => {
    const score =
      region.risk_score ??
      region.risk_score_breakdown?.risk_score ??
      0;

    if (typeof score !== "number") return 0;

    return score <= 1
      ? Math.round(score * 100)
      : Math.round(score);
  };

  const getAlertMessage = (region) => {
    return (
      region.alert_message_en ||
      region.alert_message ||
      "Flood risk is being monitored in this region."
    );
  };

  const getLocalMessage = (region) => {
    return (
      region.alert_message_local ||
      region.alert_message_en ||
      region.alert_message ||
      "Flood risk is currently being monitored."
    );
  };

  const getRiskStyles = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case "high":
        return {
          icon: "bg-red-50 text-red-600",
          badge: "bg-red-50 text-red-600",
        };

      case "medium":
        return {
          icon: "bg-orange-50 text-orange-600",
          badge: "bg-orange-50 text-orange-600",
        };

      default:
        return {
          icon: "bg-slate-50 text-slate-500",
          badge: "bg-slate-50 text-slate-500",
        };
    }
  };

  const getTimeLabel = (region) => {
    /*
     * If the backend later provides a timestamp, use it here.
     * For now we avoid inventing a time and simply show live status.
     */
    if (region.updated_at) {
      const date = new Date(region.updated_at);

      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleString();
      }
    }

    if (region.timestamp) {
      const date = new Date(region.timestamp);

      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleString();
      }
    }

    return "Live";
  };

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
            onClick={fetchAlerts}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-blue-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw size={15} className="animate-spin" />
            ) : (
              <>
                View all
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>

        {/* Active notifications */}
        {!loading && !error && (
          <div className="mx-6 mt-5 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
              <Bell size={18} />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-700">
                {alerts.length} active notifications
              </p>

              <p className="mt-0.5 text-xs text-slate-400">
                High and medium risk regions across the monitored network
              </p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[250px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw
                size={28}
                className="animate-spin text-blue-500"
              />

              <p className="text-xs font-semibold text-slate-500">
                Loading live flood alerts...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex min-h-[250px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
              <AlertTriangle size={21} />
            </div>

            <p className="mt-4 text-sm font-bold text-slate-700">
              Alert data unavailable
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Unable to retrieve the latest flood alerts.
            </p>

            <button
              type="button"
              onClick={fetchAlerts}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        )}

        {/* No alerts */}
        {!loading && !error && alerts.length === 0 && (
          <div className="flex min-h-[250px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Bell size={21} />
            </div>

            <p className="mt-4 text-sm font-bold text-slate-700">
              No active flood alerts
            </p>

            <p className="mt-1 text-xs text-slate-400">
              All monitored regions are currently below the alert threshold.
            </p>
          </div>
        )}

        {/* Alert list */}
        {!loading && !error && alerts.length > 0 && (
          <div className="space-y-4 p-6">
            {alerts.map((alert, index) => {
              const riskLevel =
                alert.risk_level?.toLowerCase() || "medium";

              const isHigh = riskLevel === "high";
              const isArabic =
                alert.local_language?.toLowerCase() === "arabic";

              const styles = getRiskStyles(riskLevel);
              const score = getRiskScore(alert);

              return (
                <article
                  key={`${alert.location_name}-${index}`}
                  onClick={() => setSelectedAlert(alert)}
                  className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-lg hover:shadow-slate-200/50"
                >
                  {/* Top section */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${styles.icon}`}
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
                            {getRegionName(
                              alert.location_name,
                              alert.country
                            )}
                          </p>
                        </div>

                        <p className="mt-1 text-xs font-medium text-slate-400">
                          {alert.country || "Unknown country"}
                        </p>
                      </div>
                    </div>

                    {/* Risk badge */}
                    <span
                      className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase ${styles.badge}`}
                    >
                      {riskLevel}
                    </span>
                  </div>

                  {/* Risk information */}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-slate-50 px-3 py-2">
                      <p className="text-[9px] font-extrabold uppercase tracking-wide text-slate-400">
                        Risk score
                      </p>

                      <p className="mt-1 text-sm font-extrabold text-slate-700">
                        {score}/100
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 px-3 py-2">
                      <p className="text-[9px] font-extrabold uppercase tracking-wide text-slate-400">
                        Rainfall
                      </p>

                      <p className="mt-1 text-sm font-extrabold text-slate-700">
                        {alert.rainfall_mm_24h ?? 0} mm
                      </p>
                    </div>
                  </div>

                  {/* Language + time */}
                  <div className="mt-5 flex items-center justify-between">
                    <span className="rounded-md bg-slate-100 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-500 transition-colors group-hover:bg-blue-50 group-hover:text-blue-700">
                      {alert.local_language || "English"}
                    </span>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock size={12} />
                      {getTimeLabel(alert)}
                    </div>
                  </div>

                  {/* English message */}
                  <div className="mt-4 rounded-xl bg-slate-50 p-4 transition-colors group-hover:bg-white">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                        Warning
                      </span>

                      <span className="text-[9px] font-bold text-blue-600">
                        View details
                      </span>
                    </div>

                    <p className="line-clamp-2 text-sm font-medium leading-6 text-slate-600">
                      {getAlertMessage(alert)}
                    </p>
                  </div>

                  {/* Local message */}
                  {alert.alert_message_local && (
                    <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                      <div className="mb-2">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-blue-500">
                          Local warning
                        </span>
                      </div>

                      <p
                        dir={isArabic ? "rtl" : "ltr"}
                        lang={isArabic ? "ar" : undefined}
                        className={`line-clamp-2 text-sm font-medium leading-6 text-slate-600 ${
                          isArabic ? "text-right" : "text-left"
                        }`}
                      >
                        {getLocalMessage(alert)}
                      </p>
                    </div>
                  )}

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
        )}
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