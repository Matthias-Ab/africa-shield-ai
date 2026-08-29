import {
  Search,
  Bell,
  ChevronDown,
  CalendarDays,
  Menu,
  MapPin,
  X,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:8000/api/regions";

function Topbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [showDate, setShowDate] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [regions, setRegions] = useState([]);
  const [loadingRegions, setLoadingRegions] = useState(false);

  const [selectedRegion, setSelectedRegion] = useState(null);

  // --------------------------------------------------
  // Current date
  // --------------------------------------------------

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const shortDate = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // --------------------------------------------------
  // Fetch regions from backend
  // --------------------------------------------------

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoadingRegions(true);

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch regions");
        }

        const data = await response.json();

        setRegions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching regions:", error);
        setRegions([]);
      } finally {
        setLoadingRegions(false);
      }
    };

    fetchRegions();
  }, []);

  // --------------------------------------------------
  // Filter regions
  // --------------------------------------------------

  const filteredRegions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return regions;
    }

    return regions.filter((region) => {
      const location = region.location_name?.toLowerCase() || "";
      const country = region.country?.toLowerCase() || "";
      const risk = region.risk_level?.toLowerCase() || "";

      return (
        location.includes(query) ||
        country.includes(query) ||
        risk.includes(query)
      );
    });
  }, [regions, searchTerm]);

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  const getRegionName = (locationName, country) => {
    if (!locationName) {
      return "Unknown Region";
    }

    if (country && locationName.endsWith(`, ${country}`)) {
      return locationName.replace(`, ${country}`, "");
    }

    return locationName.split(",")[0].trim();
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case "high":
        return <AlertTriangle size={15} />;

      case "medium":
        return <ShieldAlert size={15} />;

      case "low":
        return <ShieldCheck size={15} />;

      default:
        return <MapPin size={15} />;
    }
  };

  const getRiskClasses = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case "high":
        return "bg-red-50 text-red-600";

      case "medium":
        return "bg-orange-50 text-orange-600";

      case "low":
        return "bg-emerald-50 text-emerald-600";

      default:
        return "bg-slate-50 text-slate-500";
    }
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

  // --------------------------------------------------
  // Search
  // --------------------------------------------------

  const handleSearchToggle = () => {
    setShowSearch((previous) => !previous);
    setShowDate(false);
    setSelectedRegion(null);

    if (showSearch) {
      setSearchTerm("");
    }
  };

  // --------------------------------------------------
  // Date
  // --------------------------------------------------

  const handleDateToggle = () => {
    setShowDate((previous) => !previous);
    setShowSearch(false);
    setSelectedRegion(null);
  };

  return (
    <header className="fixed top-0 z-30 flex h-[72px] w-full items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-8">
      {/* ------------------------------------------------ */}
      {/* Left side */}
      {/* ------------------------------------------------ */}

      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[1.4px] text-blue-600">
            AFRISHIELD COMMAND CENTER
          </p>

          <h2 className="mt-1 text-[20px] font-bold tracking-tight text-slate-800">
            Flood Risk Overview
          </h2>
        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* Right side */}
      {/* ------------------------------------------------ */}

      <div className="relative flex items-center gap-3">
        {/* ------------------------------------------------ */}
        {/* Search regions */}
        {/* ------------------------------------------------ */}

        <div className="relative">
          <button
            type="button"
            onClick={handleSearchToggle}
            className={`flex h-10 items-center gap-2 rounded-xl border px-3 transition ${
              showSearch
                ? "border-blue-200 bg-blue-50 text-blue-600"
                : "border-slate-200 bg-slate-50 text-slate-400 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            <Search size={17} />

            <span className="hidden text-[11px] font-medium md:block">
              Search regions...
            </span>

            <span className="hidden rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[8px] text-slate-400 lg:block">
              /
            </span>
          </button>

          {/* Search dropdown */}
          {showSearch && (
            <div className="absolute right-0 top-12 z-50 w-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              {/* Search input */}
              <div className="border-b border-slate-100 p-3">
                <div className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
                  <Search
                    size={16}
                    className="shrink-0 text-slate-400"
                  />

                  <input
                    type="text"
                    autoFocus
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                    placeholder="Search region or country..."
                    className="min-w-0 flex-1 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
                  />

                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Results heading */}
              <div className="flex items-center justify-between px-4 py-3">
                <p className="text-[10px] font-extrabold uppercase tracking-[1.3px] text-slate-400">
                  Monitored Regions
                </p>

                <span className="rounded-full bg-blue-50 px-2 py-1 text-[9px] font-bold text-blue-600">
                  {filteredRegions.length}
                </span>
              </div>

              {/* Results */}
              <div className="max-h-[300px] overflow-y-auto px-2 pb-2">
                {loadingRegions && (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
                  </div>
                )}

                {!loadingRegions &&
                  filteredRegions.length === 0 && (
                    <div className="px-4 py-8 text-center">
                      <MapPin
                        size={22}
                        className="mx-auto text-slate-300"
                      />

                      <p className="mt-2 text-xs font-bold text-slate-600">
                        No regions found
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        Try searching for a region or country.
                      </p>
                    </div>
                  )}

                {!loadingRegions &&
                  filteredRegions.map((region, index) => {
                    const riskLevel =
                      region.risk_level || "Unknown";

                    return (
                      <button
                        key={`${region.location_name}-${index}`}
                        type="button"
                        onClick={() => {
                          setSelectedRegion(region);
                          setSearchTerm(
                            getRegionName(
                              region.location_name,
                              region.country
                            )
                          );
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-slate-50"
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${getRiskClasses(
                            riskLevel
                          )}`}
                        >
                          {getRiskIcon(riskLevel)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-extrabold text-slate-700">
                            {getRegionName(
                              region.location_name,
                              region.country
                            )}
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-400">
                            {region.country || "Unknown country"}
                          </p>
                        </div>

                        <div className="text-right">
                          <p
                            className={`text-[9px] font-extrabold uppercase ${getRiskClasses(
                              riskLevel
                            )
                              .split(" ")
                              .filter((className) =>
                                className.startsWith("text-")
                              )
                              .join(" ")}`}
                          >
                            {riskLevel}
                          </p>

                          <p className="mt-1 text-[9px] font-semibold text-slate-400">
                            {getRiskScore(region)}/100
                          </p>
                        </div>
                      </button>
                    );
                  })}
              </div>

              {/* Selected region */}
              {selectedRegion && (
                <div className="border-t border-slate-100 bg-slate-50/70 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-extrabold uppercase tracking-wider text-blue-600">
                        SELECTED REGION
                      </p>

                      <p className="mt-1 text-sm font-extrabold text-slate-800">
                        {getRegionName(
                          selectedRegion.location_name,
                          selectedRegion.country
                        )}
                      </p>

                      <p className="text-[10px] text-slate-400">
                        {selectedRegion.country}
                      </p>
                    </div>

                    <div
                      className={`rounded-xl px-3 py-2 text-center ${getRiskClasses(
                        selectedRegion.risk_level
                      )}`}
                    >
                      <p className="text-lg font-extrabold">
                        {getRiskScore(selectedRegion)}
                      </p>

                      <p className="text-[8px] font-bold uppercase">
                        Risk score
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ------------------------------------------------ */}
        {/* Today / Date */}
        {/* ------------------------------------------------ */}

        <div className="relative">
          <button
            type="button"
            onClick={handleDateToggle}
            className={`hidden h-10 items-center gap-2 rounded-xl border px-3 transition md:flex ${
              showDate
                ? "border-blue-200 bg-blue-50 text-blue-600"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50"
            }`}
          >
            <CalendarDays
              size={16}
              className="text-blue-600"
            />

            <span className="text-[10px] font-semibold">
              Today
            </span>

            <ChevronDown
              size={14}
              className={`text-slate-400 transition ${
                showDate ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Date dropdown */}
          {showDate && (
            <div className="absolute right-0 top-12 z-50 w-[280px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-5 text-white">
                <div className="flex items-center gap-2 text-blue-100">
                  <CalendarDays size={16} />

                  <p className="text-[10px] font-extrabold uppercase tracking-[1.4px]">
                    MONITORING DATE
                  </p>
                </div>

                <p className="mt-4 text-2xl font-extrabold">
                  {today.toLocaleDateString("en-US", {
                    day: "numeric",
                  })}
                </p>

                <p className="mt-1 text-sm font-bold">
                  {today.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="p-4">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Today
                  </p>

                  <p className="mt-1 text-sm font-extrabold text-slate-800">
                    {formattedDate}
                  </p>

                  <p className="mt-2 text-[10px] leading-5 text-slate-400">
                    Flood risk information shown across the command center
                    corresponds to the current monitoring date.
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-slate-400">
                    Current date
                  </span>

                  <span className="font-extrabold text-blue-600">
                    {shortDate}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ------------------------------------------------ */}
        {/* Notifications */}
        {/* ------------------------------------------------ */}

        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
        >
          <Bell size={18} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
        </button>

        {/* Divider */}
        <div className="mx-1 hidden h-8 w-px bg-slate-200 sm:block" />

        {/* ------------------------------------------------ */}
        {/* Profile */}
        {/* ------------------------------------------------ */}

        <button
          type="button"
          className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-50"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-[11px] font-extrabold text-blue-700">
            HA
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-[11px] font-bold text-slate-700">
              Habiba
            </p>

            <p className="text-[9px] text-slate-400">
              Frontend Developer
            </p>
          </div>

          <ChevronDown
            size={14}
            className="hidden text-slate-400 sm:block"
          />
        </button>
      </div>
    </header>
  );
}

export default Topbar;