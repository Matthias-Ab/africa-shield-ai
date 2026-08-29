import {
  AlertTriangle,
  Accessibility,
  BellRing,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
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

const REGIONS_API_URL = "http://localhost:8000/api/regions";
const REPORTS_API_URL = "http://localhost:8000/api/hazard-reports";

function Reports() {
  const [regions, setRegions] = useState([]);
  const [reports, setReports] = useState([]);

  const [loadingRegions, setLoadingRegions] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);

  const [regionError, setRegionError] = useState(false);
  const [reportsError, setReportsError] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [form, setForm] = useState({
    location_name: "",
    category: "",
    description: "",
    needs_assistance: false,
    latitude: "",
    longitude: "",
  });

  // =========================================================
  // FETCH REGIONAL RISK DATA
  // =========================================================

  const fetchRegions = useCallback(async () => {
    try {
      setLoadingRegions(true);
      setRegionError(false);

      const response = await fetch(REGIONS_API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch regional data");
      }

      const data = await response.json();

      setRegions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching regional data:", error);
      setRegionError(true);
    } finally {
      setLoadingRegions(false);
    }
  }, []);

  // =========================================================
  // FETCH COMMUNITY HAZARD REPORTS
  // =========================================================

  const fetchReports = useCallback(async () => {
    try {
      setLoadingReports(true);
      setReportsError(false);

      const response = await fetch(REPORTS_API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch community reports");
      }

      const data = await response.json();

      setReports(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching community reports:", error);
      setReportsError(true);
    } finally {
      setLoadingReports(false);
    }
  }, []);

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchRegions();
    fetchReports();
  }, [fetchRegions, fetchReports]);

  // =========================================================
  // REFRESH BOTH DATA SOURCES
  // =========================================================

  const refreshAll = async () => {
    await Promise.all([fetchRegions(), fetchReports()]);
  };

  // =========================================================
  // RISK SUMMARY
  // =========================================================

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

  // =========================================================
  // HIGH-RISK REGIONS
  // =========================================================

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

  // =========================================================
  // COMMUNITY REPORT SUMMARY
  // =========================================================

  const reportSummary = useMemo(() => {
    const assistanceRequests = reports.filter(
      (report) => report.needs_assistance
    ).length;

    return {
      total: reports.length,
      assistanceRequests,
    };
  }, [reports]);

  // =========================================================
  // HELPERS
  // =========================================================

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

  const formatDate = (dateString) => {
    if (!dateString) {
      return "Unknown time";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Unknown time";
    }

    return date.toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // =========================================================
  // FORM HANDLING
  // =========================================================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setSubmitted(false);
    setSubmitError("");
  };

  // =========================================================
  // SUBMIT COMMUNITY REPORT
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setSubmitted(false);
    setSubmitError("");

    try {
      const payload = {
        category: form.category,
        description: form.description.trim() || null,
        location_name: form.location_name,
        needs_assistance: form.needs_assistance,
        latitude:
          form.latitude.trim() === ""
            ? null
            : Number(form.latitude),

        longitude:
          form.longitude.trim() === ""
            ? null
            : Number(form.longitude),
      };

      // Validate coordinates if the user entered them
      if (
        payload.latitude !== null &&
        !Number.isFinite(payload.latitude)
      ) {
        throw new Error("Latitude must be a valid number.");
      }

      if (
        payload.longitude !== null &&
        !Number.isFinite(payload.longitude)
      ) {
        throw new Error("Longitude must be a valid number.");
      }

      const response = await fetch(REPORTS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let message = "Failed to submit the community report.";

        try {
          const errorData = await response.json();

          if (errorData?.detail) {
            if (Array.isArray(errorData.detail)) {
              message = errorData.detail
                .map((item) => item.msg)
                .join(", ");
            } else {
              message = errorData.detail;
            }
          }
        } catch {
          // Keep default error message
        }

        throw new Error(message);
      }

      const createdReport = await response.json();

      // Add the newly created report immediately
      setReports((previous) => [
        ...previous,
        createdReport,
      ]);

      // Reset form
      setForm({
        location_name: "",
        category: "",
        description: "",
        needs_assistance: false,
        latitude: "",
        longitude: "",
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting community report:", error);

      setSubmitError(
        error.message ||
          "Unable to submit the report. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
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
            onClick={refreshAll}
            disabled={loadingRegions || loadingReports}
            className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50 lg:self-auto"
          >
            <RefreshCw
              size={15}
              className={
                loadingRegions || loadingReports
                  ? "animate-spin"
                  : ""
              }
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
            COMMUNITY REPORT STATISTICS
        ========================================================= */}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[1.3px] text-slate-400">
                  COMMUNITY REPORTS
                </p>

                <p className="mt-2 text-3xl font-extrabold text-slate-900">
                  {loadingReports ? "—" : reportSummary.total}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Ground-level reports received
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <ClipboardList size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[1.3px] text-red-500">
                  ASSISTANCE REQUESTS
                </p>

                <p className="mt-2 text-3xl font-extrabold text-slate-900">
                  {loadingReports
                    ? "—"
                    : reportSummary.assistanceRequests}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Reports requesting immediate help
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <ShieldAlert size={20} />
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

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {/* Location */}

              <div>
                <label
                  htmlFor="location_name"
                  className="mb-2 block text-xs font-bold text-slate-700"
                >
                  Affected location
                </label>

                <select
                  id="location_name"
                  name="location_name"
                  value={form.location_name}
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

              {/* Category */}

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-xs font-bold text-slate-700"
                >
                  Incident type
                </label>

                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                >
                  <option value="">
                    Select incident
                  </option>

                  <option value="Flooding">
                    Flooding
                  </option>

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

                  <option value="Other">
                    Other
                  </option>
                </select>
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

              {/* Assistance */}

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-red-100 bg-red-50/60 p-4">
                <input
                  type="checkbox"
                  name="needs_assistance"
                  checked={form.needs_assistance}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                />

                <span>
                  <span className="block text-sm font-extrabold text-red-700">
                    Immediate assistance needed
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-red-500">
                    Select this if people at the reported location
                    need help, evacuation, or urgent response.
                  </span>
                </span>
              </label>

              {/* Optional GPS */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Location coordinates
                  </label>

                  <span className="text-[10px] font-semibold text-slate-400">
                    Optional
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    name="latitude"
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={handleChange}
                    placeholder="Latitude"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />

                  <input
                    name="longitude"
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={handleChange}
                    placeholder="Longitude"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>

                <p className="mt-2 text-[10px] leading-5 text-slate-400">
                  Coordinates are optional. If available, they help
                  responders understand the precise location of the report.
                </p>
              </div>

              {/* Submit */}

              <div className="flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-2 text-[10px] leading-5 text-slate-400">
                  <ShieldAlert
                    size={14}
                    className="mt-0.5 shrink-0 text-blue-500"
                  />

                  <span>
                    Your report is sent directly to the AfriShield
                    backend and stored for community response.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-xs font-extrabold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <RefreshCw
                        size={15}
                        className="animate-spin"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Submit report
                    </>
                  )}
                </button>
              </div>

              {/* Success */}

              {submitted && (
                <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />

                  <div>
                    <p className="text-sm font-bold text-emerald-700">
                      Report submitted successfully
                    </p>

                    <p className="mt-1 text-xs leading-5 text-emerald-600">
                      Your community report has been received by the
                      AfriShield backend and is now part of the
                      community response data.
                    </p>
                  </div>
                </div>
              )}

              {/* Error */}

              {submitError && (
                <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
                  <AlertTriangle
                    size={18}
                    className="mt-0.5 shrink-0 text-red-600"
                  />

                  <div>
                    <p className="text-sm font-bold text-red-700">
                      Report could not be submitted
                    </p>

                    <p className="mt-1 text-xs leading-5 text-red-600">
                      {submitError}
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

            {loadingRegions && (
              <div className="flex min-h-[300px] items-center justify-center">
                <RefreshCw
                  size={22}
                  className="animate-spin text-blue-500"
                />
              </div>
            )}

            {!loadingRegions && regionError && (
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

            {!loadingRegions && !regionError && (
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

            {!loadingRegions && !regionError && (
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
            COMMUNITY REPORTS FROM BACKEND
        ========================================================= */}

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[1.4px] text-blue-600">
                LIVE COMMUNITY INPUT
              </p>

              <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                Recent Community Reports
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Real reports submitted through the AfriShield
                community reporting API.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchReports}
              disabled={loadingReports}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-[10px] font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
            >
              <RefreshCw
                size={13}
                className={
                  loadingReports ? "animate-spin" : ""
                }
              />
              Refresh reports
            </button>
          </div>

          {loadingReports && (
            <div className="flex min-h-[180px] items-center justify-center">
              <RefreshCw
                size={22}
                className="animate-spin text-blue-500"
              />
            </div>
          )}

          {!loadingReports && reportsError && (
            <div className="flex min-h-[180px] flex-col items-center justify-center px-6 text-center">
              <AlertTriangle
                size={22}
                className="text-red-500"
              />

              <p className="mt-3 text-sm font-bold text-slate-700">
                Community reports unavailable
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Make sure the FastAPI backend is running on port 8000.
              </p>

              <button
                type="button"
                onClick={fetchReports}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                Try again
              </button>
            </div>
          )}

          {!loadingReports &&
            !reportsError &&
            reports.length === 0 && (
              <div className="flex min-h-[180px] flex-col items-center justify-center px-6 text-center">
                <ClipboardList
                  size={25}
                  className="text-slate-300"
                />

                <p className="mt-3 text-sm font-bold text-slate-700">
                  No community reports yet
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Reports submitted through the community form will
                  appear here.
                </p>
              </div>
            )}

          {!loadingReports &&
            !reportsError &&
            reports.length > 0 && (
              <div className="divide-y divide-slate-100">
                {[...reports]
                  .reverse()
                  .map((report) => (
                    <div
                      key={report.id}
                      className="p-5 transition hover:bg-slate-50"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex min-w-0 gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                              report.needs_assistance
                                ? "bg-red-50 text-red-600"
                                : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            {report.needs_assistance ? (
                              <ShieldAlert size={18} />
                            ) : (
                              <ClipboardList size={18} />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm font-extrabold text-slate-800">
                                {report.category ||
                                  "Community report"}
                              </h3>

                              {report.needs_assistance && (
                                <span className="rounded-full bg-red-50 px-2 py-1 text-[9px] font-extrabold uppercase text-red-600">
                                  Assistance needed
                                </span>
                              )}

                              {report.has_photo && (
                                <span className="rounded-full bg-indigo-50 px-2 py-1 text-[9px] font-extrabold uppercase text-indigo-600">
                                  Photo
                                </span>
                              )}
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-400">
                              <span className="inline-flex items-center gap-1">
                                <MapPin size={12} />
                                {report.location_name ||
                                  "Unknown location"}
                              </span>

                              <span className="inline-flex items-center gap-1">
                                <Clock3 size={12} />
                                {formatDate(report.submitted_at)}
                              </span>
                            </div>

                            {report.description && (
                              <p className="mt-3 max-w-3xl text-xs leading-5 text-slate-500">
                                {report.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {report.has_photo && (
                          <a
                            href={`${REPORTS_API_URL}/${report.id}/photo`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-bold text-blue-600 transition hover:border-blue-200 hover:bg-blue-50"
                          >
                            View photo
                            <ChevronRight size={13} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
        </section>

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
            FOOTER
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