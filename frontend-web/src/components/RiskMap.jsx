import {
  Layers3,
  Maximize2,
  RefreshCw,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import "leaflet/dist/leaflet.css";

const API_URL = "http://localhost:8000/api/regions";

const riskStyles = {
  high: {
    color: "#ef4444",
    fillColor: "#ef4444",
  },
  medium: {
    color: "#f97316",
    fillColor: "#f97316",
  },
  low: {
    color: "#10b981",
    fillColor: "#10b981",
  },
};

function MapBounds({ regions }) {
  const map = useMap();

  useEffect(() => {
    const validRegions = regions.filter(
      (region) =>
        typeof region.latitude === "number" &&
        typeof region.longitude === "number"
    );

    if (validRegions.length === 0) return;

    const bounds = validRegions.map((region) => [
      region.latitude,
      region.longitude,
    ]);

    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 5,
    });
  }, [regions, map]);

  return null;
}

function RiskMap() {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const mapWrapperRef = useRef(null);

  const fetchRegions = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch regions");
      }

      const data = await response.json();

      setRegions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching map regions:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  const validRegions = useMemo(() => {
    return regions.filter(
      (region) =>
        typeof region.latitude === "number" &&
        typeof region.longitude === "number"
    );
  }, [regions]);

  const countries = useMemo(() => {
    return new Set(
      regions
        .map((region) => region.country)
        .filter(Boolean)
    ).size;
  }, [regions]);

  const handleFullscreen = async () => {
    if (!mapWrapperRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await mapWrapperRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  return (
    <section
      ref={mapWrapperRef}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Layers3 size={18} />
          </div>

          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[1.4px] text-blue-600">
              REGIONAL INTELLIGENCE
            </p>

            <h3 className="mt-0.5 text-xl font-bold text-slate-800">
              Africa Flood Risk Map
            </h3>

            <p className="mt-0.5 text-[11px] text-slate-400">
              Live geographic flood intelligence
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchRegions}
            disabled={loading}
            title="Refresh map data"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
          </button>

          <button
            type="button"
            title="Fullscreen"
            onClick={handleFullscreen}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="relative h-[420px] w-full">
        {error ? (
          <div className="flex h-full items-center justify-center bg-slate-50">
            <div className="text-center">
              <p className="text-sm font-bold text-slate-700">
                Map data unavailable
              </p>

              <button
                onClick={fetchRegions}
                className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                Try again
              </button>
            </div>
          </div>
        ) : (
          <MapContainer
            center={[5, 20]}
            zoom={3}
            minZoom={2}
            maxZoom={10}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapBounds regions={validRegions} />

            {validRegions.map((region, index) => {
              const riskLevel =
                region.risk_level?.toLowerCase() || "low";

              const style =
                riskStyles[riskLevel] || riskStyles.low;

              return (
                <CircleMarker
                  key={`${region.location_name}-${index}`}
                  center={[
                    region.latitude,
                    region.longitude,
                  ]}
                  radius={10}
                  pathOptions={{
                    color: "#ffffff",
                    weight: 3,
                    fillColor: style.fillColor,
                    fillOpacity: 0.95,
                  }}
                >
                  <Popup>
                    <div className="min-w-[180px]">
                      <p className="text-sm font-bold text-slate-800">
                        {region.location_name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {region.country}
                      </p>

                      <div className="mt-3 rounded-lg bg-slate-50 p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">
                            Risk level
                          </span>

                          <span
                            className={`text-xs font-bold uppercase ${
                              riskLevel === "high"
                                ? "text-red-600"
                                : riskLevel === "medium"
                                ? "text-orange-600"
                                : "text-emerald-600"
                            }`}
                          >
                            {riskLevel}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-slate-500">
                            Risk score
                          </span>

                          <span className="text-xs font-bold text-slate-800">
                            {typeof region.risk_score === "number"
                              ? Math.round(
                                  region.risk_score <= 1
                                    ? region.risk_score * 100
                                    : region.risk_score
                                )
                              : 0}
                            /100
                          </span>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-slate-500">
                            Rainfall
                          </span>

                          <span className="text-xs font-bold text-slate-800">
                            {region.rainfall_mm_24h ?? 0} mm
                          </span>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-slate-500">
                            River level
                          </span>

                          <span className="text-xs font-bold text-slate-800">
                            {region.river_level_m ?? 0} m
                          </span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        )}

        {/* Network status */}
        {!loading && !error && (
          <div className="absolute bottom-5 left-1/2 z-[1000] -translate-x-1/2">
            <div className="rounded-full border border-slate-200 bg-white/95 px-4 py-2 shadow-md backdrop-blur">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

                <span className="text-[10px] font-semibold text-slate-600">
                  Monitoring {validRegions.length} regions
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-5 right-5 z-[1000] rounded-xl border border-slate-200 bg-white/95 p-4 shadow-md backdrop-blur">
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

        {/* Country count */}
        {!loading && !error && (
          <div className="absolute left-5 top-5 z-[1000]">
            <div className="rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-md backdrop-blur">
              <p className="text-xs font-bold text-slate-700">
                Africa Monitoring Network
              </p>

              <p className="mt-1 text-[10px] text-slate-400">
                Monitoring {countries} countries
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default RiskMap;