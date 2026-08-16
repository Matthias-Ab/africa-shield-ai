import {
  AlertTriangle,
  BellRing,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Globe2,
  MapPin,
  RefreshCw,
  ShieldAlert,
  Volume2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:8000/api/regions";

function Alerts() {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch alert data");
      }

      const data = await response.json();

      setRegions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading alerts:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const alertRegions = useMemo(() => {
    return regions
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
          (priority[a.risk_level?.toLowerCase()] || 4) -
          (priority[b.risk_level?.toLowerCase()] || 4)
        );
      });
  }, [regions]);

  const statistics = useMemo(() => {
    const high = regions.filter(
      (region) => region.risk_level?.toLowerCase() === "high"
    ).length;

    const medium = regions.filter(
      (region) => region.risk_level?.toLowerCase() === "medium"
    ).length;

    return {
      active: high + medium,
      high,
      medium,
    };
  }, [regions]);

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

    return score <= 1 ? Math.round(score * 100) : Math.round(score);
  };

  const getAlertMessage = (region) => {
    return (
      region.alert_message_en ||
      region.alert_message ||
      `Flood risk is currently classified as ${region.risk_level || "unknown"} in this region.`
    );
  };

  const getRiskStyles = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case "high":
        return {
          icon: "bg-red-50 text-red-600",
          badge: "bg-red-50 text-red-600",
          border: "border-red-100",
          label: "HIGH PRIORITY",
        };

      case "medium":
        return {
          icon: "bg-orange-50 text-orange-600",
          badge: "bg-orange-50 text-orange-600",
          border: "border-orange-100",
          label: "MEDIUM PRIORITY",
        };

      default:
        return {
          icon: "bg-slate-50 text-slate-500",
          badge: "bg-slate-100 text-slate-500",
          border: "border-slate-100",
          label: "MONITOR",
        };
    }
  };

  return (
    <main className="min-h-full bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500" />

              <p className="text-[10px] font-extrabold uppercase tracking-[1.7px] text-red-500">
                EARLY WARNING
              </p>
            </div>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Flood Alerts
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Monitor active flood warnings and regional alerts generated
              from AfriShield flood-risk intelligence.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchAlerts}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 lg:self-auto"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            Refresh alerts
          </button>
        </div>

        {/* Warning Banner */}
        <div className="mt-7 overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-red-600 to-orange-500 p-6 text-white shadow-lg shadow-red-100">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                  <BellRing size={19} />
                </div>

                <p className="text-[10px] font-extrabold uppercase tracking-[1.5px] text-red-100">
                  ACTIVE EARLY WARNING NETWORK
                </p>
              </div>

              <h2 className="mt-4 text-xl font-extrabold sm:text-2xl">
                Flood conditions require continuous attention.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-red-100">
                AfriShield combines regional monitoring and flood-risk
                intelligence to identify locations where communities may
                require additional attention.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-extrabold">
                  {statistics.active}
                </p>

                <p className="mt-1 text-[10px] font-bold text-red-100">
                  Active alerts
                </p>
              </div>

              <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-extrabold">
                  {statistics.high}
                </p>

                <p className="mt-1 text-[10px] font-bold text-red-100">
                  High risk
                </p>
              </div>

              <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-extrabold">
                  {statistics.medium}
                </p>

                <p className="mt-1 text-[10px] font-bold text-red-100">
                  Medium risk
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          {/* Alerts List */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[1.4px] text-red-500">
                  ACTIVE WARNINGS
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                  Regional Alerts
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Locations currently classified as high or medium risk.
                </p>
              </div>

              <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 sm:flex">
                <ShieldAlert size={18} />
              </div>
            </div>

            {loading && (
              <div className="flex min-h-[350px] items-center justify-center">
                <RefreshCw
                  size={24}
                  className="animate-spin text-red-500"
                />
              </div>
            )}

            {!loading && error && (
              <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
                <AlertTriangle size={26} className="text-red-500" />

                <p className="mt-3 text-sm font-bold text-slate-700">
                  Alert data unavailable
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Unable to retrieve the latest regional alerts.
                </p>

                <button
                  type="button"
                  onClick={fetchAlerts}
                  className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700"
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && (
              <div className="divide-y divide-slate-100">
                {alertRegions.map((region, index) => {
                  const styles = getRiskStyles(region.risk_level);
                  const score = getRiskScore(region);

                  return (
                    <button
                      type="button"
                      key={`${region.location_name}-${index}`}
                      onClick={() => setSelectedAlert(region)}
                      className="group w-full p-5 text-left transition hover:bg-slate-50"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
                        >
                          <AlertTriangle size={19} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <MapPin
                                  size={13}
                                  className="shrink-0 text-slate-400"
                                />

                                <p className="text-sm font-extrabold text-slate-800">
                                  {getRegionName(
                                    region.location_name,
                                    region.country
                                  )}
                                </p>
                              </div>

                              <p className="mt-1 text-[10px] text-slate-400">
                                {region.country || "Unknown country"}
                              </p>
                            </div>

                            <span
                              className={`w-fit rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase ${styles.badge}`}
                            >
                              {styles.label}
                            </span>
                          </div>

                          <p className="mt-3 text-xs leading-5 text-slate-500">
                            {getAlertMessage(region)}
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-4 text-[10px] font-semibold text-slate-400">
                            <span className="flex items-center gap-1.5">
                              <ShieldAlert size={12} />
                              Risk score: {score}/100
                            </span>

                            <span className="flex items-center gap-1.5">
                              <Clock3 size={12} />
                              Live monitoring
                            </span>

                            {region.rainfall_mm_24h !== undefined && (
                              <span>
                                Rainfall: {region.rainfall_mm_24h} mm
                              </span>
                            )}

                            <span className="ml-auto flex items-center gap-1 text-blue-600 transition group-hover:gap-2">
                              View details
                              <ChevronRight size={13} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}

                {alertRegions.length === 0 && (
                  <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <CheckCircle2 size={24} />
                    </div>

                    <p className="mt-4 text-sm font-bold text-slate-700">
                      No active regional alerts
                    </p>

                    <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
                      The current monitoring network has no regions classified
                      as high or medium risk.
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Selected Alert / Response */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-5">
              <p className="text-[10px] font-extrabold uppercase tracking-[1.4px] text-blue-600">
                ALERT RESPONSE
              </p>

              <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                Alert Details
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Select an alert to inspect its regional information.
              </p>
            </div>

            {selectedAlert ? (
              <div className="p-5">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        LOCATION
                      </p>

                      <h3 className="mt-1 text-lg font-extrabold text-slate-900">
                        {getRegionName(
                          selectedAlert.location_name,
                          selectedAlert.country
                        )}
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        {selectedAlert.country}
                      </p>
                    </div>

                    <AlertTriangle
                      size={22}
                      className={
                        selectedAlert.risk_level?.toLowerCase() === "high"
                          ? "text-red-500"
                          : "text-orange-500"
                      }
                    />
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-[9px] font-bold uppercase text-slate-400">
                        Risk
                      </p>

                      <p className="mt-1 text-sm font-extrabold text-slate-800">
                        {selectedAlert.risk_level || "Unknown"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white p-3">
                      <p className="text-[9px] font-bold uppercase text-slate-400">
                        Score
                      </p>

                      <p className="mt-1 text-sm font-extrabold text-slate-800">
                        {getRiskScore(selectedAlert)}/100
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-blue-600">
                    WARNING MESSAGE
                  </p>

                  <p className="mt-2 text-xs leading-6 text-slate-500">
                    {getAlertMessage(selectedAlert)}
                  </p>
                </div>

                {selectedAlert.alert_message_local && (
                  <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
                    <div className="flex items-center gap-2">
                      <Globe2 size={15} className="text-blue-600" />

                      <p className="text-[10px] font-extrabold uppercase tracking-wide text-blue-600">
                        LOCALIZED MESSAGE
                      </p>
                    </div>

                    <p className="mt-2 text-xs leading-6 text-slate-600">
                      {selectedAlert.alert_message_local}
                    </p>

                    {selectedAlert.local_language && (
                      <p className="mt-2 text-[9px] font-bold uppercase text-blue-400">
                        Language: {selectedAlert.local_language}
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-100 p-4">
                    <Volume2 size={17} className="text-blue-600" />

                    <p className="mt-3 text-xs font-extrabold text-slate-700">
                      Voice & audio
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-slate-400">
                      Alerts can be adapted for voice-based community
                      communication.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 p-4">
                    <BellRing size={17} className="text-blue-600" />

                    <p className="mt-3 text-xs font-extrabold text-slate-700">
                      Community warning
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-slate-400">
                      Warning information can support last-mile response
                      channels.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <BellRing size={22} />
                </div>

                <p className="mt-4 text-sm font-bold text-slate-700">
                  No alert selected
                </p>

                <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
                  Select a regional alert from the list to view its details
                  and warning information.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Last Mile Warning */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[1.4px] text-blue-600">
              LAST-MILE WARNING
            </p>

            <h2 className="mt-1 text-xl font-extrabold text-slate-900">
              Turning Alerts Into Community Action
            </h2>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400">
              An alert becomes useful when it reaches people in a form they
              can understand and act upon.
            </p>
          </div>

          <div className="grid gap-0 md:grid-cols-3">
            <div className="border-b border-slate-100 p-6 md:border-b-0 md:border-r">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Globe2 size={18} />
              </div>

              <p className="mt-4 text-sm font-extrabold text-slate-800">
                Local languages
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                Warning information can be prepared in languages appropriate
                for the communities receiving the alert.
              </p>
            </div>

            <div className="border-b border-slate-100 p-6 md:border-b-0 md:border-r">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Volume2 size={18} />
              </div>

              <p className="mt-4 text-sm font-extrabold text-slate-800">
                Multiple channels
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                SMS, voice, radio and community-based communication can help
                warnings reach people beyond smartphone users.
              </p>
            </div>

            <div className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <ShieldAlert size={18} />
              </div>

              <p className="mt-4 text-sm font-extrabold text-slate-800">
                Faster response
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                Earlier awareness gives communities, responders and local
                authorities more time to prepare and act.
              </p>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between px-1 py-6 text-[10px] text-slate-400">
          <span>AfriShield Early Warning System</span>

          <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Alert monitoring active
          </span>
        </div>
      </section>
    </main>
  );
}

export default Alerts;