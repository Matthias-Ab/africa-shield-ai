import {
  AlertTriangle,
  Accessibility,
  BellRing,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Globe2,
  Languages,
  MapPin,
  Radio,
  RefreshCw,
  Send,
  ShieldAlert,
  Users,
  Volume2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:8000/api/regions";

function Reports() {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    region: "",
    incidentType: "",
    severity: "",
    peopleAffected: "",
    description: "",
  });

  const fetchRegions = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch regional data");
      }

      const data = await response.json();

      setRegions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching regional data:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  const riskSummary = useMemo(() => {
    const high = regions.filter(
      (region) => region.risk_level?.toLowerCase() === "high"
    ).length;

    const medium = regions.filter(
      (region) => region.risk_level?.toLowerCase() === "medium"
    ).length;

    const low = regions.filter(
      (region) => region.risk_level?.toLowerCase() === "low"
    ).length;

    return {
      high,
      medium,
      low,
      total: regions.length,
    };
  }, [regions]);

  const highRiskRegions = useMemo(() => {
    return regions
      .filter(
        (region) => region.risk_level?.toLowerCase() === "high"
      )
      .sort((a, b) => {
        const scoreA =
          a.risk_score ??
          a.risk_score_breakdown?.risk_score ??
          0;

        const scoreB =
          b.risk_score ??
          b.risk_score_breakdown?.risk_score ??
          0;

        return scoreB - scoreA;
      });
  }, [regions]);

  const getRegionName = (locationName, country) => {
    if (!locationName) {
      return "Unknown region";
    }

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

    if (typeof score !== "number") {
      return 0;
    }

    return score <= 1 ? Math.round(score * 100) : Math.round(score);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    /*
      The current backend exposes regional monitoring data.
      A community-report POST endpoint is not currently available.

      For now, this validates the reporting workflow in the frontend.
      Once the backend endpoint is available, this handler can be
      connected without redesigning the page.
    */

    setSubmitted(true);
  };

  return (
    <main className="min-h-full bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">

        {/* =========================================================
            PAGE HEADER
        ========================================================= */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />

              <p className="text-[10px] font-extrabold uppercase tracking-[1.7px] text-blue-600">
                COMMUNITY SAFETY
              </p>
            </div>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Reports & Community Response
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Connect ground-level community information with AfriShield
              flood intelligence to support faster, more inclusive response.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchRegions}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50 lg:self-auto"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            Refresh data
          </button>
        </div>

        {/* =========================================================
            COMMUNITY IMPACT BANNER
        ========================================================= */}
        <div className="mt-7 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 p-6 text-white shadow-lg shadow-blue-100">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                  <Globe2 size={19} />
                </div>

                <p className="text-[10px] font-extrabold uppercase tracking-[1.5px] text-blue-100">
                  LAST-MILE FLOOD INTELLIGENCE
                </p>
              </div>

              <h2 className="mt-4 text-xl font-extrabold sm:text-2xl">
                The community can become part of the warning system.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
                AI and environmental monitoring can identify flood risk,
                while people on the ground provide valuable information
                about what is actually happening in their communities.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[420px]">
              <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
                <Radio size={17} />
                <p className="mt-2 text-[10px] font-bold text-blue-100">
                  Radio
                </p>
              </div>

              <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
                <BellRing size={17} />
                <p className="mt-2 text-[10px] font-bold text-blue-100">
                  SMS
                </p>
              </div>

              <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
                <Volume2 size={17} />
                <p className="mt-2 text-[10px] font-bold text-blue-100">
                  Voice
                </p>
              </div>

              <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
                <Users size={17} />
                <p className="mt-2 text-[10px] font-bold text-blue-100">
                  Community
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            MAIN GRID
        ========================================================= */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">

          {/* =======================================================
              COMMUNITY REPORT FORM
          ======================================================= */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <ClipboardList size={19} />
                </div>

                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[1.4px] text-blue-600">
                    COMMUNITY REPORTING
                  </p>

                  <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                    Report a Flood Incident
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Share information from the ground to support faster
                    assessment and response.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">

              {/* Region */}
              <div>
                <label
                  htmlFor="region"
                  className="mb-2 block text-xs font-bold text-slate-700"
                >
                  Affected region
                </label>

                <select
                  id="region"
                  name="region"
                  value={form.region}
                  onChange={handleChange}
                  required
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                >
                  <option value="">
                    Select a monitored region
                  </option>

                  {regions.map((region, index) => (
                    <option
                      key={`${region.location_name}-${index}`}
                      value={region.location_name}
                    >
                      {getRegionName(
                        region.location_name,
                        region.country
                      )}{" "}
                      — {region.country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Incident + Severity */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="incidentType"
                    className="mb-2 block text-xs font-bold text-slate-700"
                  >
                    Incident type
                  </label>

                  <select
                    id="incidentType"
                    name="incidentType"
                    value={form.incidentType}
                    onChange={handleChange}
                    required
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  >
                    <option value="">Select incident</option>
                    <option value="Flooding">Flooding</option>
                    <option value="Rising water">
                      Rising water
                    </option>
                    <option value="Blocked road">
                      Blocked road
                    </option>
                    <option value="Damaged infrastructure">
                      Damaged infrastructure
                    </option>
                    <option value="Evacuation needed">
                      People need evacuation
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="severity"
                    className="mb-2 block text-xs font-bold text-slate-700"
                  >
                    Severity
                  </label>

                  <select
                    id="severity"
                    name="severity"
                    value={form.severity}
                    onChange={handleChange}
                    required
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  >
                    <option value="">
                      Select severity
                    </option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* People affected */}
              <div>
                <label
                  htmlFor="peopleAffected"
                  className="mb-2 block text-xs font-bold text-slate-700"
                >
                  Estimated people affected
                </label>

                <input
                  id="peopleAffected"
                  name="peopleAffected"
                  type="number"
                  min="0"
                  value={form.peopleAffected}
                  onChange={handleChange}
                  placeholder="e.g. 150"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-xs font-bold text-slate-700"
                >
                  What is happening?
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Describe the situation, affected roads, rising water, people needing assistance, or other important information..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              {/* Submit */}
              <div className="flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-2 text-[10px] leading-5 text-slate-400">
                  <ShieldAlert
                    size={14}
                    className="mt-0.5 shrink-0 text-blue-500"
                  />

                  <span>
                    Community information can complement automated
                    flood monitoring and help identify situations
                    requiring attention.
                  </span>
                </div>

                <button
                  type="submit"
                  className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-xs font-extrabold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 hover:shadow-md"
                >
                  <Send size={15} />
                  Submit report
                </button>
              </div>

              {submitted && (
                <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />

                  <div>
                    <p className="text-sm font-bold text-emerald-700">
                      Report captured successfully
                    </p>

                    <p className="mt-1 text-xs leading-5 text-emerald-600">
                      The reporting workflow is ready in the frontend.
                      The next step is connecting it to a backend
                      community-report endpoint for permanent storage
                      and processing.
                    </p>
                  </div>
                </div>
              )}
            </form>
          </section>

          {/* =======================================================
              HIGH RISK REGIONS
          ======================================================= */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-5">
              <p className="text-[10px] font-extrabold uppercase tracking-[1.4px] text-red-500">
                PRIORITY AREAS
              </p>

              <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                Regions Requiring Attention
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Current high-risk locations from the live monitoring
                network.
              </p>
            </div>

            {loading && (
              <div className="flex min-h-[300px] items-center justify-center">
                <RefreshCw
                  size={22}
                  className="animate-spin text-blue-500"
                />
              </div>
            )}

            {!loading && error && (
              <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
                <AlertTriangle
                  size={22}
                  className="text-red-500"
                />

                <p className="mt-3 text-sm font-bold text-slate-700">
                  Regional data unavailable
                </p>

                <button
                  type="button"
                  onClick={fetchRegions}
                  className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && (
              <div className="divide-y divide-slate-100">
                {highRiskRegions.map((region, index) => (
                  <div
                    key={`${region.location_name}-${index}`}
                    className="p-5 transition hover:bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
                          <MapPin size={16} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-extrabold text-slate-800">
                            {getRegionName(
                              region.location_name,
                              region.country
                            )}
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-400">
                            {region.country}
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full bg-red-50 px-2.5 py-1 text-[9px] font-extrabold uppercase text-red-600">
                        HIGH
                      </span>
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400">
                          Risk score
                        </p>

                        <p className="mt-1 text-xl font-extrabold text-slate-900">
                          {getRiskScore(region)}
                          <span className="ml-1 text-[10px] font-semibold text-slate-400">
                            /100
                          </span>
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] font-semibold text-slate-400">
                          Rainfall
                        </p>

                        <p className="mt-1 text-sm font-extrabold text-slate-700">
                          {region.rainfall_mm_24h ?? 0} mm
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-red-500"
                        style={{
                          width: `${Math.min(
                            getRiskScore(region),
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}

                {highRiskRegions.length === 0 && (
                  <div className="flex min-h-[250px] flex-col items-center justify-center px-6 text-center">
                    <CheckCircle2
                      size={24}
                      className="text-emerald-500"
                    />

                    <p className="mt-3 text-sm font-bold text-slate-700">
                      No high-risk regions
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      The monitored network currently has no regions
                      classified as high risk.
                    </p>
                  </div>
                )}
              </div>
            )}

            {!loading && !error && (
              <div className="border-t border-slate-100 bg-slate-50/60 p-5">
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-xl bg-red-50 p-3 text-center">
                    <p className="text-lg font-extrabold text-red-600">
                      {riskSummary.high}
                    </p>

                    <p className="text-[9px] font-bold uppercase tracking-wide text-red-400">
                      High
                    </p>
                  </div>

                  <div className="rounded-xl bg-orange-50 p-3 text-center">
                    <p className="text-lg font-extrabold text-orange-600">
                      {riskSummary.medium}
                    </p>

                    <p className="text-[9px] font-bold uppercase tracking-wide text-orange-400">
                      Medium
                    </p>
                  </div>

                  <div className="rounded-xl bg-emerald-50 p-3 text-center">
                    <p className="text-lg font-extrabold text-emerald-600">
                      {riskSummary.low}
                    </p>

                    <p className="text-[9px] font-bold uppercase tracking-wide text-emerald-400">
                      Low
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* =========================================================
            ACCESSIBILITY + COMMUNITY INCLUSION
        ========================================================= */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Accessibility size={19} />
              </div>

              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[1.4px] text-indigo-600">
                  INCLUSIVE EARLY WARNING
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                  Designed to reach people, not just devices
                </h2>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-400">
                  Flood warnings should remain useful for people who may
                  have limited internet access, disabilities, language
                  barriers, or limited access to smartphones.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-0 md:grid-cols-3">

            <div className="border-b border-slate-100 p-6 md:border-b-0 md:border-r">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Volume2 size={18} />
              </div>

              <h3 className="mt-4 text-sm font-extrabold text-slate-800">
                Accessible communication
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                Voice alerts and audio communication can help people who
                have difficulty reading text-based warnings.
              </p>
            </div>

            <div className="border-b border-slate-100 p-6 md:border-b-0 md:border-r">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Languages size={18} />
              </div>

              <h3 className="mt-4 text-sm font-extrabold text-slate-800">
                Local languages
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                Alerts can be adapted into languages understood by local
                communities instead of relying only on technical or
                national-level messaging.
              </p>
            </div>

            <div className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Users size={18} />
              </div>

              <h3 className="mt-4 text-sm font-extrabold text-slate-800">
                Community-led response
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                Community leaders, local responders, radio networks and
                other trusted channels can help reach people who are
                difficult to reach through digital platforms.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================
            DETECTION TO COMMUNITY WARNING
        ========================================================= */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[1.4px] text-blue-600">
              LAST-MILE RESPONSE
            </p>

            <h2 className="mt-1 text-xl font-extrabold text-slate-900">
              From Detection to Community Warning
            </h2>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400">
              AfriShield connects automated intelligence with information
              from people on the ground and multiple communication
              pathways.
            </p>
          </div>

          <div className="grid gap-0 md:grid-cols-4">
            {[
              {
                icon: ShieldAlert,
                title: "Detect",
                text: "AI models and environmental indicators identify changing flood risk.",
              },
              {
                icon: ClipboardList,
                title: "Verify",
                text: "Community reports provide ground-level information about actual conditions.",
              },
              {
                icon: BellRing,
                title: "Alert",
                text: "Warnings can be prepared for different audiences, needs and languages.",
              },
              {
                icon: Radio,
                title: "Reach",
                text: "SMS, radio, voice, community leaders and other channels extend warnings beyond smartphones.",
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="relative border-b border-slate-100 p-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={18} />
                  </div>

                  <p className="mt-4 text-sm font-extrabold text-slate-800">
                    {item.title}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    {item.text}
                  </p>

                  {index < 3 && (
                    <ChevronRight
                      size={16}
                      className="absolute right-3 top-1/2 hidden -translate-y-1/2 text-slate-300 md:block"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================
            FOOTER NOTE
        ========================================================= */}
        <div className="flex flex-col gap-2 px-1 py-6 text-[10px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>
            AfriShield Community Response • Live regional intelligence
          </span>

          <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Monitoring network active
          </span>
        </div>
      </section>
    </main>
  );
}

export default Reports;